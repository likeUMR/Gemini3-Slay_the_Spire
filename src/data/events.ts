import { GameEvent } from '../core/events/types';

export const EVENTS: Record<string, GameEvent> = {
    'world_of_goop': {
        id: 'world_of_goop',
        title: 'World of Goop',
        description: 'You fall into a puddle of goop. It\'s disgusting, but you see some gold coins at the bottom.',
        image: '/assets/events/goop.svg', // Placeholder
        options: [
            {
                text: 'Gather Gold',
                description: 'Gain 75 Gold. Lose 11 HP.',
                effects: [
                    { type: 'GAIN_GOLD', value: 75 },
                    { type: 'LOSE_HP', value: 11 }
                ]
            },
            {
                text: 'Leave it',
                description: '',
                effects: [
                    { type: 'LEAVE' }
                ]
            }
        ]
    },
    'the_cleric': {
        id: 'the_cleric',
        title: 'The Cleric',
        description: 'A strange blue humanoid with gold chains asks if you seek purification.',
        image: '/assets/events/cleric.svg', // Placeholder
        options: [
            {
                text: 'Heal',
                description: 'Heal 25% HP. Cost: 35 Gold.',
                effects: [
                    { type: 'LOSE_GOLD', value: 35 },
                    { type: 'GAIN_HP', value: 20 } // Simplified fixed value or handled dynamically
                ]
            },
            {
                text: 'Purify',
                description: 'Remove a card from your deck. Cost: 50 Gold.',
                effects: [
                    { type: 'LOSE_GOLD', value: 50 },
                    { type: 'REMOVE_CARD' } // Triggers removal UI
                ]
            },
            {
                text: 'Leave',
                description: '',
                effects: [
                    { type: 'LEAVE' }
                ]
            }
        ]
    },
    'big_fish': {
        id: 'big_fish',
        title: 'Big Fish',
        description: 'You find a banana, a donut, and a box. Which do you eat?',
        image: '/assets/events/fish.svg',
        options: [
            {
                text: 'Eat Banana',
                description: 'Heal 30 HP.',
                effects: [
                    { type: 'GAIN_HP', value: 30 }
                ]
            },
            {
                text: 'Eat Donut',
                description: 'Max HP +5.',
                effects: [
                    { type: 'GAIN_MAX_HP', value: 5 }
                ]
            },
            {
                text: 'Get Relic',
                description: 'Obtain a random Relic. Lose 20 HP. (Coming Soon)', // Placeholder
                effects: [
                    { type: 'LEAVE' } // Simplified for now
                ]
            }
        ]
    }
};

