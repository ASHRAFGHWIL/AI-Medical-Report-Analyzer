import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AnalysisResult, Language, Theme, FontSize } from './types';
import { analyzeMedicalReport } from './services/geminiService';
import { UI_TEXTS } from './constants';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('en');
    const [theme, setTheme] = useState<Theme>('light');
    const [fontSize, setFontSize] = useState<FontSize>('text-base');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleFileChange = (selectedFile: File | null) => {
        setFile(selectedFile);
        setAnalysisResult(null);
        setError(null);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!file || !filePreview) {
            setError(UI_TEXTS[language].errorNoFile);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const base64Data = filePreview.split(',')[1];
            const mimeType = file.type;
            
            const result = await analyzeMedicalReport(base64Data, mimeType);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : UI_TEXTS[language].errorAnalysis);
        } finally {
            setIsLoading(false);
        }
    }, [file, filePreview, language]);
    
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    const toggleFontSize = () => {
        const sizes: FontSize[] = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
        const currentIndex = sizes.indexOf(fontSize);
        setFontSize(sizes[(currentIndex + 1) % sizes.length]);
    };

    return (
        <div className={`min-h-screen ${fontSize} bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300`}>
            <Header
                language={language}
                theme={theme}
                toggleLanguage={toggleLanguage}
                toggleTheme={toggleTheme}
                toggleFontSize={toggleFontSize}
                resultsRef={resultsRef}
            />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 xl:col-span-3">
                         <UploadSection
                            language={language}
                            file={file}
                            filePreview={filePreview}
                            isLoading={isLoading}
                            onFileChange={handleFileChange}
                            onAnalyze={handleAnalyze}
                        />
                    </div>
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div ref={resultsRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 print:shadow-none" id="analysis-results">
                            {isLoading && <LoadingSpinner language={language}/>}
                            {error && <div className="text-red-500 text-center font-semibold p-8">{error}</div>}
                            {!isLoading && !error && !analysisResult && (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-16 px-6">
                                    <h2 className="text-2xl font-bold mb-2">{UI_TEXTS[language].welcomeTitle}</h2>
                                    <p>{UI_TEXTS[language].welcomeMessage}</p>
                                </div>
                            )}
                            {analysisResult && <ResultsDisplay result={analysisResult} language={language} />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;