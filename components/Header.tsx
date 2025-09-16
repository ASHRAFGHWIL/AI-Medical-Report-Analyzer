import React, { useState, useEffect } from 'react';
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

const Header: React.FC<HeaderProps> = ({
    language,
    theme,
    toggleLanguage,
    toggleTheme,
    toggleFontSize,
    resultsRef,
}) => {
    const [isPdfExportReady, setIsPdfExportReady] = useState(false);

    // This effect checks for the global PDF libraries loaded via script tags in index.html.
    // It polls because script loading is asynchronous and may not be ready on initial component mount.
    useEffect(() => {
        const checkLibraries = () => {
            if ((window as any).html2canvas && (window as any).jspdf) {
                setIsPdfExportReady(true);
                return true;
            }
            return false;
        };

        if (checkLibraries()) {
            return;
        }

        const intervalId = setInterval(() => {
            if (checkLibraries()) {
                clearInterval(intervalId);
            }
        }, 500);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleExportPdf = () => {
        const input = resultsRef.current;
        const html2canvas = (window as any).html2canvas;
        const jspdf = (window as any).jspdf;

        if (input && html2canvas && jspdf) {
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
        } else {
            // This alert should ideally not be reached because of the disabled button state.
            console.error('PDF export libraries (jspdf, html2canvas) not loaded.');
            alert('Could not export to PDF. Please check your internet connection and try again.');
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
    const buttonClass = "p-2 rounded-full bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-wait";
    
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 print:hidden">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-extrabold text-primary-700 dark:text-primary-300">
                    🩺 {texts.appName}
                </h1>
                <div className="flex items-center space-x-2 md:space-x-3" dir="ltr">
                    <button onClick={handlePrint} className={buttonClass} title={texts.print}><Printer className="w-5 h-5" /></button>
                    <button
                        onClick={handleExportPdf}
                        className={buttonClass}
                        title={isPdfExportReady ? texts.exportPdf : 'Preparing PDF exporter...'}
                        disabled={!isPdfExportReady}
                    >
                        <FileDown className="w-5 h-5" />
                    </button>
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