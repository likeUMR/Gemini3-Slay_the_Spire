export enum NodeType {
  MONSTER = 'MONSTER',
  ELITE = 'ELITE',
  REST = 'REST',
  SHOP = 'SHOP',
  TREASURE = 'TREASURE',
  EVENT = 'EVENT',
  BOSS = 'BOSS'
}

export enum NodeStatus {
  LOCKED = 'LOCKED',       // Cannot be visited
  AVAILABLE = 'AVAILABLE', // Can be visited next
  COMPLETED = 'COMPLETED', // Already visited
  CURRENT = 'CURRENT'      // Currently here
}

export interface MapNode {
  id: string;
  x: number; // 0..1 position for rendering
  y: number; // Layer index
  type: NodeType;
  next: string[]; // Ids of connected nodes in next layer
  parents: string[]; // Ids of connected nodes in prev layer
  status: NodeStatus;
}

export type GameMap = MapNode[][];

