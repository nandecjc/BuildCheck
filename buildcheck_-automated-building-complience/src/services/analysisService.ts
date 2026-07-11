import { GoogleGenAI } from "@google/genai";

const engine = new GoogleGenAI({ apiKey: process.env.ANALYSIS_ENGINE_KEY || "" });

export async function analyzeVisuals(base64Image: string, mimeType: string = "image/jpeg") {
  try {
    const response = await engine.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: "Act as a professional building inspector. Analyze this image for building defects such as cracks, corrosion, water leaks, or electrical hazards. Provide a concise summary of any issues found. If no issues are found, say 'No significant defects detected'.",
            },
          ],
        },
      ],
    });

    return response.text || "No significant defects detected";
  } catch (error) {
    console.error("System Analysis Error:", error);
    return "Error processing image for system analysis.";
  }
}
