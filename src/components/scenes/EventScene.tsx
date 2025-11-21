import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const EventScene: React.FC = () => {
  const { currentEvent, resolveEventOption, player } = useGameStore();

  if (!currentEvent) return <div>Loading Event...</div>;

  return (
    <div className="w-full h-full flex items-center justify-center bg-black/90 relative z-40 p-8">
         <div className="max-w-5xl w-full bg-gray-900 border border-gray-600 rounded-xl overflow-hidden flex shadow-2xl">
             {/* Image */}
             <div className="w-1/3 bg-gray-800 relative">
                 <img src={currentEvent.image} className="w-full h-full object-cover opacity-50" alt={currentEvent.title} 
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x600/333/999?text=Event'; }} 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-6xl opacity-20">?</span>
                 </div>
             </div>

             {/* Content */}
             <div className="w-2/3 p-8 flex flex-col">
                 <h2 className="text-4xl text-gray-200 font-serif mb-4">{currentEvent.title}</h2>
                 <div className="text-lg text-gray-400 mb-8 leading-relaxed flex-1">
                     {currentEvent.description}
                 </div>

                 <div className="flex flex-col gap-4">
                     {currentEvent.options.map((option, idx) => {
                         // Can check conditions here
                         // For MVP, simple gold check visual logic
                         const isDisabled = false; // Add custom condition logic if needed

                         return (
                             <button 
                                key={idx}
                                onClick={() => resolveEventOption(option)}
                                disabled={isDisabled}
                                className="text-left p-4 bg-black/40 border border-gray-600 hover:bg-gray-800 hover:border-gray-400 rounded transition-all group"
                             >
                                 <div className="text-xl font-bold text-gray-200 group-hover:text-white">
                                     {option.text} 
                                     <span className="ml-2 text-gray-500 text-sm font-normal">{option.description}</span>
                                 </div>
                             </button>
                         );
                     })}
                 </div>
             </div>
         </div>
    </div>
  );
};
