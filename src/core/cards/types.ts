export enum CardType {
  ATTACK = 'ATTACK',
  SKILL = 'SKILL',
  POWER = 'POWER',
}

export enum CardTarget {
  ENEMY = 'ENEMY',
  ALL_ENEMIES = 'ALL_ENEMIES',
  SELF = 'SELF',
  NONE = 'NONE', // For global effects or random targets
}

export type EffectType = 'DEAL_DAMAGE' | 'GAIN_BLOCK' | 'APPLY_VULNERABLE' | 'APPLY_WEAK' | 'APPLY_STRENGTH' | 'DRAW_CARD';

export interface CardEffect {
  type: EffectType; 
  value?: number;
  duration?: number; // for buffs/debuffs
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  description: string;
  target: CardTarget;
  effects: CardEffect[];
  art?: string; // image path
  
  // Upgrade Logic
  upgraded?: boolean;
  upgradedEffects?: CardEffect[]; // If present, these replace effects when upgraded
  upgradedCost?: number;
  upgradedDescription?: string;
}

// Runtime instance of a card (e.g. in hand)
export interface PlayableCard extends Card {
  uniqueId: string; // unique per instance
  originalCost: number;
}

// Data structure for card in Master Deck
export interface DeckCard {
    id: string;
    uniqueId: string;
    upgraded: boolean;
}
