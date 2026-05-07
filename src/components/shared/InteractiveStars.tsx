import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveStarsProps {
  messages: string[];
}

export const InteractiveStars: React.FC<InteractiveStarsProps> = ({ messages }) => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleStarClick = (index: number) => {
    setRevealed(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
        {messages.map((message, index) => {
          const isRevealed = revealed[index];

          return (
            <div 
              key={index} 
              className="relative flex flex-col items-center justify-start min-h-[120px]"
            >
              <motion.button
                onClick={() => handleStarClick(index)}
                className={`relative rounded-full transition-all duration-700 ${
                  isRevealed 
                    ? 'w-2 h-2 bg-cosmic-accent-1 shadow-[0_0_15px_rgba(124,58,237,0.8)] mt-2' 
                    : 'w-4 h-4 bg-white animate-glow-pulse cursor-pointer hover:scale-125 mt-1'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 1 }}
                viewport={{ once: true }}
                disabled={isRevealed}
              />
              
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 20 }}
                    className="absolute top-6 w-full max-w-[250px] text-center z-10"
                  >
                    <p className="text-sm font-body text-cosmic-glow italic tracking-wide leading-relaxed">
                      "{message}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      {!Object.values(revealed).length && (
        <motion.div 
          className="text-center mt-12 text-cosmic-muted font-body text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 2 }}
        >
          Touch the stars
        </motion.div>
      )}
    </div>
  );
};
