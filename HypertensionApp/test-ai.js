const GEMINI_API_KEY = "AIzaSyCy3QVu_GYno70bOZTS5jre5zKmpOP7Sks"; 

const MODEL_NAME = "gemini-2.5-flash";

async function main() {
  console.log("--- Testing Gemini API Connection ---");
  console.log(`Model: ${MODEL_NAME}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Explain how AI works in a few words" }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API CALL FAILED");
      console.error("Status:", response.status);
      console.error("Error Message:", data.error?.message || JSON.stringify(data));
      
      if (response.status === 404) {
        console.log("\n💡 TIP: Your API key might not have access to 'gemini-2.5-flash' yet.");
        console.log("   Try changing MODEL_NAME to 'gemini-1.5-flash' in this script and in app/services/ai.ts");
      }
    } else {
      console.log("✅ SUCCESS!");
      console.log("Response:");
      console.log(data.candidates[0].content.parts[0].text);
    }

  } catch (error) {
    console.error("❌ NETWORK ERROR");
    console.error(error);
  }
}

main();