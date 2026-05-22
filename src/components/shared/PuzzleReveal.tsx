import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';
import { PuzzleGame } from './PuzzleGame';
import { PolaroidCard } from './PolaroidCard';

interface PuzzleRevealProps {
  pieces: string[]; // 9 piece data URLs
  pieceWidth: number;
  pieceHeight: number;
  fullImageUrl: string;
  voiceUrl?: string;
  recipientName?: string;
}

export const PuzzleReveal: React.FC<PuzzleRevealProps> = ({
  pieces,
  pieceWidth,
  pieceHeight,
  fullImageUrl,
  recipientName = '',
  voiceUrl,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      try {
        audioRef.current?.pause();
        audioRef.current = null;
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const togglePlay = async (url: string) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setPlaying(false);
      }

      if (playing) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (e) {
      console.warn('Playback failed', e);
    }
  };

  const VoicePlayerButton: React.FC<{ url: string }> = ({ url }) => (
    <button
      onClick={() => togglePlay(url)}
      className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-cosmic-glow/50 text-cosmic-glow font-heading tracking-widest hover:bg-white/10 transition-all duration-300"
      title="Play voice note"
    >
      <Music className="w-5 h-5" />
      {playing ? 'Stop message' : 'Play message'}
    </button>
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayPieceSize = useMemo(() => {
    const horizontalPadding = 32;
    const verticalPadding = 280;
    const maxBoardWidth = Math.min(960, viewportSize.width - horizontalPadding * 2);
    const maxBoardHeight = Math.min(620, viewportSize.height - verticalPadding);
    const maxPieceByWidth = Math.floor((maxBoardWidth - 16) / 3);
    const maxPieceByHeight = Math.floor((maxBoardHeight - 16) / 3);
    const cap = Math.max(120, Math.min(maxPieceByWidth, maxPieceByHeight));
    return Math.min(pieceWidth, pieceHeight, cap);
  }, [pieceWidth, pieceHeight, viewportSize.height, viewportSize.width]);

  const handlePuzzleComplete = () => {
    setIsCompleted(true);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 snap-start relative overflow-hidden">
      {/* Background nebulas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cosmic-accent-1 opacity-5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cosmic-accent-2 opacity-5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading text-cosmic-glow text-glow mb-2">
            Some memories take time to find.
          </h2>
          <p className="text-cosmic-muted text-sm uppercase tracking-widest">
            Put this moment together
          </p>
        </motion.div>

        {/* Puzzle Game Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 w-full flex justify-center"
        >
          <PuzzleGame
            pieces={pieces}
            pieceWidth={displayPieceSize}
            pieceHeight={displayPieceSize}
            onComplete={handlePuzzleComplete}
          />
        </motion.div>

        {/* Completion Reveal */}
        <AnimatePresence>
          {isCompleted && (
            <>
              {/* Celebration particles/glow */}
              <motion.div
                key="celebration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 pointer-events-none z-20"
              >
                {/* Radial glow burst */}
                <motion.div
                  animate={{
                    scale: [0, 3],
                    opacity: [0.8, 0],
                  }}
                  transition={{ duration: 1.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cosmic-glow rounded-full blur-3xl"
                />

                {/* Particle burst effect */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2;
                  const distance = 200;
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;

                  return (
                    <motion.div
                      key={`particle-${i}`}
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                      }}
                      animate={{
                        x,
                        y,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{
                        duration: 1.5,
                        ease: 'easeOut',
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-cosmic-accent-1 rounded-full"
                    />
                  );
                })}
              </motion.div>

              {/* Full image reveal section */}
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-20 space-y-12 relative z-10"
              >
                {/* Full image with glow */}
                <motion.div
                  className="relative mx-auto max-w-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(196, 181, 253, 0.2)',
                      '0 0 40px rgba(196, 181, 253, 0.4)',
                      '0 0 20px rgba(196, 181, 253, 0.2)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <PolaroidCard
                    src={fullImageUrl}
                    alt="Memory photo"
                    caption={recipientName ? `For ${recipientName}` : 'A memory'}
                    imageClassName="h-[28rem]"
                  />
                </motion.div>

                {/* Emotional message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-center max-w-2xl mx-auto"
                >
                  <p className="text-2xl md:text-3xl font-heading text-cosmic-glow leading-relaxed italic">
                    Maybe this is why we met.
                  </p>
                  {recipientName && (
                    <p className="text-cosmic-muted text-sm uppercase tracking-widest mt-6">
                      — For {recipientName}
                    </p>
                  )}
                </motion.div>

                {/* Voice note button (placeholder for future feature) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex justify-center"
                >
                  {voiceUrl ? (
                    <VoicePlayerButton url={voiceUrl} />
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-cosmic-glow/50 text-cosmic-glow font-heading tracking-widest hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Voice note coming soon"
                    >
                      <Music className="w-5 h-5" />
                      Play message
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Help text before completion */}
        {!isCompleted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-cosmic-muted text-sm uppercase tracking-widest mt-8"
          >
            Drag the pieces to the grid. A memory is waiting.
          </motion.p>
        )}
      </div>
    </section>
  );
};
