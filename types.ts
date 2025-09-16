export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
export type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';

export type BilingualText = {
    en: string;
    ar: string;
};

export interface PatientSummary {
    title: BilingualText;
    summary: BilingualText;
}

export interface PhysicianReport {
    title: BilingualText;
    introduction: BilingualText;
    resultsTable: Array<{
        test: BilingualText;
        value: string;
        referenceRange: string;
        interpretation: BilingualText;
    }>;
    advancedAnalysis: BilingualText;
}

export interface Recommendations {
    general: {
        title: BilingualText;
        points: BilingualText[];
    };
    nutritional: {
        title: BilingualText;
        points: BilingualText[];
    };
    physicalTherapy: {
        title: BilingualText;
        points: BilingualText[];
    };
}

export interface ReportPage {
    pageTitle: BilingualText;
    patientSummary?: PatientSummary;
    physicianReport?: PhysicianReport;
    recommendations?: Recommendations;
}

export interface AnalysisResult {
    pages: ReportPage[];
}