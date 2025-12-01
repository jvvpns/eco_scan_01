import { GoogleGenAI, Type } from "@google/genai";
import { GarbageType } from '../types';

export interface GarbageIdentificationResult {
    itemName: string;
    garbageType: GarbageType;
    points: number;
    description?: string;
}

// Define a consistent point system for each garbage category
const pointsMap: Record<GarbageType, number> = {
    [GarbageType.SPECIAL]: 15,              // e-waste, batteries, hazardous
    [GarbageType.NON_BIODEGRADABLE]: 12,    // plastics, metals, glass
    [GarbageType.BIODEGRADABLE]: 10,        // food waste, organic, paper
    [GarbageType.RESIDUAL]: 5,             // mixed/other waste
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
                        text: `Analyze the primary object in the foreground of this image, ignoring any background clutter. 
                        
Identify and classify it into one of these waste categories:

1. **Special** - Electronic waste (phones, batteries, light bulbs), hazardous materials (chemicals, paint, medical waste)
2. **Non-Biodegradable** - Plastics (bottles, bags, wrappers), metals (cans, foil), glass (bottles, jars), rubber, styrofoam
3. **Biodegradable** - Food waste, organic materials (leaves, grass), paper, cardboard, wood
4. **Residual** - Mixed waste, soiled materials, ceramics, or items that don't clearly fit other categories

Provide the item name and its category.`,
                    }
                ],
            },
            config: {
                systemInstruction: "You are an expert waste classification system. Your sole purpose is to identify the main object in an image and classify it into one of four waste categories: Special, Non-Biodegradable, Biodegradable, or Residual. Provide a JSON response based strictly on the provided schema without any extra explanation.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        itemName: {
                            type: Type.STRING,
                            description: 'The name of the identified item (e.g., "Plastic Water Bottle", "Banana Peel", "AA Battery").'
                        },
                        garbageType: {
                            type: Type.STRING,
                            enum: Object.values(GarbageType),
                            description: "The waste category: Special, Non-Biodegradable, Biodegradable, or Residual."
                        },
                        description: {
                            type: Type.STRING,
                            description: "Brief explanation of why it belongs to this category."
                        }
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
            description: apiResult.description,
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
                throw error;
            }
        }
        
        throw new Error("Could not identify the item. Please try a clearer image or a different angle.");
    }
};