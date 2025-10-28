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
 * Requests are made sequentially to avoid rate-limiting errors.
 * @param idea The craft idea to hydrate with images.
 * @param onStepHydrated An optional callback that receives each step as it's hydrated.
 * @returns A promise that resolves to the craft idea with imageUrls populated.
 */
export const hydrateIdeaWithImages = async (
  idea: CraftIdea,
  onStepHydrated?: (updatedStep: CraftStep, index: number) => void
): Promise<CraftIdea> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imageModel = 'gemini-2.5-flash-image';
  const hydratedSteps: CraftStep[] = idea.steps.map(s => ({ ...s }));

  try {
    for (const [index, step] of idea.steps.entries()) {
      // Add a delay between requests to avoid hitting rate limits.
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

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
      let updatedStep: CraftStep;
      if (firstPart && firstPart.inlineData) {
        const base64ImageBytes = firstPart.inlineData.data;
        updatedStep = {
          ...step,
          imageUrl: `data:${firstPart.inlineData.mimeType};base64,${base64ImageBytes}`
        };
      } else {
        updatedStep = { ...step, imageUrl: undefined }; // Mark as failed
      }
      
      hydratedSteps[index] = updatedStep;
      onStepHydrated?.(updatedStep, index);
    }

    return { ...idea, steps: hydratedSteps };

  } catch (error) {
     console.error("Error generating images from Gemini API:", error);
     const errorMessage = error instanceof Error ? error.message : String(error);
     
     let friendlyMessage = "Failed to generate images. This could be due to a missing API key or a network issue.";
     
     try {
       // Gemini API often returns a JSON string in the error message
       const errorObj = JSON.parse(errorMessage);
       if (errorObj.error?.status === 'RESOURCE_EXHAUSTED' || errorObj.error?.code === 429) {
           friendlyMessage = "Image generation is temporarily unavailable due to high demand. Please try again in a few moments.";
       }
     } catch (e) {
       // Not a JSON error, use the original for context
       friendlyMessage += ` Details: ${errorMessage}`;
     }
     
     throw new Error(friendlyMessage);
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

  // Step 2: Generate an image for each step. This now happens sequentially.
  return await hydrateIdeaWithImages(structuredResponse);
};