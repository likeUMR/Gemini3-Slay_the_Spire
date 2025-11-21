import { Enemy, IntentType, EnemyIntent } from './types';

// Helper to calculate intent for a specific enemy type based on turn/rng
export function getNextIntent(enemy: Enemy, turnCount: number): EnemyIntent {
    switch (enemy.templateId) {
        case 'cultist':
            return getCultistIntent(enemy, turnCount);
        case 'jaw_worm':
            return getJawWormIntent(enemy, turnCount);
        default:
            return { type: IntentType.ATTACK, damage: 5 };
    }
}

function getCultistIntent(enemy: Enemy, turnCount: number): EnemyIntent {
    // Turn 1: Incantation (Buff Strength)
    // Turn 2+: Dark Strike (Attack)
    
    // Note: We use turnCount relative to the battle, or enemy internal state?
    // Ideally internal state. But for now let's use a simple logic check.
    
    // If first turn (or hasn't buffed yet), cast Incantation
    const hasRitual = enemy.statusEffects.some(s => s.id === 'ritual');
    if (!hasRitual) {
        return {
            type: IntentType.BUFF,
            statusId: 'ritual',
            statusAmount: 3,
            customDescription: 'Ritual: Gain 3 Strength at end of turn.'
        };
    }

    return {
        type: IntentType.ATTACK,
        damage: 6,
        times: 1
    };
}

function getJawWormIntent(enemy: Enemy, turnCount: number): EnemyIntent {
    // Simple random pattern:
    // 45% Chomp (Attack 11)
    // 30% Thrash (Attack 7 + Block 5)
    // 25% Bellow (Block 6 + Strength 3)
    
    const rand = Math.random();

    if (rand < 0.45) {
        return { type: IntentType.ATTACK, damage: 11, customDescription: 'Chomp' };
    } else if (rand < 0.75) {
        return { type: IntentType.ATTACK, damage: 7, statusId: 'block', statusAmount: 5, customDescription: 'Thrash' };
    } else {
        return { type: IntentType.BUFF, statusId: 'strength', statusAmount: 3, customDescription: 'Bellow' }; // Simplify to Strength for now
    }
}

