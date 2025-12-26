import React, { createContext, useContext, useState, useEffect } from 'react';
import { GlobalConfig, OptionData, AnalysisResult } from '../types/lcc';
import { analyzeAll } from '../utils/lcc-calculations';

interface LCCContextType {
    options: OptionData[];
    config: GlobalConfig;
    results: AnalysisResult[];
    addOption: () => void;
    removeOption: (id: string) => void;
    updateOption: (id: string, data: Partial<OptionData>) => void;
    updateConfig: (data: Partial<GlobalConfig>) => void;
    runAnalysis: () => void;
}

const defaultOptions: OptionData[] = [
    {
        id: '1',
        name: 'Option 1 (Repair)',
        initialCost: 0,
        maintenanceCosts: [{ id: 'm1', name: 'Annual Repair', value: 5000, frequency: 'yearly' }],
        operationCosts: [],
        demolishCost: 0,
        salvageValue: 0,
    },
    {
        id: '2',
        name: 'Option 2 (Replace Brand A)',
        initialCost: 100000,
        maintenanceCosts: [{ id: 'm2', name: 'Service', value: 2000, frequency: 'yearly' }],
        operationCosts: [],
        demolishCost: 0,
        salvageValue: 10000,
    },
    {
        id: '3',
        name: 'Option 3 (Replace Brand B)',
        initialCost: 150000,
        maintenanceCosts: [{ id: 'm3', name: 'Service', value: 1000, frequency: 'yearly' }],
        operationCosts: [],
        demolishCost: 0,
        salvageValue: 20000,
    },
];

const defaultConfig: GlobalConfig = {
    lifespan: 10,
    inflationRate: 3,
    discountRate: 5,
};

const LCCContext = createContext<LCCContextType | undefined>(undefined);

export const LCCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [options, setOptions] = useState<OptionData[]>(defaultOptions);
    const [config, setConfig] = useState<GlobalConfig>(defaultConfig);
    const [results, setResults] = useState<AnalysisResult[]>([]);

    // Auto-run analysis when data changes? Or wait for button?
    // PRD says "Start Analysis Button", so we'll make it manual or at least via function call.
    // However, for reactive UI, it's often nice to see changes. Let's strictly follow "Start Analysis button" request from PRD flow 
    // "4. ปุ่ม Start Analysis สำหรับเริ่มการวิเคราะห์ข้อมูลและแสดง report"
    // But also "4.3 ... แสดง Line Chart ด้านข้างทันทีที่มีการเปลี่ยนตัวเลข" -> Wait, 5.3 says "immdieately when numbers change".
    // Conflicting requirements? 
    // 5.4 says "Button to Start Analysis". 
    // I will support both. I'll make `runAnalysis` available, and maybe calling it in useEffect if we want specific real-time behavior.
    // Let's implement manual trigger primarily but maybe auto-trigger if results exist (update mode).

    const addOption = () => {
        const newId = (Math.max(...options.map(o => parseInt(o.id) || 0)) + 1).toString();
        setOptions([...options, {
            id: newId,
            name: `Option ${newId}`,
            initialCost: 0,
            maintenanceCosts: [],
            operationCosts: [],
            demolishCost: 0,
            salvageValue: 0,
        }]);
    };

    const removeOption = (id: string) => {
        setOptions(options.filter(o => o.id !== id));
    };

    const updateOption = (id: string, data: Partial<OptionData>) => {
        setOptions(options.map(o => o.id === id ? { ...o, ...data } : o));
    };

    const updateConfig = (data: Partial<GlobalConfig>) => {
        setConfig({ ...config, ...data });
    };

    const runAnalysis = () => {
        const calculated = analyzeAll(options, config);
        setResults(calculated);
    };

    // Effect to auto-update ONLY if results are already showing (live update mode)
    useEffect(() => {
        if (results.length > 0) {
            runAnalysis();
        }
    }, [options, config]);

    return (
        <LCCContext.Provider value={{ options, config, results, addOption, removeOption, updateOption, updateConfig, runAnalysis }}>
            {children}
        </LCCContext.Provider>
    );
};

export const useLCC = () => {
    const context = useContext(LCCContext);
    if (!context) {
        throw new Error('useLCC must be used within a LCCProvider');
    }
    return context;
};
