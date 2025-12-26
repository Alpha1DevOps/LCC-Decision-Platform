import { GlobalConfig, OptionData, AnalysisResult, YearCashFlow, CostItem } from '../types/lcc';

export const calculateFutureCost = (cost: number, inflationRate: number, year: number): number => {
    return cost * Math.pow(1 + inflationRate / 100, year);
};

export const calculatePV = (futureCost: number, discountRate: number, year: number): number => {
    return futureCost / Math.pow(1 + discountRate / 100, year);
};

// Calculate cost for a specific year based on frequency
const getCostForYear = (item: CostItem, year: number, lifespan: number): number => {
    if (year === 0) return 0; // Maintenance/Ops usually start year 1+

    if (item.frequency === 'yearly') {
        return item.value;
    }
    if (item.frequency === 'one-time') {
        return item.year === year ? item.value : 0;
    }
    if (item.frequency === 'every-n-years') {
        return (item.interval && year % item.interval === 0) ? item.value : 0;
    }
    return 0;
};

export const analyzeOption = (option: OptionData, config: GlobalConfig): AnalysisResult => {
    const { lifespan, inflationRate, discountRate } = config;
    const cashFlows: YearCashFlow[] = [];
    let totalNPV = 0;

    // Year 0: Initial Cost
    let cumulativeNPV = option.initialCost;
    cashFlows.push({
        year: 0,
        cost: option.initialCost,
        discountedCost: option.initialCost,
        cumulativeNPV,
    });
    totalNPV += option.initialCost;

    // Years 1 to Lifespan
    for (let year = 1; year <= lifespan; year++) {
        let yearlyCostRaw = 0;

        // Maintenance Costs
        option.maintenanceCosts.forEach(item => {
            yearlyCostRaw += getCostForYear(item, year, lifespan);
        });

        // Operation Costs
        option.operationCosts.forEach(item => {
            yearlyCostRaw += getCostForYear(item, year, lifespan);
        });

        // Apply Inflation
        const futureCost = calculateFutureCost(yearlyCostRaw, inflationRate, year);

        // Apply Demolish/Salvage at the end
        let finalYearAdjustment = 0;
        if (year === lifespan) {
            // Demolish is a cost (+), Salvage is a gain/negative cost (-)
            // We assume these are essentially occurring at the end, affected by inflation?
            // Usually salvage/demolish estimates are "current value" projected to future, or fixed.
            // Let's assume input is current value, so we inflate it.
            const demolish = calculateFutureCost(option.demolishCost, inflationRate, year);
            const salvage = calculateFutureCost(option.salvageValue, inflationRate, year);
            finalYearAdjustment = demolish - salvage;
        }

        const totalYearCost = futureCost + finalYearAdjustment;

        // Calculate PV
        const pv = calculatePV(totalYearCost, discountRate, year);

        totalNPV += pv;
        cumulativeNPV += pv;

        cashFlows.push({
            year,
            cost: totalYearCost,
            discountedCost: pv,
            cumulativeNPV
        });
    }

    // Calculate EAC
    // Formula: NPV * r / (1 - (1+r)^-n)
    const r = discountRate / 100;
    const n = lifespan;
    let eac = 0;
    if (r === 0) {
        eac = totalNPV / n;
    } else {
        eac = (totalNPV * r) / (1 - Math.pow(1 + r, -n));
    }

    return {
        optionId: option.id,
        totalNPV,
        eac,
        cashFlows
    };
};

export const analyzeAll = (options: OptionData[], config: GlobalConfig): AnalysisResult[] => {
    return options.map(opt => analyzeOption(opt, config));
};
