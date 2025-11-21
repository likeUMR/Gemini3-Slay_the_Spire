import React from 'react';
import { Card as CardTypeInterface, CardType } from '../../core/cards/types';
import { clsx } from 'clsx';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface CardProps {
  card: CardTypeInterface;
  onClick: () => void;
  disabled?: boolean;
  onDragEnd?: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled, onDragEnd }) => {
  const isAttack = card.type === CardType.ATTACK;
  const isSkill = card.type === CardType.SKILL;
  const isPower = card.type === CardType.POWER;

  const frameSrc = isAttack ? '/assets/cards/frames/frame_attack.svg' :
                   isSkill ? '/assets/cards/frames/frame_skill.svg' :
                   '/assets/cards/frames/frame_power.svg';

  const bgClass = isAttack ? 'bg-red-500' : isSkill ? 'bg-blue-500' : 'bg-green-500';

  // Framer Motion
  const y = useMotionValue(0);
  const scale = useTransform(y, [0, -100], [1, 1.1]); // Slight scale up when dragged
  const opacity = useTransform(y, [0, -200], [1, 0.5]); // Fade out if dragged too far (visual cue)

  const handleDragEnd = (_: any, info: any) => {
      if (disabled) return;
      if (info.offset.y < -100) { // Threshold to trigger play
          onClick(); // Use onClick as the "Play" trigger
          if (onDragEnd) onDragEnd();
      }
  };

  // If disabled, no drag. If enabled, drag.
  return (
    <motion.div 
      drag={!disabled}
      dragConstraints={{ top: -300, bottom: 0, left: 0, right: 0 }}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
      onClick={!disabled ? onClick : undefined}
      style={{ y, scale, opacity }}
      whileHover={!disabled ? { y: -20, scale: 1.1, zIndex: 100 } : {}}
      className={clsx(
        "relative w-32 h-48 cursor-grab active:cursor-grabbing select-none",
        disabled && "opacity-50 grayscale cursor-not-allowed"
      )}
    >
      {/* Frame */}
      <img src={frameSrc} className="absolute inset-0 w-full h-full z-10 pointer-events-none" alt="frame" />
      
      {/* Art */}
      <div className="absolute top-2 left-2 w-[calc(100%-16px)] h-[50%] overflow-hidden bg-gray-800 z-0">
          <img src={card.art} className="w-full h-full object-cover" alt={card.name} />
      </div>

      {/* Cost */}
      <div className={clsx(
        "absolute top-1 left-1 font-bold text-black rounded-full w-6 h-6 flex items-center justify-center text-xs border border-white z-20",
        bgClass
      )}>
        {card.cost}
      </div>

      {/* Name */}
      <div className="absolute top-[52%] w-full text-center font-bold text-xs text-white drop-shadow-md z-20">
        {card.name}
      </div>

      {/* Description */}
      <div className="absolute bottom-4 left-2 right-2 text-center text-[10px] leading-3 text-white z-20 h-12 flex items-center justify-center">
        {card.description}
      </div>
    </motion.div>
  );
};
