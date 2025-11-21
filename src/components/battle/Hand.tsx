import React from 'react';
import { PlayableCard } from '../../core/cards/types';
import { Card } from './Card';

interface HandProps {
  cards: PlayableCard[];
  onPlayCard: (card: PlayableCard) => void;
  playable: boolean;
}

export const Hand: React.FC<HandProps> = ({ cards, onPlayCard, playable }) => {
  return (
    <div className="flex justify-center items-end h-56 pb-4 px-8 w-full max-w-5xl mx-auto perspective-1000 pointer-events-none">
      {cards.map((card, index) => {
        // Calculate rotation and offset for "fanning" effect
        const center = (cards.length - 1) / 2;
        const offset = index - center;
        const rotation = offset * 5; // 5 degrees per card
        const translateY = Math.abs(offset) * 5; // Arch effect

        return (
        <div 
            key={card.uniqueId} 
            className="transition-all duration-300 ease-out origin-bottom pointer-events-auto"
            style={{
                marginLeft: index === 0 ? 0 : '-40px', // Overlap
                transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                zIndex: index
            }}
        >
             <div>
                <Card card={card} onClick={() => onPlayCard(card)} disabled={!playable} />
             </div>
        </div>
      )})}
    </div>
  );
};
