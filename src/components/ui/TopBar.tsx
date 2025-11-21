import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const TopBar: React.FC = () => {
  const player = useGameStore(s => s.player);
  const currentScene = useGameStore(s => s.currentScene);
  const toggleDeck = useGameStore(s => s.toggleDeck);
  const map = useGameStore(s => s.map);
  const currentMapNode = useGameStore(s => s.currentMapNode);

  // Helper to find current floor
  const currentFloor = currentMapNode ? currentMapNode.y + 1 : 1;

  if (currentScene === 'MENU') return null;

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 z-50">
       
       {/* Left: Player Info */}
       <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <span className="text-gray-400 text-xs uppercase font-bold">HP</span>
             <div className="flex items-center gap-1">
                <img src="/assets/ui/heart_icon.svg" className="w-4 h-4" />
                <span className="text-red-500 font-bold">{player.hp}/{player.maxHp}</span>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <span className="text-gray-400 text-xs uppercase font-bold">Gold</span>
             <div className="flex items-center gap-1">
                <img src="/assets/ui/gold_icon.svg" className="w-4 h-4" />
                <span className="text-yellow-400 font-bold">{player.gold}</span>
             </div>
          </div>
       </div>

       {/* Center: Floor Info */}
       <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm font-serif">Floor {currentFloor}</span>
       </div>

       {/* Right: Deck & Settings */}
       <div className="flex items-center gap-4">
          <button 
            onClick={() => toggleDeck(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 transition-colors"
          >
              Deck ({player.deck.length})
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
              ⚙️
          </button>
       </div>

    </div>
  );
};

