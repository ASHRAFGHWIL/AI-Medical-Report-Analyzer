import type { Language } from './types';

export const UI_TEXTS: Record<Language, Record<string, string>> = {
    en: {
        appName: 'AI Medical Report Analyzer',
        uploadTitle: 'Upload Medical Report',
        uploadPrompt: 'Drag & drop a file here, or click to select a file',
        supportedFormats: 'Supported formats: PDF, JPG, PNG',
        analyzeButton: 'Analyze Report',
        analyzingButton: 'Analyzing...',
        welcomeTitle: 'Welcome to the AI Medical Report Analyzer',
        welcomeMessage: 'Upload a medical report image to begin analysis. The system will provide a detailed breakdown for both patients and physicians.',
        errorNoFile: 'Please select a file to analyze.',
        errorAnalysis: 'An error occurred during analysis. Please try again.',
        loadingMessage: 'Processing report... This may take a moment.',
        patientSummaryTitle: 'Simplified Summary for the Patient',
        physicianReportTitle: 'Professional Report for Physicians',
        recommendationsTitle: 'Recommendations',
        print: 'Print',
        exportPdf: 'Export PDF',
        toggleLanguage: 'Switch to Arabic',
        toggleTheme: 'Toggle Theme',
        toggleFullscreen: 'Toggle Fullscreen',
        toggleFontSize: 'Change Font Size',
        resultsTableTest: 'Test',
        resultsTableValue: 'Value',
        resultsTableRef: 'Reference Range',
        resultsTableInterp: 'Interpretation',
        advancedAnalysisTitle: "Advanced Analysis"
    },
    ar: {
        appName: 'محلل التقارير الطبية بالذكاء الاصطناعي',
        uploadTitle: 'رفع تقرير طبي',
        uploadPrompt: 'اسحب وأفلت الملف هنا، أو انقر لاختيار ملف',
        supportedFormats: 'الصيغ المدعومة: PDF, JPG, PNG',
        analyzeButton: 'تحليل التقرير',
        analyzingButton: 'جاري التحليل...',
        welcomeTitle: 'مرحباً بك في محلل التقارير الطبية',
        welcomeMessage: 'ارفع صورة تقرير طبي لبدء التحليل. سيقوم النظام بتقديم شرح مفصل للمرضى والأطباء.',
        errorNoFile: 'يرجى اختيار ملف لتحليله.',
        errorAnalysis: 'حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.',
        loadingMessage: 'جاري معالجة التقرير... قد يستغرق هذا بعض الوقت.',
        patientSummaryTitle: 'ملخص مبسط للمريض',
        physicianReportTitle: 'تقرير احترافي للأطباء',
        recommendationsTitle: 'التوصيات',
        print: 'طباعة',
        exportPdf: 'تصدير PDF',
        toggleLanguage: 'التحويل إلى الإنجليزية',
        toggleTheme: 'تبديل المظهر',
        toggleFullscreen: 'ملء الشاشة',
        toggleFontSize: 'تغيير حجم الخط',
        resultsTableTest: 'الاختبار',
        resultsTableValue: 'القيمة',
        resultsTableRef: 'النطاق المرجعي',
        resultsTableInterp: 'التفسير',
        advancedAnalysisTitle: "تحليل متقدم"
    }
};

export const getGeminiPrompt = (): string => {
    return `
    You are an expert AI in medical report analysis, acting as a highly knowledgeable physician and medical researcher. Your task is to analyze the provided medical lab report image with academic rigor, adhering to global medical standards like WHO and NIH.

    Analyze the lab results (e.g., CBC, liver/kidney functions, blood sugar).
    1.  Compare results to standard reference ranges.
    2.  Detect and highlight any deviations or critical values.
    3.  Provide clear, structured outputs in JSON format ONLY. Do not add any text before or after the JSON object.

    For every text field that requires translation (like titles, summaries, recommendations, test names, interpretations), you MUST provide both an English ('en') and an Arabic ('ar') translation within a nested object.
    Example: "title": {"en": "Patient Summary", "ar": "ملخص المريض"}.
    Numeric values and reference ranges should remain as simple strings.

    The final JSON object must strictly follow the schema provided.
    - For the 'physicianReport.resultsTable', accurately extract the test name, its value, the reference range, and a concise interpretation (e.g., 'Normal', 'High', 'Low', 'Critical').
    - For 'patientSummary', use simple, clear language.
    - For 'recommendations', provide actionable advice.
`;
};