import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MarketingFormData, GenerationResponse, GeneratedCaption } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const captionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A catchy, short title for the caption option."
          },
          caption: {
            type: Type.STRING,
            description: "The main body of the Instagram caption, including emojis. Do not include hashtags here."
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of relevant hashtags."
          }
        },
        required: ["title", "caption", "hashtags"]
      }
    }
  },
  required: ["options"]
};

const generateImageForOption = async (formData: MarketingFormData, vibe: string): Promise<string | undefined> => {
  const prompt = `Professional, high-quality Instagram photo for "${formData.productName}" at "${formData.businessName}". 
  Description: ${formData.productDescription}. 
  Vibe: ${vibe}. 
  Photorealistic, aesthetic, engaging, social media style.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
  } catch (error) {
    console.warn("Failed to generate image:", error);
  }
  return undefined;
};

export const generateMarketingCopy = async (formData: MarketingFormData): Promise<GenerationResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    You are an expert digital marketing assistant specializing in creating engaging social media content for small businesses.
    
    Task: Generate 3 different Instagram post caption options based on the following details:
    
    Business: "${formData.businessName}"
    Product/Service: "${formData.productName}"
    Description: "${formData.productDescription}"
    Target Audience: "${formData.targetAudience}"
    Goal: "${formData.goal}"
    City: "${formData.city}"
    Required Hashtags to mix in: "${formData.hashtags}"

    Constraints for each option:
    1. Be enthusiastic and evocative (match the vibe of the product).
    2. Include several relevant emojis.
    3. The caption body must be between 150 and 280 characters long.
    4. Include a clear call to action to visit "${formData.businessName}" or "stop by today".
    5. Generate a mix of general and specific hashtags.
  `;

  try {
    // 1. Generate Text Options
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: captionSchema,
        temperature: 0.7,
      },
    });

    const jsonText = textResponse.text;
    if (!jsonText) {
      throw new Error("No response received from Gemini.");
    }

    const parsedResponse = JSON.parse(jsonText) as GenerationResponse;

    // 2. Generate Images for each option in parallel
    const optionsWithImages = await Promise.all(
      parsedResponse.options.map(async (option) => {
        const imageBase64 = await generateImageForOption(formData, option.title);
        return {
          ...option,
          imageBase64,
        };
      })
    );

    return { options: optionsWithImages };

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};