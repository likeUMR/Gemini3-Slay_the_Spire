import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { RELICS } from '../../data/relics';
import { CARDS } from '../../data/cards';
import { Card } from '../battle/Card';

export const ShopScene: React.FC = () => {
  const { player, shopCards, shopRelics, purgeCost, addRelic, buyCard, removeCard, skipReward } = useGameStore();

  return (
    <div className="w-full h-full flex flex-col items-center bg-slate-900 relative z-40 overflow-y-auto py-12 px-4">
         <div className="flex items-center gap-4 mb-8">
             <h2 className="text-4xl text-yellow-400 font-serif">The Merchant</h2>
             <div className="text-2xl text-yellow-200 bg-black/50 px-4 py-2 rounded flex items-center gap-2">
                 <img src="/assets/ui/gold_icon.svg" className="w-6 h-6"/> {player.gold}
             </div>
         </div>
         
         {/* Cards Section */}
         <h3 className="text-2xl text-gray-400 mb-4 w-full max-w-5xl border-b border-gray-700 pb-2">Cards</h3>
         <div className="flex flex-wrap justify-center gap-6 mb-12 w-full max-w-5xl">
             {shopCards.map(card => {
                 const price = Math.floor(card.cost * 50 + 50);
                 const canAfford = player.gold >= price;
                 
                 return (
                     <div key={card.id} className="flex flex-col items-center group">
                         <div className="relative hover:scale-110 transition-transform duration-200">
                             <Card card={{...card, uniqueId: 'shop', originalCost: card.cost}} onClick={() => canAfford && buyCard(card)} disabled={!canAfford} />
                         </div>
                         <div className={`mt-2 font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                             {price} G
                         </div>
                     </div>
                 )
             })}
             {shopCards.length === 0 && <div className="text-gray-500">Sold Out</div>}
         </div>

         {/* Relics Section */}
         <h3 className="text-2xl text-gray-400 mb-4 w-full max-w-5xl border-b border-gray-700 pb-2">Relics</h3>
         <div className="flex gap-8 mb-12">
             {shopRelics.map(id => {
                 const relic = RELICS[id];
                 const canAfford = player.gold >= relic.price;

                 return (
                     <div key={id} className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg border border-yellow-600 w-48 relative group cursor-pointer"
                          onClick={() => canAfford && addRelic(id)}
                     >
                         <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{relic.icon}</div>
                         <div className="text-lg font-bold text-white">{relic.name}</div>
                         <div className="text-xs text-gray-400 text-center h-10">{relic.description}</div>
                         
                         <div className={`font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                             {relic.price} G
                         </div>
                     </div>
                 )
             })}
             {shopRelics.length === 0 && <div className="text-gray-500">Sold Out</div>}
         </div>

         {/* Services Section */}
         <h3 className="text-2xl text-gray-400 mb-4 w-full max-w-5xl border-b border-gray-700 pb-2">Services</h3>
         <div className="flex gap-8 mb-12">
             <div className="flex flex-col items-center gap-2 p-6 bg-gray-800 rounded-lg border border-red-500 w-64 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => {
                      // Logic to open deck for removal... for MVP, just remove random strike or show alert
                      // Ideally: Open a modal similar to Smith but for removal
                      // For now: Let's just allow removing a random Strike if affordable as a placeholder, 
                      // or assume we can implement a 'Remove Mode' later.
                      // Let's implement a simple prompt for MVP: Remove a Strike?
                      const strike = player.deck.find(c => c.id === 'strike');
                      if (strike && player.gold >= purgeCost) {
                          removeCard(strike.uniqueId);
                      }
                  }}
             >
                 <div className="text-4xl mb-2">🔥</div>
                 <div className="text-xl font-bold text-red-400">Card Removal</div>
                 <div className="text-sm text-gray-400 text-center">Remove a card from your deck.</div>
                 <div className={`mt-2 font-bold ${player.gold >= purgeCost ? 'text-yellow-400' : 'text-red-400'}`}>
                     {purgeCost} G
                 </div>
                 <div className="text-xs text-gray-500">(Currently removes a random Strike)</div>
             </div>
         </div>

         <button 
            onClick={skipReward}
            className="px-8 py-3 border border-gray-500 text-gray-400 hover:text-white hover:border-white rounded text-xl"
         >
             Leave Shop
         </button>
    </div>
  );
};
