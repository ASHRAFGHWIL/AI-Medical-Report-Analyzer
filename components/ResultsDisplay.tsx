import React from 'react';
import type { AnalysisResult, Language } from '../types';
import { UI_TEXTS } from '../constants';
import { Stethoscope, User, HeartPulse, Utensils, Dumbbell } from './Icons';

interface ResultsDisplayProps {
    result: AnalysisResult;
    language: Language;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, language }) => {
    const texts = UI_TEXTS[language];
    const { patientSummary, physicianReport, recommendations } = result;

    const getInterpretationRowClass = (interpretation: string) => {
        const lowerInterp = interpretation.toLowerCase();
        if (lowerInterp.includes('high') || lowerInterp.includes('critical')) {
            return 'bg-red-50 dark:bg-red-950/40';
        }
        if (lowerInterp.includes('low')) {
            return 'bg-blue-50 dark:bg-blue-950/40';
        }
        if (lowerInterp.includes('normal')) {
             return 'bg-green-50 dark:bg-green-950/30';
        }
        return '';
    };

    const getInterpretationTextClass = (interpretation: string) => {
        const lowerInterp = interpretation.toLowerCase();
        if (lowerInterp.includes('high') || lowerInterp.includes('critical')) {
            return 'text-red-600 dark:text-red-400 font-bold';
        }
        if (lowerInterp.includes('low')) {
            return 'text-blue-600 dark:text-blue-400 font-bold';
        }
        if (lowerInterp.includes('normal')) {
            return 'text-green-700 dark:text-green-400';
        }
        return 'text-gray-700 dark:text-gray-300';
    };


    const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-6 print:bg-white print:border print:border-gray-200">
            <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-gray-700 p-2 rounded-full mr-4 print:hidden">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200">{title}</h3>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none print:prose-sm">
                {children}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <Card title={patientSummary.title[language]} icon={<User className="h-6 w-6 text-primary-600 dark:text-primary-300" />}>
                <p>{patientSummary.summary[language]}</p>
            </Card>

            <Card title={physicianReport.title[language]} icon={<Stethoscope className="h-6 w-6 text-primary-600 dark:text-primary-300" />}>
                <p>{physicianReport.introduction[language]}</p>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-separate border-spacing-0">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">{texts.resultsTableTest}</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">{texts.resultsTableValue}</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">{texts.resultsTableRef}</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">{texts.resultsTableInterp}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800">
                            {physicianReport.resultsTable.map((row, index) => (
                                <tr key={index} className={getInterpretationRowClass(row.interpretation.en)}>
                                    <td className="px-4 py-3 font-medium whitespace-nowrap">{row.test[language]}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{row.value}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{row.referenceRange}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={getInterpretationTextClass(row.interpretation.en)}>
                                            {row.interpretation[language]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <h4 className="font-bold mt-6 mb-2">{texts.advancedAnalysisTitle}</h4>
                <p>{physicianReport.advancedAnalysis[language]}</p>
            </Card>

            <div>
                 <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-4 print:text-xl">{texts.recommendationsTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <RecommendationCard title={recommendations.general.title[language]} icon={<HeartPulse className="w-5 h-5 text-green-600"/>} points={recommendations.general.points} language={language} />
                     <RecommendationCard title={recommendations.nutritional.title[language]} icon={<Utensils className="w-5 h-5 text-orange-600"/>} points={recommendations.nutritional.points} language={language} />
                     <RecommendationCard title={recommendations.physicalTherapy.title[language]} icon={<Dumbbell className="w-5 h-5 text-blue-600"/>} points={recommendations.physicalTherapy.points} language={language} />
                </div>
            </div>
        </div>
    );
};

interface RecommendationCardProps {
    title: string;
    icon: React.ReactNode;
    points: Array<{ en: string; ar: string }>;
    language: Language;
}
const RecommendationCard: React.FC<RecommendationCardProps> = ({title, icon, points, language}) => (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 print:border">
        <div className="flex items-center mb-3">
             <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full mr-3 print:hidden">
                {icon}
            </div>
            <h4 className="font-bold">{title}</h4>
        </div>
        <ul className="list-disc list-inside space-y-2 text-sm">
            {points.map((point, i) => <li key={i}>{point[language]}</li>)}
        </ul>
    </div>
);


export default ResultsDisplay;