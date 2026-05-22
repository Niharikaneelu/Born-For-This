const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-3.5-turbo";
const B2_ENGLISH_STYLE = "Use B2-level English: keep the vocabulary simple and natural, use short clear sentences, avoid advanced words, and do not sound overly poetic or academic.";

const callAI = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("OpenRouter API key is not configured. Please set VITE_OPENROUTER_API_KEY environment variable.");
  }

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "https://born-for-this.vercel.app",
      "X-Title": "Born For This",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error Details:", errorData);
    throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }
  const data = await response.json();
  return data.choices[0].message.content.trim();
};

export const generateCosmicIdentity = async (name: string, zodiac: string, traits: string[], lifePath: number, nickname?: string): Promise<string> => {
  const displayName = nickname || name;
  if (!API_KEY) {
    return `${displayName}, born under ${zodiac}, you have a strong and special energy. With a Life Path of ${lifePath}, your path is shaped by your ${traits[0].toLowerCase()} and ${traits[1].toLowerCase()} nature.`;
  }
  try {
    return await callAI(`Write a 3-sentence paragraph explaining the cosmic identity of a person named ${name}${nickname ? ` (often called ${nickname})` : ''}. They are a ${zodiac} with traits like ${traits.join(', ')}. Their life path number is ${lifePath}. Make it personal and warm, but keep the English at B2 level. ${B2_ENGLISH_STYLE} Address them by their nickname if provided. Do not use bullet points.`);
  } catch (error) {
    console.error("AI Error:", error);
    return `${displayName}, you have a strong and special light. Born under ${zodiac}, your path is shaped by your inner strength and your Life Path of ${lifePath}.`;
  }
};

export const generateBirthdayLetter = async (name: string, senderName: string, zodiac: string, personalMessage: string, relationship?: string, nickname?: string, rewriteMessage: boolean = true): Promise<string> => {
  const displayName = nickname || name;
  if (!API_KEY) {
    return `Dear ${displayName},\n\nToday is a good day to celebrate you. As a ${zodiac}, you bring a special light to the people around you.\n\n${personalMessage}\n\nWith love,\n${senderName}`;
  }
  try {
    const prompt = rewriteMessage
      ? `Write a heartfelt birthday letter to ${name}${nickname ? ` (please address them as ${nickname})` : ''}. They are a ${zodiac}. ${relationship ? `The sender's relationship to them is: ${relationship}.` : ''} Rewrite the core meaning of this message in a warm way: "${personalMessage}". Keep the English at B2 level. ${B2_ENGLISH_STYLE} Under 200 words. End with exactly:\nWith love,\n${senderName}`
      : `Write a heartfelt birthday letter to ${name}${nickname ? ` (please address them as ${nickname})` : ''}. They are a ${zodiac}. ${relationship ? `Relationship: ${relationship}.` : ''} Keep the English at B2 level. ${B2_ENGLISH_STYLE} Under 150 words. Do not include a closing signature.`;
    
    let text = await callAI(prompt);
    if (!rewriteMessage) {
      text = text.replace(/\n?\n?With love,\s*[\s\S]*$/i, '').trim();
      text = `${text}\n\n${personalMessage}\n\nWith love,\n${senderName}`;
    }
    return text;
  } catch (error) {
    console.error("AI Error:", error);
    return `Dear ${displayName},\n\nThe day you were born was a special one. As a ${zodiac}, you bring warmth and light to the people around you.\n\n${personalMessage}\n\nWith love,\n${senderName}`;
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
    const text = await callAI(`Write 6 short, one-sentence affirmations for someone named ${displayName} whose zodiac sign is ${zodiac}. Keep the English at B2 level. ${B2_ENGLISH_STYLE} Return ONLY a valid JSON array of strings, nothing else. Format: ["message 1", "message 2", ...]`);
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
    return await callAI(`Write a one-sentence reassuring response to someone named ${name} who just blew out a virtual birthday candle and made a wish. Keep the English at B2 level. ${B2_ENGLISH_STYLE} Make it feel warm and friendly.`);
  } catch (error) {
    return `The universe has heard you, ${name}. Your wish is carried on the solar winds.`;
  }
};