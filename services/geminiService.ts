import { GoogleGenAI } from "@google/genai";
import { ProcessConfig, EditMode, InputType } from "../types";

// Helper to strip base64 header
const stripBase64Header = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const analyzeImage = async (base64Image: string, mode: EditMode): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Enhanced prompt for highly detailed feature extraction
    const prompt = mode === EditMode.CLOTHING
      ? "请像一位专业的时尚设计师一样，用简体中文极其详细地描述这张图片中的主要服装。请重点关注：1. 具体的款式和版型（如：A字裙、修身西装、落肩卫衣）；2. 领口、袖口和下摆的细节设计；3. 面料的视觉质感（如：丝绒、粗呢、真丝、牛仔、皮革）；4. 准确的颜色（包含色调和光泽感）；5. 图案印花或装饰细节。字数控制在150字左右，描述要画面感强，便于AI绘画还原。"
      : "请像一位顶级发型师一样，用简体中文极其详细地描述这张图片中的发型。请重点关注：1. 发型整体轮廓和学名（如：法式羊毛卷、狼尾、寸头）；2. 刘海的精确形态（空气刘海/八字刘海/无刘海）；3. 头发的具体长度（及耳/及肩/及腰）；4. 卷度的大小、直径和纹理走向；5. 发色的准确色号（如：冷棕色、蓝黑色、浅亚麻）。描述要非常精准，目的是为了将此发型完美移植到另一个人头上。";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: stripBase64Header(base64Image),
            },
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Analysis failed:", error);
    return "";
  }
};

export const generateTryOnImage = async (config: ProcessConfig): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `You are an expert AI specialized in realistic photo editing and virtual try-on.
    Your GOAL is to modify a specific attribute (hairstyle or clothing) of a target User Image while STRICTLY PRESERVING the User's facial identity and body structure.
    
    RULES:
    1. **IDENTITY PRESERVATION IS ABSOLUTE**: The User's face (eyes, nose, mouth, skin texture, facial features) MUST remain EXACTLY the same as the original image. Do not "beautify" or alter the face.
    2. **BODY CONSISTENCY**: Do not change the user's body shape, pose, or skin tone.
    3. For CLOTHING: Replace the outfit while keeping the head and body pose.
    4. For HAIRSTYLE: Completely replace the hair while keeping the face and body 100% intact.
    5. Output ONLY the modified image. No text.`;

    const parts: any[] = [];

    // 1. Add User Image (Target)
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: stripBase64Header(config.userImage),
      },
    });

    // 2. Add Reference Image (Source) if applicable
    if (config.inputType === InputType.IMAGE && config.referenceImage) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: stripBase64Header(config.referenceImage),
        },
      });
    }

    let userPrompt = "";

    if (config.mode === EditMode.CLOTHING) {
      userPrompt = `
        The first image is the USER (Target).
        ${config.referenceImage ? "The second image is the CLOTHING REFERENCE (Source)." : ""}
        
        TARGET DESCRIPTION: ${config.textDescription}
        
        TASK: Dress the USER in the described clothing.
        
        INSTRUCTIONS:
        - KEEP the USER's face, head, and pose EXACTLY as they are.
        - Replace the user's current outfit with the new clothing.
        - Ensure the new clothing fits the user's body shape naturally.
        - Maintain photorealistic lighting and shadows.
      `;
    } else if (config.mode === EditMode.HAIR) {
       // Strengthened Hair Logic to prioritize strict identity and body preservation
       userPrompt = `
         The first image is the USER (Target).
         ${config.referenceImage ? "The second image is the HAIRSTYLE REFERENCE (Source)." : ""}
         
         NEW HAIRSTYLE TARGET: ${config.textDescription}
         
         TASK: Realistic Hair Transplant / Hairstyle Change.
         
         CRITICAL INSTRUCTIONS:
         1. **FACE PROTECTION**: The face in the output image MUST match the original user image perfectly. Do not change expression, age, features, or skin texture.
         2. **BODY PROTECTION**: Keep the original clothing, neck, shoulders, and body shape EXACTLY as they are (unless covered by new long hair).
         3. **REMOVE OLD HAIR**: Erase the original hair completely. If the original hair was big/long and the new hair is short/tight, you must generate the background that was previously hidden.
         4. **APPLY NEW HAIR**: Generate the new hairstyle (${config.textDescription}) naturally blending with the original forehead and scalp line.
         5. **REALISM**: The hair texture must be photorealistic and match the lighting of the original photo.
       `;
    }

    parts.push({ text: userPrompt });

    // Call API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: parts,
      },
      config: {
         systemInstruction: systemPrompt,
      }
    });

    // Extract Image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Failed to generate image.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};