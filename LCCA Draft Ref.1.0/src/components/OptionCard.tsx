import React from 'react';
import { OptionData } from '../types/lcc';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { DynamicCostList } from './DynamicCostList';
import { Trash2 } from 'lucide-react';
import { useLCC } from '../context/LCCContext';

interface OptionCardProps {
    option: OptionData;
}

export const OptionCard: React.FC<OptionCardProps> = ({ option }) => {
    const { updateOption, removeOption, options } = useLCC();

    // Prevent deleting the last option ? Or allow it? PRD: "Default 3", "Add unlimited".
    // Let's allow deleting down to 1 maybe?
    const canDelete = options.length > 1;

    return (
        <Card className="min-w-[350px] w-[350px] shrink-0 flex flex-col h-full border-t-4 border-t-indigo-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b border-gray-100">
                <Input
                    className="font-bold text-lg bg-transparent border-transparent focus:bg-white focus:border-blue-500 hover:border-gray-200 transition-colors"
                    value={option.name}
                    onChange={(e) => updateOption(option.id, { name: e.target.value })}
                />
                {canDelete && (
                    <Button variant="ghost" size="sm" onClick={() => removeOption(option.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>

            <CardContent className="space-y-6 overflow-y-auto max-h-[600px] flex-1">

                {/* Section 1: Initial Cost */}
                <div className="space-y-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">1. Initial Investment</h4>
                    <Input
                        label="Total Initial Cost"
                        type="number"
                        value={option.initialCost || ''}
                        onChange={(e) => updateOption(option.id, { initialCost: parseFloat(e.target.value) || 0 })}
                    />
                </div>

                {/* Section 2: Maintenance */}
                <DynamicCostList
                    title="2. Maintenance Costs"
                    items={option.maintenanceCosts}
                    onChange={(items) => updateOption(option.id, { maintenanceCosts: items })}
                />

                {/* Section 3: Operation */}
                <DynamicCostList
                    title="3. Operation Costs"
                    items={option.operationCosts}
                    onChange={(items) => updateOption(option.id, { operationCosts: items })}
                />

                {/* Section 4: End of Life */}
                <div className="space-y-3 p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                    <h4 className="text-sm font-semibold text-orange-800 uppercase tracking-wide">4. End of Life</h4>
                    <div className="space-y-3">
                        <Input
                            label="Demolish Cost (+)"
                            type="number"
                            value={option.demolishCost || ''}
                            onChange={(e) => updateOption(option.id, { demolishCost: parseFloat(e.target.value) || 0 })}
                        />
                        <Input
                            label="Salvage Value (-)"
                            type="number"
                            value={option.salvageValue || ''}
                            onChange={(e) => updateOption(option.id, { salvageValue: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
