export const getBirthData = (dateStr: string) => {
  const date = new Date(dateStr);
  const monthIndex = date.getMonth(); // 0-11
  
  const monthsData = [
    {
      month: "January",
      stone: "Garnet",
      flower: "Carnation",
      meaning: "A time of new beginnings. You carry the energy of initiation, clarity, and the quiet strength of winter."
    },
    {
      month: "February",
      stone: "Amethyst",
      flower: "Violet",
      meaning: "A season of deep intuition. You are connected to inner wisdom, imagination, and the peaceful moments before spring."
    },
    {
      month: "March",
      stone: "Aquamarine",
      flower: "Daffodil",
      meaning: "The awakening of the earth. You possess a spirit of renewal, courage, and natural vitality."
    },
    {
      month: "April",
      stone: "Diamond",
      flower: "Daisy",
      meaning: "A burst of pure light. You bring clarity, unbreakable resilience, and the vibrant energy of full bloom."
    },
    {
      month: "May",
      stone: "Emerald",
      flower: "Lily of the Valley",
      meaning: "The height of spring's abundance. You embody growth, harmony, and a deep connection to nature."
    },
    {
      month: "June",
      stone: "Pearl",
      flower: "Rose",
      meaning: "The gateway to summer. You carry warmth, grace, and an intrinsic, luminous beauty."
    },
    {
      month: "July",
      stone: "Ruby",
      flower: "Larkspur",
      meaning: "The peak of the sun's power. You radiate passion, life force, and magnetic energy."
    },
    {
      month: "August",
      stone: "Peridot",
      flower: "Gladiolus",
      meaning: "The golden hour of the year. You have a radiant, strong-willed nature filled with inner light."
    },
    {
      month: "September",
      stone: "Sapphire",
      flower: "Aster",
      meaning: "The turning of the leaves. You embody wisdom, loyalty, and the grounding presence of autumn."
    },
    {
      month: "October",
      stone: "Opal",
      flower: "Marigold",
      meaning: "A season of shifting colors. You hold mystery, creative spirit, and emotional depth."
    },
    {
      month: "November",
      stone: "Topaz",
      flower: "Chrysanthemum",
      meaning: "The quiet descent into reflection. You have a transformative energy, warmth, and quiet power."
    },
    {
      month: "December",
      stone: "Turquoise",
      flower: "Narcissus",
      meaning: "The return of the light. You carry the magic of the solstice, bringing hope, protection, and joy."
    }
  ];

  return monthsData[monthIndex];
};
