import { GoogleGenAI, Type } from "@google/genai";
import { GarbageType } from '../types';

export interface GarbageIdentificationResult {
    itemName: string;
    garbageType: GarbageType;
    points: number;
}

// Define a consistent point system for each garbage type
const pointsMap: Record<GarbageType, number> = {
    [GarbageType.PLASTIC_BOTTLE]: 10,
    [GarbageType.PLASTIC_WRAPPER_BAG]: 10,
    [GarbageType.GLASS_BOTTLE]: 25,
    [GarbageType.PAPER_CARDBOARD]: 10,
    [GarbageType.METAL_SCRAP]: 30,
    [GarbageType.BIODEGRADABLE]: 15,
    [GarbageType.STYROFOAM]: 20,
    [GarbageType.GENERAL_WASTE]: 2,
};

export const identifyGarbage = async (base64Image: string): Promise<GarbageIdentificationResult> => {
    if (!process.env.API_KEY) {
        throw new Error("The scanning service is temporarily unavailable. Please try again later.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image,
                        },
                    },
                    {
                        text: `Analyze the primary object in the foreground of this image, ignoring any background clutter. Identify the object by its common name and classify it into one of the following specific garbage types: ${Object.values(GarbageType).join(', ')}. If it doesn't fit any category, classify it as 'GENERAL_WASTE'.`,
                    }
                ],
            },
            config: {
                systemInstruction: "You are an expert waste classification system. Your sole purpose is to identify the main object in an image and classify it into a specific waste type from the provided list. Provide a JSON response based strictly on the provided schema without any extra explanation.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        itemName: {
                            type: Type.STRING,
                            description: 'The name of the identified item (e.g., "Plastic Water Bottle", "Banana Peel", "Aluminum Can").'
                        },
                        garbageType: {
                            type: Type.STRING,
                            enum: Object.values(GarbageType),
                            description: "The specific classification of the garbage."
                        },
                    },
                    required: ["itemName", "garbageType"]
                },
            },
        });
        
        const jsonString = response.text.trim();
        const apiResult = JSON.parse(jsonString);

        if (!Object.values(GarbageType).includes(apiResult.garbageType)) {
            throw new Error(`The service returned an unknown garbage type: '${apiResult.garbageType}'.`);
        }
        
        const points = pointsMap[apiResult.garbageType as GarbageType] || 0;

        return {
            itemName: apiResult.itemName,
            garbageType: apiResult.garbageType,
            points: points,
        };

    } catch (error) {
        console.error("Error identifying garbage:", error);
        if (error instanceof SyntaxError) {
            throw new Error("The identification service returned an invalid response. Please try again.");
        }
        if (error instanceof Error) {
            if (error.message.toLowerCase().includes('api key') || error.message.toLowerCase().includes('authentication')) {
                 throw new Error("The scanning service is temporarily unavailable due to an authentication issue.");
            }
            if (error.message.startsWith('The service returned an unknown')) {
                throw error; // Rethrow our custom validation error
            }
        }
        
        throw new Error("Could not identify the item. Please try a clearer image or a different angle.");
    }
};