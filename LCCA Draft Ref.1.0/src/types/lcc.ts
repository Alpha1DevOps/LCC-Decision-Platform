export interface CostItem {
    id: string;
    name: string;
    value: number; // Cost amount
    frequency: 'yearly' | 'one-time' | 'every-n-years';
    year?: number; // For one-time
    interval?: number; // For every-n-years
}

export interface OptionData {
    id: string;
    name: string;
    initialCost: number;
    maintenanceCosts: CostItem[];
    operationCosts: CostItem[]; // Usually yearly
    demolishCost: number;
    salvageValue: number;
}

export interface GlobalConfig {
    lifespan: number;
    inflationRate: number; // Percentage (e.g., 3 for 3%)
    discountRate: number; // Percentage (e.g., 5 for 5%)
}

export interface YearCashFlow {
    year: number;
    cost: number;
    discountedCost: number;
    cumulativeNPV: number;
}

export interface AnalysisResult {
    optionId: string;
    totalNPV: number;
    eac: number; // Equivalent Annual Cost
    cashFlows: YearCashFlow[];
}
