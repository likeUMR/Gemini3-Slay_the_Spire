import { Relic } from '../core/relics/types';

export const RELICS: Record<string, Relic> = {
    'burning_blood': {
        id: 'burning_blood',
        name: 'Burning Blood',
        description: 'At the end of combat, heal 6 HP.',
        icon: '🩸',
        price: 999, 
        trigger: 'ON_BATTLE_END'
    },
    'vajra': {
        id: 'vajra',
        name: 'Vajra',
        description: 'At the start of each combat, gain 1 Strength.',
        icon: '💎',
        price: 150,
        trigger: 'ON_BATTLE_START'
    },
    'anchor': {
        id: 'anchor',
        name: 'Anchor',
        description: 'Start each combat with 10 Block.',
        icon: '⚓',
        price: 150,
        trigger: 'ON_BATTLE_START'
    },
    'bag_of_marbles': {
        id: 'bag_of_marbles',
        name: 'Bag of Marbles',
        description: 'At the start of each combat, apply 1 Vulnerable to ALL enemies.',
        icon: '🎱',
        price: 150,
        trigger: 'ON_BATTLE_START'
    },
    'pen_nib': {
        id: 'pen_nib',
        name: 'Pen Nib',
        description: 'Every 10th Attack you play deals double damage.',
        icon: '✒️',
        price: 250,
        trigger: 'PASSIVE'
    },
    'happy_flower': {
        id: 'happy_flower',
        name: 'Happy Flower',
        description: 'Every 3 turns, gain 1 Energy.',
        icon: '🌻',
        price: 150,
        trigger: 'ON_TURN_START'
    }
};
