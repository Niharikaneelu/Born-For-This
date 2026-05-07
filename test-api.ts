const testOpenRouter = async () => {
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log("NO API KEY");
    return;
  }
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Born For This",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: "Say hello" }],
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.log("API Error:", response.status, data);
      throw new Error(`API error: ${response.status}`);
    }
    console.log("SUCCESS:", data.choices[0].message.content);
  } catch(e) {
    console.log("ERROR:", e);
  }
}

testOpenRouter();
