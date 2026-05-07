import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StarField } from '../shared/StarField';

export const SelfModeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      navigate('/me/result', { state: { name, date } });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
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
        className="w-full max-w-md"
      >
        <h2 className="text-4xl text-cosmic-text font-heading text-center mb-12 text-glow">
          Who are you?
        </h2>

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
              Your Name
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
              When did you arrive?
            </label>
          </div>

          <div className="pt-8 text-center">
            <button
              type="submit"
              disabled={!name || !date}
              className="px-12 py-3 rounded-full border border-cosmic-glow text-cosmic-text font-heading text-xl tracking-widest hover:bg-cosmic-glow hover:text-cosmic-bg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed box-glow"
            >
              Reveal
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
