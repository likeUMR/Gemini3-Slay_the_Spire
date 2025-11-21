import React from 'react';
import { MapNode as MapNodeType, NodeStatus, NodeType } from '../../core/map/NodeTypes';
import { clsx } from 'clsx';

interface MapNodeProps {
  node: MapNodeType;
  onClick: (id: string) => void;
}

export const MapNode: React.FC<MapNodeProps> = ({ node, onClick }) => {
  const isLocked = node.status === NodeStatus.LOCKED;
  const isAvailable = node.status === NodeStatus.AVAILABLE;
  const isCompleted = node.status === NodeStatus.COMPLETED;
  const isCurrent = node.status === NodeStatus.CURRENT;

  const getIcon = () => {
    switch (node.type) {
      case NodeType.MONSTER: return '⚔️';
      case NodeType.ELITE: return '👹';
      case NodeType.BOSS: return '👿';
      case NodeType.REST: return '🔥';
      case NodeType.SHOP: return '💰';
      case NodeType.TREASURE: return '🎁';
      case NodeType.EVENT: return '❓';
      default: return '⭕';
    }
  };

  return (
    <div
      onClick={() => !isLocked && !isCompleted && !isCurrent ? onClick(node.id) : undefined}
      className={clsx(
        "absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center rounded-full text-2xl transition-all border-2 z-10 select-none",
        isLocked && "bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed",
        isAvailable && "bg-slate-700 border-white hover:bg-slate-600 hover:scale-125 cursor-pointer animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]",
        isCompleted && "bg-gray-900 border-gray-700 text-gray-500",
        isCurrent && "bg-amber-600 border-amber-400 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
      )}
      style={{
        left: `${node.x * 100}%`,
        top: `${(1 - node.y / 10) * 80 + 10}%` // Flip Y so start is at bottom. 10 layers assumed broadly, with padding
        // Adjust mapping: node.y=0 -> Bottom, node.y=Max -> Top
      }}
    >
       {getIcon()}
       {isCompleted && (
           <div className="absolute text-red-500 font-bold text-4xl pointer-events-none opacity-80">X</div>
       )}
    </div>
  );
};

