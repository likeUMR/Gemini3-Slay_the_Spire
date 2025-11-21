import { GameMap, MapNode, NodeStatus, NodeType } from './NodeTypes';

const LAYERS = 10; // Reduced for MVP
const MIN_NODES_PER_LAYER = 3;
const MAX_NODES_PER_LAYER = 5;

// Weights for random node generation
const TYPE_WEIGHTS: Record<string, number> = {
    [NodeType.MONSTER]: 0.45,
    [NodeType.EVENT]: 0.25,
    [NodeType.SHOP]: 0.05,
    [NodeType.REST]: 0.15,
    [NodeType.TREASURE]: 0.05,
    [NodeType.ELITE]: 0.05,
};

function getRandomType(layerIndex: number): NodeType {
    if (layerIndex === 0) return NodeType.MONSTER; // First layer always monsters
    if (layerIndex === LAYERS - 1) return NodeType.BOSS; // Last layer boss
    
    // Simple weighted random
    const rand = Math.random();
    let sum = 0;
    for (const [type, weight] of Object.entries(TYPE_WEIGHTS)) {
        sum += weight;
        if (rand < sum) return type as NodeType;
    }
    return NodeType.MONSTER;
}

export function generateMap(): GameMap {
    const map: GameMap = [];

    // 1. Generate Nodes
    for (let y = 0; y < LAYERS; y++) {
        const layer: MapNode[] = [];
        const nodeCount = y === 0 || y === LAYERS - 1 
            ? (y === LAYERS - 1 ? 1 : 3) // Boss layer has 1 node, Start layer has 3
            : Math.floor(Math.random() * (MAX_NODES_PER_LAYER - MIN_NODES_PER_LAYER + 1)) + MIN_NODES_PER_LAYER;

        const segmentWidth = 1 / nodeCount;

        for (let i = 0; i < nodeCount; i++) {
            layer.push({
                id: `node-${y}-${i}`,
                x: segmentWidth * i + segmentWidth / 2, // Center in segment
                y,
                type: getRandomType(y),
                next: [],
                parents: [],
                status: y === 0 ? NodeStatus.AVAILABLE : NodeStatus.LOCKED
            });
        }
        map.push(layer);
    }

    // 2. Generate Connections (Paths)
    // Forward pass: ensure every node has at least one child (except last layer)
    // We'll use a simple algorithm: each node connects to 1-2 nodes in next layer that are "close" in x
    
    for (let y = 0; y < LAYERS - 1; y++) {
        const currentLayer = map[y];
        const nextLayer = map[y + 1];

        currentLayer.forEach(node => {
            // Find potential children: nodes in next layer with similar X
            // Since x is normalized 0..1, we can look for closest ones
            // Or simpler: connect to indices roughly proportional
            
            // Simple strategy: Connect to the closest node in next layer, and maybe one neighbor
            const sortedNext = [...nextLayer].sort((a, b) => Math.abs(a.x - node.x) - Math.abs(b.x - node.x));
            
            // Connect to closest
            connect(node, sortedNext[0]);
            
            // 50% chance to connect to 2nd closest if it exists
            if (sortedNext.length > 1 && Math.random() > 0.5) {
                connect(node, sortedNext[1]);
            }
        });

        // Safety check: Ensure every node in next layer has at least one parent
        // If not, force connect from closest current layer node
        nextLayer.forEach(nextNode => {
             if (nextNode.parents.length === 0) {
                 const closestParent = [...currentLayer].sort((a, b) => Math.abs(a.x - nextNode.x) - Math.abs(b.x - nextNode.x))[0];
                 connect(closestParent, nextNode);
             }
        });
    }

    return map;
}

function connect(parent: MapNode, child: MapNode) {
    if (!parent.next.includes(child.id)) {
        parent.next.push(child.id);
    }
    if (!child.parents.includes(parent.id)) {
        child.parents.push(parent.id);
    }
}

