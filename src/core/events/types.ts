export type EventEffectType = 
  | 'GAIN_GOLD' | 'LOSE_GOLD'
  | 'GAIN_HP' | 'LOSE_HP' | 'GAIN_MAX_HP' | 'LOSE_MAX_HP'
  | 'GAIN_CARD' | 'REMOVE_CARD' | 'UPGRADE_CARD' | 'TRANSFORM_CARD'
  | 'GAIN_RELIC' | 'LOSE_RELIC'
  | 'LEAVE';

export interface EventEffect {
    type: EventEffectType;
    value?: number; // Amount for gold/hp
    targetId?: string; // Card ID or Relic ID
}

export interface EventOption {
    text: string;
    description?: string; // Hover text or subtext (e.g. "Lose 6 HP")
    effects: EventEffect[];
    condition?: (gameState: any) => boolean; // Advanced: Check if player has gold/card
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    image: string;
    options: EventOption[];
}

