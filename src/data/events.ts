import { GameEvent } from '../core/events/types';

export const EVENTS: Record<string, GameEvent> = {
    'world_of_goop': {
        id: 'world_of_goop',
        title: 'World of Goop',
        description: 'You fall into a puddle of goop. As you struggle to pull yourself out, you feel something solid at the bottom. The goop is acidic and burns your skin, but the glimmer of gold is tempting...',
        image: '/assets/events/goop.svg', 
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
                description: 'Lose nothing.',
                effects: [
                    { type: 'LEAVE' }
                ]
            }
        ]
    },
    'the_cleric': {
        id: 'the_cleric',
        title: 'The Cleric',
        description: 'You encounter a strange blue humanoid with gold chains. "I am the Cleric," it says. "Do you seek purification? Or perhaps you require healing?"',
        image: '/assets/events/cleric.svg',
        options: [
            {
                text: 'Heal',
                description: 'Heal 25% HP. Cost: 35 Gold.',
                effects: [
                    { type: 'LOSE_GOLD', value: 35 },
                    { type: 'GAIN_HP', value: 20 }
                ]
            },
            {
                text: 'Purify',
                description: 'Remove a card from your deck. Cost: 50 Gold.',
                effects: [
                    { type: 'LOSE_GOLD', value: 50 },
                    { type: 'REMOVE_CARD' }
                ]
            },
            {
                text: 'Leave',
                description: 'Leave the Cleric alone.',
                effects: [
                    { type: 'LEAVE' }
                ]
            }
        ]
    },
    'big_fish': {
        id: 'big_fish',
        title: 'Big Fish',
        description: 'As you walk down a corridor, you see a banana, a donut, and a box floating in the air. A sign reads: "Eat one."',
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
                text: 'Take the Box',
                description: 'Obtain a random Relic. Lose 20 HP. (Coming Soon)', 
                effects: [
                    { type: 'LEAVE' } 
                ]
            }
        ]
    },
    'living_wall': {
        id: 'living_wall',
        title: 'Living Wall',
        description: 'You come across a wall that seems to be alive. Faces shift and change on its surface. It speaks: "Change... I need change..."',
        image: '/assets/events/wall.svg',
        options: [
            {
                text: 'Forget',
                description: 'Remove a card from your deck.',
                effects: [
                    { type: 'REMOVE_CARD' }
                ]
            },
            {
                text: 'Change',
                description: 'Transform a card in your deck. (Coming Soon - acts as Remove for now)',
                effects: [
                    { type: 'REMOVE_CARD' }
                ]
            },
            {
                text: 'Grow',
                description: 'Upgrade a card in your deck. (Coming Soon)',
                effects: [
                    { type: 'LEAVE' }
                ]
            }
        ]
    },
    'scrap_ooze': {
        id: 'scrap_ooze',
        title: 'Scrap Ooze',
        description: 'You stumble upon a large slime creature that is eating a pile of scrap metal. It seems to have swallowed a Relic!',
        image: '/assets/events/ooze.svg',
        options: [
            {
                text: 'Reach Inside',
                description: 'Lose 10 HP. 50% chance to get a Relic.', // Simplified logic
                effects: [
                    { type: 'LOSE_HP', value: 10 },
                    { type: 'GAIN_RELIC' } // Need to implement relic gain logic properly in store if not shop
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
    }
};
