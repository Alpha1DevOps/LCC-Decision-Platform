import React from 'react';
import { useLCC } from '../context/LCCContext';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Input } from './ui/Input';
import { Settings } from 'lucide-react';

export const GlobalConfigPanel: React.FC = () => {
    const { config, updateConfig } = useLCC();

    return (
        <Card className="mb-8 border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-800">Global Configuration</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Project Lifespan (Years)"
                    type="number"
                    min="1"
                    value={config.lifespan}
                    onChange={(e) => updateConfig({ lifespan: parseInt(e.target.value) || 0 })}
                />
                <Input
                    label="Inflation Rate (% per year)"
                    type="number"
                    step="0.1"
                    value={config.inflationRate}
                    onChange={(e) => updateConfig({ inflationRate: parseFloat(e.target.value) || 0 })}
                />
                <Input
                    label="Discount Rate / Cost of Capital (%)"
                    type="number"
                    step="0.1"
                    value={config.discountRate}
                    onChange={(e) => updateConfig({ discountRate: parseFloat(e.target.value) || 0 })}
                />
            </CardContent>
        </Card>
    );
};
