import React, { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { MapNode } from './MapNode';

export const DungeonMap: React.FC = () => {
  const map = useGameStore(s => s.map);
  const visitNode = useGameStore(s => s.visitNode);

  // Helper to calculate coordinates for lines
  // Must match the positioning logic in MapNode.tsx
  const getCoords = (node: {x: number, y: number}) => {
      const x = node.x * 100; 
      // In MapNode: top: (1 - y/10) * 80 + 10
      // This means y=0 is at 90%, y=9 is at 18% (roughly)
      const y = (1 - node.y / 10) * 80 + 10; 
      return { x, y };
  };

  const paths = useMemo(() => {
      const lines: JSX.Element[] = [];
      map.forEach(layer => {
          layer.forEach(node => {
              node.next.forEach(childId => {
                  // Find child node object
                  // In a real app, we might map ID to Node for O(1) lookup
                  let childNode;
                  for(const l of map) {
                      childNode = l.find(n => n.id === childId);
                      if (childNode) break;
                  }

                  if (childNode) {
                      const start = getCoords(node);
                      const end = getCoords(childNode);

                      lines.push(
                          <line 
                            key={`${node.id}-${childNode.id}`}
                            x1={`${start.x}%`} 
                            y1={`${start.y}%`} 
                            x2={`${end.x}%`} 
                            y2={`${end.y}%`} 
                            stroke="rgba(255,255,255,0.2)" 
                            strokeWidth="2" 
                            strokeDasharray="4 2"
                          />
                      );
                  }
              });
          });
      });
      return lines;
  }, [map]);

  return (
    <div className="w-full h-full bg-slate-900 relative overflow-hidden flex flex-col items-center p-8">
        <h2 className="text-3xl text-slate-400 font-serif mb-4">The Spire</h2>
        
        {/* Map Container */}
        <div className="relative w-full max-w-2xl flex-1 bg-black/20 rounded-xl border border-white/10">
            {/* SVG Layer for Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {paths}
            </svg>

            {/* Nodes */}
            {map.map(layer => (
                layer.map(node => (
                    <MapNode 
                        key={node.id} 
                        node={node} 
                        onClick={visitNode} 
                    />
                ))
            ))}
        </div>
        
        <div className="mt-4 text-gray-500 text-sm">
            Select a node to proceed.
        </div>
    </div>
  );
};

