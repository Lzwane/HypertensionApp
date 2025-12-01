// ⚠️ REPLACE WITH YOUR NEW GEMINI API KEY
const GEMINI_API_KEY = "AIzaSyCUUyhgqvJ0_yxGzHUX_8zLc3tQUjVKbXc"; 

// Using the model requested: gemini-2.5-flash
// If this fails with 404, switch back to "gemini-1.5-flash"
const MODEL_NAME = "gemini-2.5-flash";

// For image analysis, we use the vision-capable model
// Note: gemini-2.5-flash supports multimodal input (text + image)
const VISION_MODEL_NAME = "gemini-2.5-flash";

const cleanJSON = (text: string) => {
  // Removes markdown code blocks if present (```json ... ```)
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const getAIResponse = async (userMessage: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a medical assistant. Keep it short. ${userMessage}` }] }]
        }),
      }
    );
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "I didn't understand.";
  } catch (error) {
    return "Check internet connection.";
  }
};

export const getDailyTipAI = async () => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Generate a short, unique, single-sentence health tip specifically for managing hypertension. Do not repeat generic advice like 'eat less salt' without a specific twist." }] }]
        }),
      }
    );
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Stay hydrated to help regulate blood pressure.";
  } catch (error) {
    return "Take a short walk today to boost heart health.";
  }
};

export const getQuizQuestionsAI = async () => {
  try {
    const prompt = `Generate 5 multiple choice questions about hypertension, diet, and heart health. 
    Return ONLY a JSON array with this structure: 
    [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "The correct option text", "fact": "Short explanation"}]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(cleanJSON(text));
  } catch (error) {
    console.log("Quiz AI Error", error);
    // Fallback static questions
    return [
      {
        question: "Which mineral helps lower blood pressure?",
        options: ["Sodium", "Potassium", "Lead", "Gold"],
        answer: "Potassium",
        fact: "Potassium helps balance out the negative effects of salt.",
      }
    ];
  }
};

export const getSodiumGameDataAI = async () => {
  try {
    const prompt = `Generate 10 food items. Some should be high sodium (processed/salty) and some low sodium (fresh/healthy).
    Return ONLY a JSON array with this structure:
    [{"name": "Food Name", "category": "High" | "Low", "emoji": "🍎"}]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(cleanJSON(text));
  } catch (error) {
    return [
      { name: "Canned Soup", category: "High", emoji: "🥫" },
      { name: "Fresh Banana", category: "Low", emoji: "🍌" }
    ];
  }
};

export const analyzeFoodImageAI = async (base64Image: string) => {
  try {
    const prompt = `Analyze this food image for a person with hypertension. 
    1. Identify the food.
    2. Estimate if it's high or low in sodium.
    3. Give a short verdict: "Safe", "Moderate", or "Avoid".
    4. Provide a very brief reason (1 sentence).
    
    Return ONLY a JSON object with this structure:
    {"foodName": "...", "verdict": "Safe" | "Moderate" | "Avoid", "reason": "..."}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }]
        }),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error("AI Error:", result);
      throw new Error("Failed to analyze image");
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(cleanJSON(text));
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return null;
  }
};