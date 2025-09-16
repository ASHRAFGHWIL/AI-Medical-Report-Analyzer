
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
export type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';

export interface PhysicianReport {
    title: string;
    introduction: string;
    resultsTable: Array<{
        test: string;
        value: string;
        referenceRange: string;
        interpretation: string;
    }>;
    advancedAnalysis: string;
}

export interface Recommendations {
    general: {
        title: string;
        points: string[];
    };
    nutritional: {
        title: string;
        points: string[];
    };
    physicalTherapy: {
        title: string;
        points: string[];
    };
}

export interface AnalysisResult {
    patientSummary: {
        title: string;
        summary: string;
    };
    physicianReport: PhysicianReport;
    recommendations: Recommendations;
}
