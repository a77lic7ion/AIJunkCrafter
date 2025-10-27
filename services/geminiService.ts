import { GoogleGenAI, Modality, Type } from "@google/genai";

export interface CraftStep {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface CraftIdea {
  title: string;
  materials: string[];
  steps: CraftStep[];
}

export interface GenerationConfig {
  temperature: number;
  topK: number;
  topP: number;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative name for the toy/craft." },
    materials: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of materials from the image and any other common items needed."
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The instruction for this step." },
          imagePrompt: { type: Type.STRING, description: "A simple, concise prompt for an image generation model to create a cartoon-style illustration for this step. E.g., 'A child gluing a bottle cap onto a cardboard tube'." }
        },
        required: ['text', 'imagePrompt']
      },
      description: "The step-by-step instructions."
    }
  },
  required: ['title', 'materials', 'steps']
};

/**
 * Takes a "lean" craft idea (without images) and generates an image for each step.
 * @param idea The craft idea to hydrate with images.
 * @returns A promise that resolves to the craft idea with imageUrls populated.
 */
export const hydrateIdeaWithImages = async (idea: CraftIdea): Promise<CraftIdea> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imageModel = 'gemini-2.5-flash-image';

  try {
    const imagePromises = idea.steps.map(async (step) => {
      const imageGenResponse = await ai.models.generateContent({
        model: imageModel,
        contents: {
          parts: [{ text: `A simple, colorful, cartoon-style, kid-friendly drawing of: ${step.imagePrompt}` }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const firstPart = imageGenResponse.candidates?.[0]?.content?.parts?.[0];
      if (firstPart && firstPart.inlineData) {
        const base64ImageBytes = firstPart.inlineData.data;
        return {
          ...step,
          imageUrl: `data:${firstPart.inlineData.mimeType};base64,${base64ImageBytes}`
        };
      }
      return { ...step, imageUrl: undefined }; // Return step without image if generation fails
    });

    const stepsWithImages = await Promise.all(imagePromises);
    return { ...idea, steps: stepsWithImages };

  } catch (error) {
     console.error("Error generating images from Gemini API:", error);
     // Re-throw the error so the UI can display a proper message to the user.
     const errorMessage = error instanceof Error ? error.message : String(error);
     throw new Error(`Failed to generate images. This could be due to a missing API key in your Vercel environment or a network issue. Details: ${errorMessage}`);
  }
};


export const generateCraftIdea = async (
  imageFile: File, 
  availableSupplies: string[],
  customIdea: string,
  updateLoadingMessage: (message: string) => void,
  generationConfig: GenerationConfig
): Promise<CraftIdea> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const textModel = 'gemini-2.5-flash';

  updateLoadingMessage('Analyzing image and generating instructions...');

  // Step 1: Generate the structured text content
  const base64Image = await fileToBase64(imageFile);
  const imagePart = { inlineData: { mimeType: imageFile.type, data: base64Image } };

  let prompt;
  if (customIdea.trim()) {
      prompt = `You are a creative assistant for parents. Look at the image of items and generate a craft project based on the user's idea: "${customIdea}". Your response must be a JSON object that strictly follows the provided schema. Use the items from the image as the primary materials.`;
  } else {
      prompt = `You are a creative assistant for parents. Look at the image of items and generate a creative craft project for a kindergarten-aged child. My response must be a JSON object that strictly follows the provided schema.`;
  }

  prompt += `\n${availableSupplies.length > 0 ? `Incorporate these available supplies: ${availableSupplies.join(', ')}.` : ''}
  Keep instructions simple, clear, and safe for a child with adult supervision. Ensure image prompts are descriptive and kid-friendly.`;

  const textPart = { text: prompt };

  let structuredResponse: CraftIdea;
  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        ...generationConfig,
      },
    });
    
    // The response text is a JSON string, so we parse it.
    const jsonText = response.text.trim();
    structuredResponse = JSON.parse(jsonText);

  } catch (error) {
    console.error("Error generating structured text from Gemini API:", error);
    throw new Error("Failed to get a creative idea from the AI. The text generation part failed.");
  }

  updateLoadingMessage(`Generating images for ${structuredResponse.steps.length} steps...`);

  // Step 2: Generate an image for each step using the new helper
  return await hydrateIdeaWithImages(structuredResponse);
};