import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const MainMenu: React.FC = () => {
  const startGame = useGameStore(s => s.startGame);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative z-50">
        <h1 className="text-6xl font-bold text-amber-400 drop-shadow-lg mb-8">AI Slay the Spire</h1>
        
        <button 
            onClick={startGame}
            className="px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white text-xl font-bold rounded shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
            Start Run
        </button>
        
        <p className="mt-4 text-gray-400">
            Early Access Build - Map & Battle System Active
        </p>
    </div>
  );
};

