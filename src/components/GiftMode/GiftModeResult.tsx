import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { StarField } from '../shared/StarField';
import { TypingText } from '../shared/TypingText';
import { InteractiveStars } from '../shared/InteractiveStars';
import { CandleAnimation } from '../shared/CandleAnimation';
import { useAI } from '../../hooks/useAI';
import { getBirthData } from '../../utils/birthData';
import { Copy, Music, Music2 } from 'lucide-react';

interface GiftData {
  name: string;
  senderName?: string;
  nickname?: string;
  date: string;
  identity: string;
  letter: string;
  stars: string[];
}

export const GiftModeResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { encodedId } = useParams<{ encodedId?: string }>();
  
  const { fetchGiftModeData, isLoading } = useAI();
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    const loadFromHash = () => {
      try {
        const decoded = JSON.parse(atob(encodedId!));
        setGiftData(decoded);
      } catch (e) {
        navigate('/');
      }
    };

    const generateNew = async () => {
      const { name, senderName, nickname, date, message, relationship, rewriteMessage = true } = location.state || {};
      if (!name || !senderName || !date || !message) {
        navigate('/');
        return;
      }
      const data = await fetchGiftModeData(name, senderName, date, message, relationship, nickname, rewriteMessage);
      if (data) {
        setGiftData({ name, senderName, nickname, date, ...data });
      }
    };

    if (encodedId) {
      loadFromHash();
    } else {
      generateNew();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encodedId, location.state, navigate]);

  const handleShare = () => {
    if (!giftData) return;
    const encoded = btoa(JSON.stringify(giftData));
    const shareUrl = `${window.location.origin}/share/${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (isLoading || !giftData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative bg-cosmic-bg px-4 text-center">
        <StarField speed={2} starCount={300} />
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cosmic-glow font-heading text-3xl italic tracking-wider mb-4"
        >
          Reading the stars...
        </motion.p>
        <p className="text-cosmic-muted font-light text-sm tracking-widest uppercase">
          Crafting your unique universe
        </p>
      </div>
    );
  }

  const birthData = getBirthData(giftData.date);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' as const } }
  };

  return (
    <div className="relative bg-cosmic-bg min-h-screen text-cosmic-text font-body selection:bg-cosmic-accent-1 selection:text-white">
      <StarField speed={0.05} starCount={250} />
      
      {/* Background Nebulas */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cosmic-accent-1 opacity-10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cosmic-accent-2 opacity-10 rounded-full blur-[120px] mix-blend-screen" />
      </div>
      
      {/* Music Toggle */}
      <button 
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="fixed top-8 right-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm group"
        title="Toggle Music"
      >
        {musicPlaying ? 
          <Music className="w-5 h-5 text-cosmic-glow" /> : 
          <Music2 className="w-5 h-5 text-cosmic-muted group-hover:text-cosmic-glow" />
        }
      </button>

      {/* Section 1: Arrival */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative snap-start">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="text-cosmic-muted text-sm uppercase tracking-[0.3em] mb-8"
        >
          A universe made for
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="text-7xl md:text-9xl font-heading text-glow mb-12 text-center"
        >
          { giftData.name}
        </motion.h1>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 text-cosmic-muted/50 tracking-widest text-sm uppercase"
        >
          Begin the journey
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
          <p className="text-2xl md:text-4xl font-heading leading-loose italic text-cosmic-glow">
            {giftData.identity}
          </p>
        </motion.div>
      </section>

      {/* Section 3: The Day You Were Born */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 snap-start">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-sm font-body uppercase tracking-[0.3em] text-cosmic-muted mb-6">
            The Day You Arrived
          </h2>
          <p className="text-xl md:text-3xl font-heading leading-relaxed text-cosmic-text">
            {birthData.meaning}
          </p>
        </motion.div>
      </section>

      {/* Section 4: AI Letter */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 snap-start">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          onViewportEnter={() => setLetterVisible(true)}
          viewport={{ once: true, margin: "-30%" }}
          className="max-w-2xl mx-auto w-full bg-black/30 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-md relative"
        >
          <div className="absolute -top-4 -left-4 text-6xl text-cosmic-accent-1/30 font-heading">"</div>
          <div className="absolute -bottom-10 -right-4 text-6xl text-cosmic-accent-1/30 font-heading">"</div>
          
          <div className="text-lg md:text-2xl font-heading leading-loose text-cosmic-text min-h-[300px]">
            {letterVisible && (
              <TypingText text={giftData.letter} speed={60} />
            )}
          </div>
        </motion.div>
      </section>

      {/* Section 5: Interactive Stars */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 snap-start relative overflow-hidden w-full">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 z-10 w-full"
        >
          <h2 className="text-3xl font-heading text-cosmic-glow">Hidden Messages</h2>
          <p className="text-cosmic-muted mt-2">Find the brightest stars.</p>
        </motion.div>
        
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
          <InteractiveStars messages={giftData.stars} />
        </div>
      </section>

      {/* Section 6: Birthday Moment */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 snap-start">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading text-glow mb-4">A Moment For You</h2>
          <p className="text-cosmic-muted text-lg">Close your eyes. Make a wish.</p>
        </motion.div>

        <CandleAnimation name={giftData.name} />
      </section>

      {/* Section 7: Share (Only show if not already shared) */}
      {!encodedId && (
        <section className="min-h-[50vh] flex flex-col items-center justify-center px-4 pb-20 snap-start border-t border-white/5">
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-heading text-cosmic-text mb-6">Gift this experience</h2>
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-cosmic-text text-cosmic-bg font-heading text-xl tracking-widest hover:bg-cosmic-glow transition-all duration-300 shadow-[0_0_20px_rgba(245,243,255,0.1)] mx-auto"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Link Copied!' : 'Copy Share Link'}
            </button>
            <p className="text-cosmic-muted mt-6 text-sm">
              Send this link to {giftData.name}. It will open their personal universe.
            </p>
          </motion.div>
        </section>
      )}

      {/* Footer for shared view */}
      {encodedId && (
        <section className="py-12 flex flex-col items-center justify-center border-t border-white/5">
          <p className="text-cosmic-muted text-sm uppercase tracking-widest mb-4">
            Created with Born For This
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-cosmic-glow hover:text-white transition-colors text-sm"
          >
            Create your own universe
          </button>
        </section>
      )}
    </div>
  );
};
