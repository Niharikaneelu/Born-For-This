import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  speed = 50, 
  className = "",
  onComplete
}) => {
  return (
    <div className={`font-body leading-relaxed whitespace-pre-wrap ${className}`}>
      <TypeAnimation
        sequence={[
          text,
          () => {
            if (onComplete) onComplete();
          }
        ]}
        wrapper="span"
        cursor={true}
        speed={speed as any}
        style={{ display: 'inline-block' }}
      />
    </div>
  );
};
