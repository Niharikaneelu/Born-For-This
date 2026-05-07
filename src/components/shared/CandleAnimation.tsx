import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../../hooks/useAI';

interface CandleAnimationProps {
  name: string;
}

export const CandleAnimation: React.FC<CandleAnimationProps> = ({ name }) => {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [wishResponse, setWishResponse] = useState<string | null>(null);
  const [isWishing, setIsWishing] = useState(false);
  const { fetchWishResponse } = useAI();

  const handleMakeWish = async () => {
    if (isWishing || isBlownOut) return;
    
    setIsWishing(true);
    setIsBlownOut(true);
    
    const response = await fetchWishResponse(name);
    setWishResponse(response);
    setIsWishing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* Candle */}
      <div className="relative flex flex-col items-center mb-12">
        {/* Flame */}
        <AnimatePresence>
          {!isBlownOut && (
            <motion.div
              exit={{ scale: 0, opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative w-6 h-12 mb-1"
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] animate-glow-pulse blur-[2px]" />
              <div className="absolute inset-1 bg-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%]" />
              <div className="absolute bottom-0 w-1 h-3 left-1/2 -translate-x-1/2 bg-blue-400 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Smoke after blowout */}
        <AnimatePresence>
          {isBlownOut && !wishResponse && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.5, 0], y: -50, scale: [1, 2, 3] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute -top-10 w-4 h-4 rounded-full bg-gray-400 blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Wick */}
        <div className="w-1 h-3 bg-gray-800 rounded-t-sm z-10" />
        
        {/* Body */}
        <div className="w-8 h-32 bg-gradient-to-r from-gray-200 via-white to-gray-300 rounded-sm shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1)] relative">
          {/* Melt details */}
          <div className="absolute top-0 w-full h-2 bg-white rounded-t-sm" />
          <div className="absolute top-1 left-1 w-2 h-6 bg-white rounded-b-full opacity-80" />
          <div className="absolute top-1 right-2 w-1.5 h-4 bg-white rounded-b-full opacity-80" />
        </div>
      </div>

      {/* Interaction */}
      <AnimatePresence mode="wait">
        {!isBlownOut ? (
          <motion.button
            key="wish-btn"
            exit={{ opacity: 0, y: 10 }}
            onClick={handleMakeWish}
            className="px-8 py-3 rounded-full border border-cosmic-glow text-cosmic-text font-heading text-xl tracking-widest hover:bg-cosmic-glow hover:text-cosmic-bg transition-all duration-300 shadow-[0_0_15px_rgba(196,181,253,0.3)] hover:shadow-[0_0_25px_rgba(196,181,253,0.6)]"
          >
            Make a Wish
          </motion.button>
        ) : (
          <motion.div
            key="wish-response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-center max-w-lg"
          >
            <p className="font-heading text-2xl text-cosmic-glow italic leading-relaxed">
              {wishResponse || "Listening to the stars..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
