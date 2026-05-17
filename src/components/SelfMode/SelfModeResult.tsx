import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { StarField } from '../shared/StarField';
import { useAI } from '../../hooks/useAI';
import { getBirthData } from '../../utils/birthData';
import { getZodiacSign, getLifePathNumber } from '../../utils/astrology';

export const SelfModeResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, date } = location.state || { name: '', date: '' };
  
  const { fetchSelfModeData, isLoading } = useAI();
  const [identityText, setIdentityText] = useState<string | null>(null);

  useEffect(() => {
    if (!name || !date) {
      navigate('/me');
      return;
    }
    
    const loadData = async () => {
      const text = await fetchSelfModeData(name, date);
      setIdentityText(text);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, date, navigate]);

  if (isLoading || !identityText) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-cosmic-bg">
        <StarField speed={2} starCount={300} />
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cosmic-glow font-heading text-2xl italic tracking-wider"
        >
          Reading the stars...
        </motion.p>
      </div>
    );
  }

  const birthData = getBirthData(date);
  const { sign } = getZodiacSign(date);
  const { number, meaning: lpMeaning } = getLifePathNumber(date);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' as const } }
  };

  return (
    <div className="relative bg-cosmic-bg min-h-screen text-cosmic-text font-body selection:bg-cosmic-accent-1 selection:text-white">
      <StarField speed={0.1} starCount={200} />
      
      {/* Section 1: Arrival */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative snap-start">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-heading text-glow mb-6 text-center"
        >
          {name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="text-xl md:text-2xl text-cosmic-muted font-light tracking-widest uppercase"
        >
          The universe made space for {name}.
        </motion.p>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 text-cosmic-muted/50"
        >
          ↓ Scroll to explore
        </motion.div>
      </section>

      {/* Section 2: Cosmic Identity */}
      <section className="min-h-screen flex items-center justify-center px-4 snap-start">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-heading text-sm uppercase tracking-[0.3em] text-cosmic-accent-1 mb-8">
            Your Cosmic Blueprint
          </p>
          <p className="text-2xl md:text-4xl font-heading leading-relaxed italic text-cosmic-glow">
            "{identityText}"
          </p>
        </motion.div>
      </section>

      {/* Section 3: Symbolic Meaning */}
      <section className="min-h-screen flex items-center justify-center px-4 snap-start">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors">
            <h3 className="text-cosmic-muted text-sm uppercase tracking-widest mb-4">Element</h3>
            <p className="text-3xl font-heading text-cosmic-glow mb-2">{sign}</p>
            <p className="text-sm font-light leading-relaxed">Your celestial signature, shaping how you express your light.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors">
            <h3 className="text-cosmic-muted text-sm uppercase tracking-widest mb-4">Life Path</h3>
            <p className="text-3xl font-heading text-cosmic-glow mb-2">{number}</p>
            <p className="text-sm font-light leading-relaxed">{lpMeaning}. The underlying rhythm of your journey.</p>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors">
            <h3 className="text-cosmic-muted text-sm uppercase tracking-widest mb-4">Resonance</h3>
            <p className="text-3xl font-heading text-cosmic-glow mb-2">{birthData.stone}</p>
            <p className="text-sm font-light leading-relaxed">Your birthstone. Connected to the {birthData.flower} flower.</p>
          </div>
        </motion.div>
      </section>

      {/* Section 4: The Day You Were Born */}
      <section className="min-h-screen flex items-center justify-center px-4 snap-start">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-heading mb-8 text-glow">
            {birthData.month}
          </h2>
          <p className="text-xl md:text-2xl font-light leading-relaxed text-cosmic-muted">
            {birthData.meaning}
          </p>
        </motion.div>
      </section>

      {/* Section 5: Reflection Line */}
      <section className="min-h-screen flex items-center justify-center px-4 snap-start relative">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-2xl md:text-4xl font-heading text-cosmic-text italic text-glow">
            You are exactly where you are meant to be.
          </p>
        </motion.div>

        <button 
          onClick={() => navigate('/')}
          className="absolute bottom-12 text-sm uppercase tracking-widest text-cosmic-muted hover:text-cosmic-glow transition-colors"
        >
          Return to the beginning
        </button>
      </section>
    </div>
  );
};
