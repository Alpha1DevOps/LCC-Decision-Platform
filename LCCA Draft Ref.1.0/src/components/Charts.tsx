import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AnalysisResult, OptionData } from '../types/lcc';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

interface ChartsProps {
    results: AnalysisResult[];
    options: OptionData[];
    lifespan: number;
}

export const CostComparisonChart: React.FC<ChartsProps> = ({ results, options }) => {
    const data = results.map((res, index) => {
        const opt = options.find(o => o.id === res.optionId);
        return {
            name: opt?.name || res.optionId,
            NPV: Math.round(res.totalNPV), // Round for cleaner chart
            color: COLORS[index % COLORS.length]
        };
    });

    return (
        <div className="h-[300px] w-full">
            <h3 className="text-center font-medium mb-2 text-gray-700">Total Net Present Value (NPV) Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en-US').format(value as number)} />
                    <Legend />
                    <Bar dataKey="NPV" fill="#8884d8">
                        {data.map((entry, index) => (
                            <cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const BreakevenChart: React.FC<ChartsProps> = ({ results, options, lifespan }) => {
    // Transform data: Array of { year, Option1: val, Option2: val, ... }
    const data = [];
    for (let year = 0; year <= lifespan; year++) {
        const yearPoint: any = { year };
        results.forEach((res, index) => {
            const optName = options.find(o => o.id === res.optionId)?.name || res.optionId;
            const flow = res.cashFlows.find(f => f.year === year);
            yearPoint[res.optionId] = flow ? Math.round(flow.cumulativeNPV) : 0;
        });
        data.push(yearPoint);
    }

    return (
        <div className="h-[300px] w-full">
            <h3 className="text-center font-medium mb-2 text-gray-700">Cumulative Cost Over Time (Breakeven Analysis)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en-US').format(value as number)} />
                    <Legend
                        payload={results.map((res, index) => ({
                            id: res.optionId,
                            type: 'line',
                            value: options.find(o => o.id === res.optionId)?.name || res.optionId,
                            color: COLORS[index % COLORS.length]
                        }))}
                    />
                    {results.map((res, index) => (
                        <Line
                            key={res.optionId}
                            type="monotone"
                            dataKey={res.optionId}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
