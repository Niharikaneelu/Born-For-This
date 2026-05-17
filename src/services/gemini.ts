const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-3.5-turbo";

const callAI = async (prompt: string): Promise<string> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Born For This",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content.trim();
};

export const generateCosmicIdentity = async (name: string, zodiac: string, traits: string[], lifePath: number, nickname?: string): Promise<string> => {
  const displayName = nickname || name;
  if (!API_KEY) {
    return `${displayName}, born under the sign of ${zodiac}, you are a constellation of contradictions and beautiful truths. With a Life Path of ${lifePath}, your journey is guided by an invisible force, shaped by your natural ${traits[0].toLowerCase()} and ${traits[1].toLowerCase()} spirit.`;
  }
  try {
    return await callAI(`Write a beautiful, poetic, and cinematic 3-sentence paragraph explaining the cosmic identity of a person named ${name}${nickname ? ` (often affectionately called ${nickname})` : ''}. They are a ${zodiac} with traits like ${traits.join(', ')}. Their life path number is ${lifePath}. Make it feel profound, mystical, and personalized. Address them by their nickname if provided. Do not use bullet points or sound like a horoscope app. Tone: warm, awe-inspiring, emotional.`);
  } catch (error) {
    console.error("AI Error:", error);
    return `${displayName}, you are a constellation of beautiful truths. Born under ${zodiac}, your journey is guided by a profound inner light, marked by a Life Path of ${lifePath}.`;
  }
};

export const generateBirthdayLetter = async (name: string, senderName: string, zodiac: string, personalMessage: string, relationship?: string, nickname?: string, rewriteMessage: boolean = true): Promise<string> => {
  const displayName = nickname || name;
  if (!API_KEY) {
    return `Dearest ${displayName},\n\nEvery time the earth completes another journey around the sun, the universe takes a moment to celebrate you. As a ${zodiac}, you bring a unique light into this world.\n\n${personalMessage}\n\nWith love,\n${senderName}`;
  }
  try {
    const prompt = rewriteMessage
      ? `Write a heartfelt, emotionally resonant birthday letter to ${name}${nickname ? ` (please address them as ${nickname})` : ''}. They are a ${zodiac}. ${relationship ? `The sender's relationship to them is: ${relationship}.` : ''} Take the core sentiment of this message and rewrite it emotionally: "${personalMessage}". Tone: deeply personal, cinematic, warm. Under 200 words. End with exactly:\nWith love,\n${senderName}`
      : `Write a heartfelt birthday letter to ${name}${nickname ? ` (please address them as ${nickname})` : ''}. They are a ${zodiac}. ${relationship ? `Relationship: ${relationship}.` : ''} Tone: deeply personal, cinematic, warm. Under 150 words. Do not include a closing signature.`;
    
    let text = await callAI(prompt);
    if (!rewriteMessage) {
      text = text.replace(/\n?\n?With love,\s*[\s\S]*$/i, '').trim();
      text = `${text}\n\n${personalMessage}\n\nWith love,\n${senderName}`;
    }
    return text;
  } catch (error) {
    console.error("AI Error:", error);
    return `To the wonderful ${displayName},\n\nThe universe shifted the day you were born. As a true ${zodiac}, you carry a light that warms everyone around you.\n\n${personalMessage}\n\nWith love,\n${senderName}`;
  }
};

export const generateStarMessages = async (name: string, zodiac: string, nickname?: string): Promise<string[]> => {
  const displayName = nickname || name;
  const fallbacks = [
    `Your light reaches further than you know.`,
    `You are made of the exact same matter as the stars.`,
    `The universe expands, and so does your heart.`,
    `Your existence is a beautiful necessity.`,
    `Even in darkness, you have the capacity to shine.`,
    `You belong exactly where you are.`
  ];
  if (!API_KEY) return fallbacks;
  try {
    const text = await callAI(`Write 6 short, profound, one-sentence affirmations for someone named ${displayName} whose zodiac sign is ${zodiac}. They should sound like ancient cosmic wisdom. Return ONLY a valid JSON array of strings, nothing else. Format: ["message 1", "message 2", ...]`);
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed) && parsed.length >= 6 ? parsed.slice(0, 6) : fallbacks;
  } catch (error) {
    console.error("AI Error:", error);
    return fallbacks;
  }
};

export const generateWishResponse = async (name: string): Promise<string> => {
  if (!API_KEY) return `The universe has heard you, ${name}. Your wish is carried on the solar winds.`;
  try {
    return await callAI(`Write a one-sentence mystical, reassuring response to someone named ${name} who just blew out a virtual birthday candle and made a wish. Make it sound like the universe is answering them.`);
  } catch (error) {
    return `The universe has heard you, ${name}. Your wish is carried on the solar winds.`;
  }
};