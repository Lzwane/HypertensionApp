// ⚠️ REPLACE WITH YOUR NEW GEMINI API KEY
const GEMINI_API_KEY = "AIzaSyCy3QVu_GYno70bOZTS5jre5zKmpOP7Sks"; 

// Using the model requested: gemini-2.5-flash
// If this fails with 404, switch back to "gemini-1.5-flash"
const MODEL_NAME = "gemini-2.5-flash";

export const getAIResponse = async (userMessage: string) => {
  try {
    console.log(`Sending request to ${MODEL_NAME}...`);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful medical assistant for hypertension. Keep answers short (max 3 sentences). User asks: ${userMessage}`
            }]
          }]
        }),
      }
    );

    const result = await response.json();

    // Enhanced Error Logging
    if (!response.ok) {
      console.error("Gemini API Error Details:", JSON.stringify(result, null, 2));
      
      // Handle specific 404 for model not found
      if (result.error?.code === 404) {
        return `Error: Model ${MODEL_NAME} not found. Try changing ai.ts to use 'gemini-1.5-flash'.`;
      }
      return "I'm having trouble connecting. Please check your API key.";
    }

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text.trim();
    }

    return "I didn't understand that response.";

  } catch (error) {
    console.error("Network Error:", error);
    return "Please check your internet connection.";
  }
};

export default {};