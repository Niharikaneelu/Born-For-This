import { useState } from 'react';
import { 
  generateCosmicIdentity, 
  generateBirthdayLetter, 
  generateStarMessages, 
  generateWishResponse 
} from '../services/gemini';
import { getZodiacSign, getLifePathNumber, getPersonalityTraits } from '../utils/astrology';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSelfModeData = async (name: string, date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { sign } = getZodiacSign(date);
      const traits = getPersonalityTraits(sign);
      const { number } = getLifePathNumber(date);
      
      const identity = await generateCosmicIdentity(name, sign, traits, number);
      return identity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cosmic identity');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGiftModeData = async (name: string, senderName: string, date: string, message: string, relationship?: string, nickname?: string, rewriteMessage: boolean = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const { sign } = getZodiacSign(date);
      const traits = getPersonalityTraits(sign);
      const { number } = getLifePathNumber(date);
      
      const [identity, letter, stars] = await Promise.all([
        generateCosmicIdentity(name, sign, traits, number, nickname),
        generateBirthdayLetter(name, senderName, sign, message, relationship, nickname, rewriteMessage),
        generateStarMessages(name, sign, nickname)
      ]);

      return { identity, letter, stars };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate gift experience');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishResponse = async (name: string) => {
    try {
      return await generateWishResponse(name);
    } catch (err) {
      console.error(err);
      return "Your wish is carried on the solar winds.";
    }
  };

  return { fetchSelfModeData, fetchGiftModeData, fetchWishResponse, isLoading, error };
};
