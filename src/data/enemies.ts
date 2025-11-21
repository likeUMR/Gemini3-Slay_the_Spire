import { EnemyDefinition } from '../core/entities/types';

export const ENEMIES: Record<string, EnemyDefinition> = {
  'cultist': {
    name: 'Cultist',
    hp: 25, // Was 50
    maxHp: 25,
    block: 0,
    energy: 0,
    maxEnergy: 0,
    statusEffects: [],
    image: '/assets/characters/enemy_cultist.svg'
  },
  'jaw_worm': {
    name: 'Jaw Worm',
    hp: 21, // Was 42
    maxHp: 21,
    block: 0,
    energy: 0,
    maxEnergy: 0,
    statusEffects: [],
    image: '/assets/characters/enemy_jaw_worm.svg'
  }
};
