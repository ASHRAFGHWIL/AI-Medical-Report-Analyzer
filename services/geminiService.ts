import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { getGeminiPrompt } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const bilingualTextSchema = {
    type: Type.OBJECT,
    properties: {
        en: { type: Type.STRING },
        ar: { type: Type.STRING },
    },
    required: ['en', 'ar'],
};

const patientSummarySchema = {
    type: Type.OBJECT,
    properties: {
        title: bilingualTextSchema,
        summary: bilingualTextSchema,
    },
    required: ['title', 'summary'],
};

const physicianReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: bilingualTextSchema,
        introduction: bilingualTextSchema,
        resultsTable: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    test: bilingualTextSchema,
                    value: { type: Type.STRING },
                    referenceRange: { type: Type.STRING },
                    interpretation: bilingualTextSchema,
                },
                required: ['test', 'value', 'referenceRange', 'interpretation'],
            },
        },
        advancedAnalysis: bilingualTextSchema,
    },
    required: ['title', 'introduction', 'resultsTable', 'advancedAnalysis'],
};

const recommendationsSchema = {
    type: Type.OBJECT,
    properties: {
        general: {
            type: Type.OBJECT,
            properties: {
                title: bilingualTextSchema,
                points: { type: Type.ARRAY, items: bilingualTextSchema },
            },
            required: ['title', 'points'],
        },
        nutritional: {
            type: Type.OBJECT,
            properties: {
                title: bilingualTextSchema,
                points: { type: Type.ARRAY, items: bilingualTextSchema },
            },
            required: ['title', 'points'],
        },
        physicalTherapy: {
            type: Type.OBJECT,
            properties: {
                title: bilingualTextSchema,
                points: { type: Type.ARRAY, items: bilingualTextSchema },
            },
            required: ['title', 'points'],
        },
    },
    required: ['general', 'nutritional', 'physicalTherapy'],
};

const reportPageSchema = {
    type: Type.OBJECT,
    properties: {
        pageTitle: bilingualTextSchema,
        patientSummary: patientSummarySchema,
        physicianReport: physicianReportSchema,
        recommendations: recommendationsSchema,
    },
    required: ['pageTitle'],
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        pages: {
            type: Type.ARRAY,
            items: reportPageSchema,
        },
    },
    required: ['pages'],
};


export const analyzeMedicalReport = async (
    base64Data: string,
    mimeType: string
): Promise<AnalysisResult> => {
    try {
        const prompt = getGeminiPrompt();

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: prompt },
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        // Basic validation
        if (!result.pages || !Array.isArray(result.pages) || result.pages.length === 0) {
            throw new Error("Invalid response format: 'pages' array is missing or empty.");
        }

        return result as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing medical report:", error);
        throw new Error("Failed to get analysis from AI. The report might be unclear or an API error occurred.");
    }
};