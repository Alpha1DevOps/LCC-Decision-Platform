import React from 'react';
import { useLCC } from '../context/LCCContext';
import { Button } from './ui/Button';
import { CostComparisonChart, BreakevenChart } from './Charts';
import { SummaryTable } from './SummaryTable';
import { Play } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/Card';

export const AnalysisDashboard: React.FC = () => {
    const { results, runAnalysis, options, config } = useLCC();

    if (!results.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <h3 className="text-xl font-medium text-gray-600 mb-4">Ready to Analyze?</h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">Input your option details above and click Start Analysis to calculate Life Cycle Costs.</p>
                <Button size="lg" onClick={runAnalysis} className="shadow-lg hover:shadow-xl transition-all">
                    <Play className="h-5 w-5 mr-2" /> Start Analysis
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-blue-900 text-white p-4 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold">Analysis Results</h2>
                    <p className="text-blue-200 text-sm">Based on {config.lifespan} Year Lifespan</p>
                </div>
                <Button variant="secondary" onClick={runAnalysis}>
                    Refresh Analysis
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><h3 className="font-semibold text-lg">Total Cost Comparison</h3></CardHeader>
                    <CardContent>
                        <CostComparisonChart results={results} options={options} lifespan={config.lifespan} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><h3 className="font-semibold text-lg">Cumulative Cost (Breakeven)</h3></CardHeader>
                    <CardContent>
                        <BreakevenChart results={results} options={options} lifespan={config.lifespan} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><h3 className="font-semibold text-lg">Detailed Summary</h3></CardHeader>
                <CardContent>
                    <SummaryTable results={results} options={options} />
                </CardContent>
            </Card>

        </div>
    );
};
