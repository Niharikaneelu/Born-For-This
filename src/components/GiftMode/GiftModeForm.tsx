import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StarField } from '../shared/StarField';

export const GiftModeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [nickname, setNickname] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [relationship, setRelationship] = useState('');
  const [rewriteMessage, setRewriteMessage] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && senderName && date && message) {
      navigate('/gift/result', { state: { name, senderName, nickname, date, message, relationship, rewriteMessage } });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      <StarField speed={0.1} starCount={150} />
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 left-8 text-cosmic-muted hover:text-cosmic-glow transition-colors font-body tracking-widest uppercase text-sm"
        onClick={() => navigate('/')}
      >
        ← Return
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-black/40 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md"
      >
        <h2 className="text-3xl md:text-4xl text-cosmic-text font-heading text-center mb-2 text-glow">
          Create a Universe
        </h2>
        <p className="text-center text-cosmic-muted mb-10 text-sm tracking-wide">
          Craft a deeply personal cosmic experience for someone special.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label 
              htmlFor="name"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Their Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="senderName"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label
              htmlFor="senderName"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Your Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label 
              htmlFor="nickname"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Their Nickname (Optional)
            </label>
          </div>

          <div className="relative">
            <input
              type="date"
              id="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-xl text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
            />
            <label 
              htmlFor="date"
              className="absolute left-1 -top-6 text-sm text-cosmic-muted font-body transition-all peer-focus:text-cosmic-glow"
            >
              Their Birth Date
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="block w-full bg-transparent border-b border-cosmic-muted/50 py-3 px-1 text-lg text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors peer"
              placeholder=" "
            />
            <label 
              htmlFor="relationship"
              className="absolute left-1 top-3 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-6 peer-valid:text-sm"
            >
              Your Relationship (Optional)
            </label>
            <span className="absolute right-1 top-4 text-xs text-cosmic-muted/50">e.g., Best Friend, Sister</span>
          </div>

          <div className="relative mt-12">
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full bg-white/5 border border-cosmic-muted/30 rounded-xl p-4 text-lg text-cosmic-text focus:outline-none focus:border-cosmic-glow transition-colors resize-none placeholder-transparent peer"
              placeholder=" "
            />
            <label 
              htmlFor="message"
              className="absolute left-4 top-4 text-cosmic-muted font-body text-lg transition-all peer-focus:-top-8 peer-focus:left-1 peer-focus:text-sm peer-focus:text-cosmic-glow peer-valid:-top-8 peer-valid:left-1 peer-valid:text-sm"
            >
              Your Personal Message
            </label>
          </div>

          <div className="flex items-center space-x-3 text-left">
            <input
              type="checkbox"
              id="rewriteMessage"
              checked={rewriteMessage}
              onChange={(e) => setRewriteMessage(e.target.checked)}
              className="w-5 h-5 accent-cosmic-accent-1 cursor-pointer"
            />
            <label htmlFor="rewriteMessage" className="text-cosmic-muted text-sm cursor-pointer select-none">
              Let AI seamlessly weave this message into the letter (uncheck to include it exactly as written at the end)
            </label>
          </div>

          <div className="pt-6 text-center">
            <button
              type="submit"
              disabled={!name || !senderName || !date || !message}
              className="w-full py-4 rounded-xl bg-cosmic-text text-cosmic-bg font-heading text-xl tracking-widest hover:bg-cosmic-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,243,255,0.1)] hover:shadow-[0_0_30px_rgba(196,181,253,0.3)]"
            >
              Generate Universe
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
