import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CARDS } from '../../data/cards';
import { Card } from '../battle/Card';

export const DeckView: React.FC = () => {
  const isDeckOpen = useGameStore(s => s.isDeckOpen);
  const toggleDeck = useGameStore(s => s.toggleDeck);
  const deckIds = useGameStore(s => s.player.deck);

  if (!isDeckOpen) return null;

  // Group cards by sorting (Attack -> Skill -> Power) could be nice, but simpler for now
  const deckCards = deckIds.map(id => CARDS[id]).sort((a, b) => {
      if (a.type === b.type) return a.cost - b.cost;
      return a.type.localeCompare(b.type);
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full h-full max-w-6xl flex flex-col p-8 relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <h2 className="text-3xl text-gray-200 font-bold">Master Deck</h2>
                <button 
                    onClick={() => toggleDeck(false)}
                    className="text-gray-400 hover:text-white text-xl font-bold px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
                >
                    Close
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
                    {deckCards.map((card, i) => (
                        <div key={i} className="hover:scale-105 transition-transform">
                             {/* We need to construct a PlayableCard-like object for the Card component, or update Card component to accept pure Card data. 
                                The Card component expects PlayableCard (with uniqueId). Let's mock it.
                             */}
                             <Card 
                                card={{...card, uniqueId: `preview-${i}`, originalCost: card.cost}} 
                                onClick={() => {}} 
                                disabled 
                             />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </div>
  );
};

