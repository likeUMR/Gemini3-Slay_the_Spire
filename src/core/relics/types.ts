export type RelicTrigger = 'ON_BATTLE_START' | 'ON_BATTLE_END' | 'ON_TURN_START' | 'ON_PLAYER_ATTACK' | 'PASSIVE';

export interface Relic {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji or path
    price: number; // Shop price
    trigger: RelicTrigger;
}

