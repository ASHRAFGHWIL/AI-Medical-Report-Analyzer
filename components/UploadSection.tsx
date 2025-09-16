
import React, { useCallback, useState } from 'react';
import type { Language } from '../types';
import { UI_TEXTS } from '../constants';
import { UploadCloud } from './Icons';

interface UploadSectionProps {
    language: Language;
    file: File | null;
    filePreview: string | null;
    isLoading: boolean;
    onFileChange: (file: File | null) => void;
    onAnalyze: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
    language,
    file,
    filePreview,
    isLoading,
    onFileChange,
    onAnalyze,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const texts = UI_TEXTS[language];

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange(e.dataTransfer.files[0]);
        }
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4 sticky top-8 print:hidden">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">{texts.uploadTitle}</h2>
            
            <div 
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, application/pdf" onChange={handleFileSelect} />
                
                {filePreview ? (
                    <img src={filePreview} alt="Report Preview" className="max-h-48 mx-auto rounded-md object-contain" />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <UploadCloud className="w-12 h-12 mb-2 text-gray-400" />
                        <p className="font-semibold">{texts.uploadPrompt}</p>
                        <p className="text-xs mt-1">{texts.supportedFormats}</p>
                    </div>
                )}
            </div>

            {file && (
                <div className="text-sm text-center text-gray-600 dark:text-gray-300 truncate">
                    <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                </div>
            )}

            <button
                onClick={onAnalyze}
                disabled={!file || isLoading}
                className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {texts.analyzingButton}
                    </>
                ) : (
                    texts.analyzeButton
                )}
            </button>
        </div>
    );
};

export default UploadSection;
