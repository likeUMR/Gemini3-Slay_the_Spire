import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { CARDS } from '../../data/cards';
import { Card } from '../battle/Card';

export const RestScene: React.FC = () => {
  const restHeal = useGameStore(s => s.restHeal);
  const upgradeCard = useGameStore(s => s.upgradeCard);
  const player = useGameStore(s => s.player);
  const [showSmith, setShowSmith] = useState(false);
  
  const healAmount = Math.floor(player.maxHp * 0.3);
  const upgradeableCards = player.deck.filter(c => !c.upgraded);

  const handleSmith = (uniqueId: string) => {
      upgradeCard(uniqueId);
      setShowSmith(false);
  };

  if (showSmith) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-40 bg-black/90">
             <h2 className="text-4xl text-blue-400 font-serif mb-8">Select a card to Upgrade</h2>
             <button 
                onClick={() => setShowSmith(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-white"
             >
                 Cancel
             </button>

             <div className="flex flex-wrap justify-center gap-4 overflow-y-auto max-h-[70vh] px-8">
                 {upgradeableCards.map(deckCard => {
                     const cardData = CARDS[deckCard.id];
                     return (
                         <div key={deckCard.uniqueId} className="hover:scale-110 transition-transform">
                             <Card 
                                card={{
                                    ...cardData, 
                                    uniqueId: deckCard.uniqueId, 
                                    originalCost: cardData.cost,
                                    upgraded: false
                                }}
                                onClick={() => handleSmith(deckCard.uniqueId)}
                             />
                         </div>
                     )
                 })}
                 {upgradeableCards.length === 0 && (
                     <div className="text-gray-500 text-xl">No cards to upgrade.</div>
                 )}
             </div>
        </div>
      );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative z-40">
        <div className="absolute inset-0 bg-black/80 z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8 animate-in zoom-in duration-500">
            <h2 className="text-4xl text-amber-200 font-serif mb-4">Rest Site</h2>
            <img src="/assets/ui/heart_icon.svg" className="w-24 h-24 animate-pulse" style={{filter: 'drop-shadow(0 0 10px red)'}}/>
            
            <div className="flex gap-8">
                <button 
                    onClick={restHeal}
                    className="group flex flex-col items-center gap-2 bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-amber-500 hover:bg-gray-800 transition-all w-64"
                >
                    <span className="text-2xl font-bold text-amber-400 group-hover:scale-110 transition-transform">REST</span>
                    <span className="text-green-400 text-lg">Heal {healAmount} HP</span>
                    <span className="text-gray-500 text-sm text-center mt-2">You sleep soundly and recover your strength.</span>
                </button>

                <button 
                    onClick={() => setShowSmith(true)}
                    className="group flex flex-col items-center gap-2 bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all w-64"
                >
                    <span className="text-2xl font-bold text-blue-400 group-hover:scale-110 transition-transform">SMITH</span>
                    <span className="text-blue-300 text-lg">Upgrade Card</span>
                    <span className="text-gray-500 text-sm text-center mt-2">Forge your weapons to become stronger.</span>
                </button>
            </div>
        </div>
    </div>
  );
};
