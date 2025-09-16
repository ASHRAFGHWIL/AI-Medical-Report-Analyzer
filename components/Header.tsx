
import React from 'react';
import type { Language, Theme } from '../types';
import { UI_TEXTS } from '../constants';
import { Sun, Moon, Languages, Printer, FileDown, Scan, TextSize } from './Icons';

interface HeaderProps {
    language: Language;
    theme: Theme;
    toggleLanguage: () => void;
    toggleTheme: () => void;
    toggleFontSize: () => void;
    resultsRef: React.RefObject<HTMLDivElement>;
}

declare const jspdf: any;
declare const html2canvas: any;

const Header: React.FC<HeaderProps> = ({
    language,
    theme,
    toggleLanguage,
    toggleTheme,
    toggleFontSize,
    resultsRef,
}) => {
    const handlePrint = () => {
        window.print();
    };

    const handleExportPdf = () => {
        const input = resultsRef.current;
        if (input) {
            // Temporarily increase resolution for better quality
            const scale = 2;
            html2canvas(input, {
                scale: scale,
                useCORS: true,
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            }).then((canvas: HTMLCanvasElement) => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = jspdf;
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'px',
                    format: [canvas.width / scale, canvas.height / scale],
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / scale, canvas.height / scale);
                pdf.save('medical_report_analysis.pdf');
            });
        }
    };

    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const texts = UI_TEXTS[language];
    const buttonClass = "p-2 rounded-full bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500";
    
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 print:hidden">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-extrabold text-primary-700 dark:text-primary-300">
                    🩺 {texts.appName}
                </h1>
                <div className="flex items-center space-x-2 md:space-x-3" dir="ltr">
                    <button onClick={handlePrint} className={buttonClass} title={texts.print}><Printer className="w-5 h-5" /></button>
                    <button onClick={handleExportPdf} className={buttonClass} title={texts.exportPdf}><FileDown className="w-5 h-5" /></button>
                    <button onClick={handleToggleFullscreen} className={buttonClass} title={texts.toggleFullscreen}><Scan className="w-5 h-5" /></button>
                     <button onClick={toggleFontSize} className={buttonClass} title={texts.toggleFontSize}><TextSize className="w-5 h-5" /></button>
                    <button onClick={toggleLanguage} className={buttonClass} title={texts.toggleLanguage}><Languages className="w-5 h-5" /></button>
                    <button onClick={toggleTheme} className={buttonClass} title={texts.toggleTheme}>
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
