import React from 'react';
import { Player } from '../../core/entities/types';

interface PlayerUnitProps {
  player: Player;
}

export const PlayerUnit: React.FC<PlayerUnitProps> = ({ player }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Status Effects Row (Above Head) */}
        <div className="absolute -top-8 w-full flex justify-center gap-1">
             {/* Placeholder for Buffs */}
        </div>

        <img src="/assets/characters/player_idle.svg" className="w-40 h-40" alt="Player" />
        
        {/* Block Overlay */}
        {player.block > 0 && (
             <div className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-2 border-white z-10 animate-pulse">
                 <img src="/assets/ui/block_icon.svg" className="w-5 h-5 absolute opacity-50" />
                 <span className="text-white font-bold text-sm relative z-10">{player.block}</span>
             </div>
        )}
      </div>

      {/* HP Bar */}
      <div className="flex items-center gap-2 mt-2 bg-black/50 px-3 py-1 rounded-full border border-gray-600">
        <img src="/assets/ui/heart_icon.svg" className="w-4 h-4" />
        <span className="text-red-400 font-bold text-lg">
            {player.hp} <span className="text-gray-400 text-sm">/ {player.maxHp}</span>
        </span>
      </div>
      
      {/* Energy */}
       <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-400 font-bold text-sm">Energy: {player.energy}/{player.maxEnergy}</span>
       </div>
    </div>
  );
};


