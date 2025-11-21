import { Card, CardType, CardTarget } from '../core/cards/types';

export const CARDS: Record<string, Card> = {
  'strike': {
    id: 'strike',
    name: 'Strike',
    type: CardType.ATTACK,
    cost: 1,
    description: 'Deal 6 damage.',
    target: CardTarget.ENEMY,
    effects: [
      { type: 'DEAL_DAMAGE', value: 6 }
    ],
    art: '/assets/cards/art/strike.svg',
    
    upgradedDescription: 'Deal 9 damage.',
    upgradedEffects: [
      { type: 'DEAL_DAMAGE', value: 9 }
    ]
  },
  'defend': {
    id: 'defend',
    name: 'Defend',
    type: CardType.SKILL,
    cost: 1,
    description: 'Gain 5 Block.',
    target: CardTarget.SELF,
    effects: [
      { type: 'GAIN_BLOCK', value: 5 }
    ],
    art: '/assets/cards/art/defend.svg',

    upgradedDescription: 'Gain 8 Block.',
    upgradedEffects: [
      { type: 'GAIN_BLOCK', value: 8 }
    ]
  },
  'bash': {
    id: 'bash',
    name: 'Bash',
    type: CardType.ATTACK,
    cost: 2,
    description: 'Deal 8 damage. Apply 2 Vulnerable.',
    target: CardTarget.ENEMY,
    effects: [
      { type: 'DEAL_DAMAGE', value: 8 },
      { type: 'APPLY_VULNERABLE', value: 2 }
    ],
    art: '/assets/cards/art/bash.svg',

    upgradedDescription: 'Deal 10 damage. Apply 3 Vulnerable.',
    upgradedEffects: [
      { type: 'DEAL_DAMAGE', value: 10 },
      { type: 'APPLY_VULNERABLE', value: 3 }
    ]
  },
  'iron_wave': {
    id: 'iron_wave',
    name: 'Iron Wave',
    type: CardType.ATTACK,
    cost: 1,
    description: 'Gain 5 Block. Deal 5 damage.',
    target: CardTarget.ENEMY,
    effects: [
      { type: 'GAIN_BLOCK', value: 5 },
      { type: 'DEAL_DAMAGE', value: 5 }
    ],
    art: '/assets/cards/art/strike.svg',

    upgradedDescription: 'Gain 7 Block. Deal 7 damage.',
    upgradedEffects: [
      { type: 'GAIN_BLOCK', value: 7 },
      { type: 'DEAL_DAMAGE', value: 7 }
    ]
  },
  'clothesline': {
    id: 'clothesline',
    name: 'Clothesline',
    type: CardType.ATTACK,
    cost: 2,
    description: 'Deal 12 damage. Apply 2 Weak.',
    target: CardTarget.ENEMY,
    effects: [
      { type: 'DEAL_DAMAGE', value: 12 },
      { type: 'APPLY_WEAK', value: 2 }
    ],
    art: '/assets/cards/art/bash.svg',

    upgradedDescription: 'Deal 14 damage. Apply 3 Weak.',
    upgradedEffects: [
      { type: 'DEAL_DAMAGE', value: 14 },
      { type: 'APPLY_WEAK', value: 3 }
    ]
  },
  'inflame': {
    id: 'inflame',
    name: 'Inflame',
    type: CardType.POWER,
    cost: 1,
    description: 'Gain 2 Strength.',
    target: CardTarget.SELF,
    effects: [
        { type: 'APPLY_STRENGTH', value: 2 }
    ],
    art: '/assets/cards/art/bash.svg',

    upgradedDescription: 'Gain 3 Strength.',
    upgradedEffects: [
        { type: 'APPLY_STRENGTH', value: 3 }
    ]
  },
  'cleave': {
    id: 'cleave',
    name: 'Cleave',
    type: CardType.ATTACK,
    cost: 1,
    description: 'Deal 8 damage to ALL enemies.',
    target: CardTarget.ALL_ENEMIES,
    effects: [
        { type: 'DEAL_DAMAGE', value: 8 }
    ],
    art: '/assets/cards/art/strike.svg',

    upgradedDescription: 'Deal 11 damage to ALL enemies.',
    upgradedEffects: [
        { type: 'DEAL_DAMAGE', value: 11 }
    ]
  },
  'sword_boomerang': {
    id: 'sword_boomerang',
    name: 'Sword Boomerang',
    type: CardType.ATTACK,
    cost: 1,
    description: 'Deal 3 damage to a random enemy 3 times.',
    target: CardTarget.NONE, // Special handling or NONE
    effects: [
        { type: 'DEAL_DAMAGE', value: 3 }
        // Needs multi-hit logic in store, simplified for now as single hit
    ],
    art: '/assets/cards/art/strike.svg',
    
    upgradedDescription: 'Deal 3 damage to a random enemy 4 times.',
    upgradedEffects: [
        { type: 'DEAL_DAMAGE', value: 3 }
    ]
  },
  'heavy_blade': {
    id: 'heavy_blade',
    name: 'Heavy Blade',
    type: CardType.ATTACK,
    cost: 2,
    description: 'Deal 14 damage. Strength affects Heavy Blade 3 times.',
    target: CardTarget.ENEMY,
    effects: [
        { type: 'DEAL_DAMAGE', value: 14 }
    ],
    art: '/assets/cards/art/bash.svg',

    upgradedDescription: 'Deal 14 damage. Strength affects Heavy Blade 5 times.',
    upgradedEffects: [
        { type: 'DEAL_DAMAGE', value: 14 }
    ]
  }
};
