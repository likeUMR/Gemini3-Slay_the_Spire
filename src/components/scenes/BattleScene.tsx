import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PlayerUnit } from '../battle/PlayerUnit';
import { EnemyUnit } from '../battle/EnemyUnit';
import { Hand } from '../battle/Hand';

export const BattleScene: React.FC = () => {
  const { player, enemies, hand, gameStatus, playCard, endTurn, completeBattle, startGame } = useGameStore();
  const currentTurn = useGameStore(s => s.currentTurn);
  const drawPileCount = useGameStore(s => s.drawPile.length);
  const discardPileCount = useGameStore(s => s.discardPile.length);

  // Enter key shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameStatus === 'PLAYER_TURN') {
        endTurn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, endTurn]);

  if (gameStatus === 'WON') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-white z-50">
            <h1 className="text-6xl text-yellow-400 font-bold mb-8">VICTORY</h1>
            <button onClick={() => completeBattle()} className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500">Continue</button>
        </div>
      );
  }

  if (gameStatus === 'LOST') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-white z-50">
            <h1 className="text-6xl text-red-600 font-bold mb-8">DEFEAT</h1>
            <button onClick={() => startGame()} className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500">Return to Menu</button>
        </div>
      );
  }

  return (
    <div className="w-full h-full relative flex flex-col justify-between py-4 overflow-hidden">
       {/* Top Bar (Info) */}
       <div className="absolute top-0 w-full flex justify-between px-6 py-2 text-white/80 font-mono text-sm z-20 bg-gradient-to-b from-black/50 to-transparent">
           <div>Turn {currentTurn}</div>
           <div className="flex gap-4">
               <span>Draw Pile: {drawPileCount}</span> 
               <span>Discard: {discardPileCount}</span>
           </div>
       </div>

       {/* Battle Area */}
       <div className="flex-1 flex items-center justify-center gap-32 px-10 mt-10">
           <PlayerUnit player={player} />
           
           <div className="flex gap-8">
              {enemies.map(enemy => (
                  <EnemyUnit key={enemy.id} enemy={enemy} />
              ))}
           </div>
       </div>

       {/* Controls */}
       <div className="absolute bottom-48 right-10 z-40">
           <button 
             onClick={endTurn}
             disabled={gameStatus !== 'PLAYER_TURN'}
             className="group relative"
           >
               <img src="/assets/ui/end_turn_btn.svg" className="w-48 cursor-pointer group-hover:brightness-110 group-active:scale-95 transition-all" />
               <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white text-lg drop-shadow-md pointer-events-none">
                   END TURN
               </span>
           </button>
       </div>
        
        {/* Energy Orb */}
        <div className="absolute bottom-8 left-8 z-20">
             <div className="relative w-24 h-24 flex items-center justify-center">
                 <img src="/assets/ui/energy_orb.svg" className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                 <span className="relative z-10 text-4xl font-bold text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
                    {player.energy}/{player.maxEnergy}
                 </span>
             </div>
        </div>

       {/* Hand */}
       <div className="relative z-30 mb-4">
          <Hand 
            cards={hand} 
            onPlayCard={(c) => playCard(c)} 
            playable={gameStatus === 'PLAYER_TURN'} 
          />
       </div>
    </div>
  );
};
