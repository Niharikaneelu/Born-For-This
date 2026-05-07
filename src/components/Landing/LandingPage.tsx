import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StarField } from '../shared/StarField';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <StarField speed={0.2} starCount={250} />
      
      {/* Background Nebulas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-accent-1 opacity-20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-accent-2 opacity-20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <main className="z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-cosmic-text mb-6 text-glow">
            You were not born randomly.
          </h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="text-lg md:text-2xl text-cosmic-muted font-body font-light tracking-wide max-w-2xl mx-auto space-y-2 mb-16"
          >
            <p>Some people just exist.</p>
            <p>Some people change everything.</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1.5 }}
          className="flex flex-col items-center"
        >
          <p className="text-cosmic-glow font-body text-sm tracking-widest uppercase mb-8">
            Who is this for?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => navigate('/me')}
              className="px-8 py-3 rounded-full border border-cosmic-muted text-cosmic-text font-heading text-xl tracking-widest hover:border-cosmic-glow hover:text-cosmic-glow hover:box-glow transition-all duration-300"
            >
              For Me
            </button>
            <button
              onClick={() => navigate('/gift')}
              className="px-8 py-3 rounded-full bg-cosmic-text text-cosmic-bg font-heading text-xl tracking-widest hover:bg-cosmic-glow transition-all duration-300 shadow-[0_0_20px_rgba(245,243,255,0.2)] hover:shadow-[0_0_30px_rgba(196,181,253,0.4)]"
            >
              For Someone Special
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
