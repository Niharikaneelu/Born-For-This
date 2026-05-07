export const getZodiacSign = (dateStr: string): { sign: string; symbol: string } => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", symbol: "♈" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", symbol: "♉" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", symbol: "♊" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", symbol: "♋" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", symbol: "♌" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", symbol: "♍" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", symbol: "♎" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", symbol: "♏" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", symbol: "♐" };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Capricorn", symbol: "♑" };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", symbol: "♒" };
  return { sign: "Pisces", symbol: "♓" };
};

export const getLifePathNumber = (dateStr: string): { number: number; meaning: string } => {
  // e.g. 1990-10-15
  const digits = dateStr.replace(/\D/g, '').split('').map(Number);
  
  let sum = digits.reduce((a, b) => a + b, 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }

  const meanings: Record<number, string> = {
    1: "The Independent Leader",
    2: "The Peacemaker",
    3: "The Creative Communicator",
    4: "The Dedicated Worker",
    5: "The Free Spirit",
    6: "The Nurturer",
    7: "The Seeker of Truth",
    8: "The Powerhouse",
    9: "The Humanitarian",
    11: "The Intuitive Illuminator",
    22: "The Master Builder",
    33: "The Master Teacher"
  };

  return { number: sum, meaning: meanings[sum] || "The Mystery" };
};

export const getPersonalityTraits = (sign: string): string[] => {
  const traits: Record<string, string[]> = {
    "Aries": ["Courageous", "Determined", "Confident", "Enthusiastic", "Optimistic", "Honest", "Passionate"],
    "Taurus": ["Reliable", "Patient", "Practical", "Devoted", "Responsible", "Stable"],
    "Gemini": ["Gentle", "Affectionate", "Curious", "Adaptable", "Ability to learn quickly", "Exchange ideas"],
    "Cancer": ["Tenacious", "Highly imaginative", "Loyal", "Emotional", "Sympathetic", "Persuasive"],
    "Leo": ["Creative", "Passionate", "Generous", "Warm-hearted", "Cheerful", "Humorous"],
    "Virgo": ["Loyal", "Analytical", "Kind", "Hardworking", "Practical"],
    "Libra": ["Cooperative", "Diplomatic", "Gracious", "Fair-minded", "Social"],
    "Scorpio": ["Resourceful", "Brave", "Passionate", "Stubborn", "A true friend"],
    "Sagittarius": ["Generous", "Idealistic", "Great sense of humor"],
    "Capricorn": ["Responsible", "Disciplined", "Self-control", "Good managers"],
    "Aquarius": ["Progressive", "Original", "Independent", "Humanitarian"],
    "Pisces": ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise", "Musical"]
  };
  return traits[sign] || ["Unique", "Special", "Mysterious"];
};
