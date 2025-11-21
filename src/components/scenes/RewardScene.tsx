import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Card } from '../battle/Card';

export const RewardScene: React.FC = () => {
  const rewards = useGameStore(s => s.rewardCards);
  const chooseReward = useGameStore(s => s.chooseReward);
  const skipReward = useGameStore(s => s.skipReward);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 z-50 relative">
      <h2 className="text-4xl text-amber-400 font-bold mb-8 tracking-wider">Choose a Card</h2>
      
      <div className="flex gap-8 mb-12">
        {rewards.map((card, index) => (
           <div key={index} className="hover:scale-110 transition-transform duration-300">
              <Card 
                card={card} 
                onClick={() => chooseReward(card)} 
              />
           </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 items-center">
          <button 
            onClick={skipReward}
            className="px-6 py-2 border border-gray-500 text-gray-400 rounded hover:bg-gray-800 hover:text-white transition-colors"
          >
              Skip Reward
          </button>
          <p className="text-gray-500 text-sm">The card will be added to your deck.</p>
      </div>
    </div>
  );
};

