import React from 'react';
import { LCCProvider, useLCC } from './context/LCCContext';
import { GlobalConfigPanel } from './components/GlobalConfigPanel';
import { OptionCard } from './components/OptionCard';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { Button } from './components/ui/Button';
import { Plus } from 'lucide-react';

const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">LCC Decision Support System</h1>
            </div>
            <div className="text-sm text-gray-500">
                v1.0.0
            </div>
        </div>
    </header>
);

const MainContent = () => {
    const { options, addOption } = useLCC();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

            {/* Configuration Section */}
            <section>
                <GlobalConfigPanel />
            </section>

            {/* Options Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Investment Options</h2>
                    <Button onClick={addOption} className="shadow-sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Option
                    </Button>
                </div>

                {/* Horizontal Scroll Container for Options */}
                <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {options.map(option => (
                        <OptionCard key={option.id} option={option} />
                    ))}
                </div>
            </section>

            {/* Analysis Section */}
            <section className="pt-8 border-t border-gray-200">
                <AnalysisDashboard />
            </section>

        </main>
    );
};

function App() {
    return (
        <LCCProvider>
            <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
                <Header />
                <MainContent />
                <footer className="bg-white border-t border-gray-200 py-8 mt-12">
                    <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
                        &copy; 2025 LCC Decision Support System.
                    </div>
                </footer>
            </div>
        </LCCProvider>
    );
}

export default App;
