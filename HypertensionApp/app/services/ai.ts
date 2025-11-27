// REPLACE WITH YOUR OPENAI KEY (platform.openai.com)
const OPENAI_API_KEY = 'YOUR_OPENAI_KEY_HERE'; 

export const getAIResponse = async (userMessage: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or "gpt-4" if you have access
        messages: [
          { role: "system", content: "You are an empathetic medical assistant helping a patient manage hypertension. Be brief, encouraging, and clear." },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    }
    return "I'm having trouble connecting to my brain right now. Please try again.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Network error. Please check your internet connection.";
  }
};