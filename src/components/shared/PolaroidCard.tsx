import React from 'react';

interface PolaroidCardProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  src,
  alt,
  caption,
  className = '',
  imageClassName = '',
}) => {
  return (
    <div
      className={`relative mx-auto w-full max-w-2xl rounded-sm border border-white/70 bg-[#f7f2e8] p-4 pb-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] ${className}`}
      style={{ transform: 'rotate(-1.5deg)' }}
    >
      <div className="absolute left-4 right-4 top-4 h-px bg-white/60" />
      <div className="absolute left-4 right-4 top-5 h-px bg-black/5" />
      <img
        src={src}
        alt={alt}
        className={`block w-full rounded-[2px] object-cover shadow-[0_10px_24px_rgba(0,0,0,0.18)] ${imageClassName}`}
      />
      {caption && (
        <div className="mt-5 text-center font-heading text-sm uppercase tracking-[0.28em] text-slate-700">
          {caption}
        </div>
      )}
    </div>
  );
};