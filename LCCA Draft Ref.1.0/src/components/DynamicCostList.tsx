import React from 'react';
import { CostItem } from '../types/lcc';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Trash2, Plus } from 'lucide-react';

interface DynamicCostListProps {
    title: string;
    items: CostItem[];
    onChange: (items: CostItem[]) => void;
}

export const DynamicCostList: React.FC<DynamicCostListProps> = ({ title, items, onChange }) => {
    const addItem = () => {
        const newItem: CostItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: `New ${title} Item`,
            value: 0,
            frequency: 'yearly',
        };
        onChange([...items, newItem]);
    };

    const updateItem = (id: string, updates: Partial<CostItem>) => {
        onChange(items.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const removeItem = (id: string) => {
        onChange(items.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h4>
                <Button size="sm" variant="ghost" onClick={addItem} className="text-blue-600 hover:text-blue-700">
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
            </div>

            {items.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4 border border-dashed rounded-md bg-gray-50">
                    No items added. Click add to start.
                </p>
            )}

            {items.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        <Input
                            placeholder="Item Name (e.g. Spare Parts)"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, { name: e.target.value })}
                            className="bg-white"
                        />
                        <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            type="number"
                            placeholder="Amount"
                            value={item.value || ''}
                            onChange={(e) => updateItem(item.id, { value: parseFloat(e.target.value) || 0 })}
                            className="bg-white"
                        />
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={item.frequency}
                            onChange={(e) => updateItem(item.id, { frequency: e.target.value as any })}
                        >
                            <option value="yearly">Yearly</option>
                            <option value="one-time">One-time</option>
                            <option value="every-n-years">Every N Years</option>
                        </select>
                    </div>

                    {item.frequency === 'one-time' && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="whitespace-nowrap">in Year:</span>
                            <Input
                                type="number"
                                className="h-8 w-20"
                                value={item.year || 1}
                                onChange={(e) => updateItem(item.id, { year: parseInt(e.target.value) })}
                            />
                        </div>
                    )}

                    {item.frequency === 'every-n-years' && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="whitespace-nowrap">Every:</span>
                            <Input
                                type="number"
                                className="h-8 w-20"
                                value={item.interval || 5}
                                onChange={(e) => updateItem(item.id, { interval: parseInt(e.target.value) })}
                            />
                            <span>Years</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
