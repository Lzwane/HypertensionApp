// ⚠️ REPLACE WITH YOUR GEMINI API KEY FROM https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyBtOvYjz0Og39FHdPNuW_pBBzXMQFW2Opg"; 

export const getAIResponse = async (userMessage: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    if (result.error) {
      console.error("Gemini Error:", result.error);
      return "I'm having trouble thinking right now. Please check your API key.";
    }

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text.trim();
    }

    return "I didn't understand that.";

  } catch (error) {
    console.error("Network Error:", error);
    return "Please check your internet connection.";
  }
};

// Export default to prevent Expo Router warning
export default {};