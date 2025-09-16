
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { getGeminiPrompt } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        patientSummary: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
            },
            required: ['title', 'summary'],
        },
        physicianReport: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                introduction: { type: Type.STRING },
                resultsTable: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            test: { type: Type.STRING },
                            value: { type: Type.STRING },
                            referenceRange: { type: Type.STRING },
                            interpretation: { type: Type.STRING },
                        },
                        required: ['test', 'value', 'referenceRange', 'interpretation'],
                    },
                },
                advancedAnalysis: { type: Type.STRING },
            },
            required: ['title', 'introduction', 'resultsTable', 'advancedAnalysis'],
        },
        recommendations: {
            type: Type.OBJECT,
            properties: {
                general: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        points: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['title', 'points'],
                },
                nutritional: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        points: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['title', 'points'],
                },
                physicalTherapy: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        points: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['title', 'points'],
                },
            },
             required: ['general', 'nutritional', 'physicalTherapy'],
        },
    },
    required: ['patientSummary', 'physicianReport', 'recommendations'],
};

export const analyzeMedicalReport = async (
    base64Data: string,
    mimeType: string,
    language: 'en' | 'ar'
): Promise<AnalysisResult> => {
    try {
        const prompt = getGeminiPrompt(language);

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

        return result as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing medical report:", error);
        throw new Error("Failed to get analysis from AI. The report might be unclear or an API error occurred.");
    }
};
