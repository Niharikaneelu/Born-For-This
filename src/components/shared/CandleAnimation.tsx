import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../../hooks/useAI';

interface CandleAnimationProps {
  name: string;
  onBlowStart?: () => void;
  onBlowEnd?: () => void;
}

export const CandleAnimation: React.FC<CandleAnimationProps> = ({ name, onBlowStart, onBlowEnd }) => {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [blowDurationMs, setBlowDurationMs] = useState(1200);
  const [wishResponse, setWishResponse] = useState<string | null>(null);
  const [isWishing, setIsWishing] = useState(false);
  const { fetchWishResponse } = useAI();

  const blowAnimationTimerRef = React.useRef<number | null>(null);
  const blowMusicTimerRef = React.useRef<number | null>(null);

  const clearBlowTimers = () => {
    if (blowAnimationTimerRef.current !== null) {
      window.clearTimeout(blowAnimationTimerRef.current);
      blowAnimationTimerRef.current = null;
    }

    if (blowMusicTimerRef.current !== null) {
      window.clearTimeout(blowMusicTimerRef.current);
      blowMusicTimerRef.current = null;
    }
  };

  const handleMakeWish = async () => {
    if (isWishing || isBlownOut) return;

    clearBlowTimers();
    setIsWishing(true);
    setIsBlowing(true);
    onBlowStart?.();

    // Sound should point to an audio file in /public, e.g. /blow.mp3
    const blowSound = new Audio('/blow.mp3');
    blowSound.volume = 0.8;
    const restoreMusic = () => onBlowEnd?.();
    blowSound.preload = 'auto';
    blowSound.onended = restoreMusic;

    const finishBlowAnimation = () => {
      setIsBlowing(false);
      setIsBlownOut(true);
    };

    blowSound.onloadedmetadata = () => {
      const blowDurationMs = Number.isFinite(blowSound.duration)
        ? Math.max(300, blowSound.duration * 1000)
        : 1200;

      setBlowDurationMs(blowDurationMs);

      // Keep the flame/wind active until the actual blow audio finishes.
      blowAnimationTimerRef.current = window.setTimeout(finishBlowAnimation, blowDurationMs);

      // Match the background restore timing with the blow sound.
      blowMusicTimerRef.current = window.setTimeout(() => {
        restoreMusic();
      }, blowDurationMs);
    };

    blowSound.play().catch(() => {
      // Ignore playback failures (for example if the file is missing).
      finishBlowAnimation();
      restoreMusic();
    });

    try {
      const response = await Promise.race<string>([
        fetchWishResponse(name),
        new Promise((resolve) => {
          window.setTimeout(() => resolve('Your wish is on its way.'), 15000);
        }),
      ]);

      setWishResponse(response);
    } finally {
      setIsWishing(false);
    }
  };

  React.useEffect(() => {
    return () => {
      clearBlowTimers();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* Cake + Candle scene */}
      <div className="relative flex flex-col items-center mb-12">
        {/* Wind streaks */}
        <AnimatePresence>
          {isBlowing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-6 -left-28 w-44 h-14 pointer-events-none z-30"
            >
              {[0, 1, 2].map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0, scaleX: 0.7 }}
                  animate={{ x: 170, opacity: [0, 1, 0], scaleX: [0.7, 1.2, 1] }}
                  transition={{
                    duration: Math.max(blowDurationMs / 1000, 0.3),
                    ease: 'easeOut',
                    delay: idx * 0.08,
                    repeat: 0,
                  }}
                  className={`absolute h-1.5 rounded-full bg-gradient-to-r from-cyan-200/20 via-cyan-200/90 to-transparent blur-[1px] ${
                    idx === 0 ? 'top-1' : idx === 1 ? 'top-5' : 'top-9'
                  }`}
                  style={{ width: idx === 1 ? '150px' : '120px' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flame */}
        <AnimatePresence>
          {!isBlownOut && (
            <motion.div
              animate={isBlowing ? { x: 8, scaleY: 0.85, rotate: 8 } : { x: 0, scaleY: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, y: -20 }}
              transition={{ duration: Math.max(blowDurationMs / 1000 / 4, 0.15) }}
              className="relative w-6 h-12 mb-1 z-30"
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
        <div className="w-1 h-3 bg-gray-800 rounded-t-sm z-30" />

        {/* Candle + Cake + Cream — all in one group so they move together */}
<div className="relative flex flex-col items-center">

  {/* Candle body */}
  <div className="w-8 h-40 bg-gradient-to-r from-gray-200 via-white to-gray-300 rounded-sm shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1)] relative z-20">
    <div className="absolute top-0 w-full h-2 bg-white rounded-t-sm" />
    <div className="absolute top-1 left-1 w-2 h-6 bg-white rounded-b-full opacity-80" />
    <div className="absolute top-1 right-2 w-1.5 h-4 bg-white rounded-b-full opacity-80" />
  </div>

  {/* Cake + cream stacked together */}
  <div className="relative flex flex-col items-center mt-[-70px]">
    {/* Cake */}
    <img
      src="/cake.png"
      alt="Cake"
      className="w-[28rem] max-w-full h-auto object-contain drop-shadow-[0_18px_26px_rgba(0,0,0,0.25)] z-10"
    />
    {/* Cream — absolutely positioned on top of the cake */}
    <img
      src="/cream.png"
      alt="Cream"
      className="absolute w-[4.5rem] h-auto object-contain z-20"
      style={{ top: '50px', left: '50%', transform: 'translateX(-50%)' }}
    />
  </div>

</div>
      </div>

      {/* Interaction */}
      <AnimatePresence mode="wait">
        {!isBlownOut ? (
          <motion.button
            type="button"
            key="wish-btn"
            exit={{ opacity: 0, y: 10 }}
            onClick={handleMakeWish}
            disabled={isWishing}
            className="relative z-50 mt-6 px-8 py-3 rounded-full border border-cosmic-glow text-cosmic-text font-heading text-xl tracking-widest hover:bg-cosmic-glow hover:text-cosmic-bg transition-all duration-300 shadow-[0_0_15px_rgba(196,181,253,0.3)] hover:shadow-[0_0_25px_rgba(196,181,253,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isWishing ? 'Creating...' : 'Blow the candle'}
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
              {wishResponse || 'Listening now...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
