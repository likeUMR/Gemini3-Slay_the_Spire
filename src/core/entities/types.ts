import { Relic } from '../core/relics/types';
import { DeckCard } from '../cards/types';

export interface StatusEffect {
    id: string;
    name: string;
    amount: number;
    icon?: string;
    description: string;
}

export interface GameEntity {
    hp: number;
    maxHp: number;
    block: number;
    energy: number;
    maxEnergy: number;
    statusEffects: StatusEffect[];
}

export interface Player extends GameEntity {
    gold: number;
    deck: DeckCard[]; // Changed from string[]
    relics: Relic[];
}

export enum IntentType {
    ATTACK = 'ATTACK',
    DEFEND = 'DEFEND',
    BUFF = 'BUFF',
    DEBUFF = 'DEBUFF',
    SLEEP = 'SLEEP',
    UNKNOWN = 'UNKNOWN'
}

export interface EnemyIntent {
    type: IntentType;
    damage?: number;
    times?: number; // For multi-attacks
    statusId?: string; 
    statusAmount?: number;
    customDescription?: string;
}

// AI Definition Types
export type MoveLogic = (enemy: Enemy, turn: number) => EnemyIntent;

export interface EnemyDefinition extends Omit<Enemy, 'id' | 'intent'> {
    // Static definition doesn't have current intent
}

export interface Enemy extends GameEntity {
    id: string;
    templateId: string; // Reference to which enemy this is (e.g. 'cultist')
    name: string;
    intent: EnemyIntent;
    image: string;
    currentMoveIndex?: number; // For sequential moves
    moveHistory?: string[]; // Track past moves if needed for probability
}
