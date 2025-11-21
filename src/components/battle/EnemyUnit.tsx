import React from 'react';
import { Enemy, IntentType } from '../../core/entities/types';
import { clsx } from 'clsx';

interface EnemyUnitProps {
  enemy: Enemy;
  isSelected?: boolean;
  onClick?: () => void;
}

export const EnemyUnit: React.FC<EnemyUnitProps> = ({ enemy, isSelected, onClick }) => {
  const getIntentIcon = () => {
      switch (enemy.intent.type) {
          case IntentType.ATTACK: return '/assets/ui/intent_attack.svg';
          case IntentType.DEFEND: return '/assets/ui/intent_defend.svg';
          case IntentType.BUFF: return '/assets/ui/intent_buff.svg';
          case IntentType.DEBUFF: return '/assets/ui/intent_debuff.svg';
          default: return '/assets/ui/intent_attack.svg';
      }
  };

  return (
    <div 
        className={clsx("flex flex-col items-center transition-all", isSelected && "brightness-125 scale-105")}
        onClick={onClick}
    >
       <div className="relative cursor-pointer">
         {/* Intent */}
         <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
            <img src={getIntentIcon()} className="w-8 h-8" alt="intent" />
            {enemy.intent.damage && (
                <span className="text-white font-bold text-lg drop-shadow-md -mt-1">{enemy.intent.damage}</span>
            )}
         </div>

         <img src={enemy.image} className="w-40 h-40" alt={enemy.name} />

         {/* Block Overlay */}
         {enemy.block > 0 && (
             <div className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-2 border-white z-10">
                 <span className="text-white font-bold text-sm">{enemy.block}</span>
             </div>
         )}

        {/* Status Effects */}
        <div className="absolute bottom-0 w-full flex justify-center gap-1 translate-y-full pt-1">
            {enemy.statusEffects.map((effect, i) => (
                <div key={i} className="w-5 h-5 bg-gray-800 rounded-full border border-gray-500 flex items-center justify-center relative group">
                    <span className="text-[10px] text-white font-bold">{effect.amount}</span>
                    {/* Tooltip */}
                    <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs p-1 rounded whitespace-nowrap z-50">
                        {effect.name}
                    </div>
                </div>
            ))}
        </div>
       </div>

       <div className="flex items-center gap-2 mt-4 bg-black/50 px-3 py-1 rounded-full border border-gray-600">
         <img src="/assets/ui/heart_icon.svg" className="w-4 h-4" />
         <span className="text-red-400 font-bold text-lg">
             {enemy.hp} <span className="text-gray-400 text-sm">/ {enemy.maxHp}</span>
         </span>
       </div>
    </div>
  );
};


