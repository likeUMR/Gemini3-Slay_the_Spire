import { create } from 'zustand';

export interface DamageNumber {
    id: string;
    value: string | number;
    x: number;
    y: number;
    color: string; // e.g., 'text-red-500'
}

interface VfxState {
    damageNumbers: DamageNumber[];
    screenShake: boolean;
    addDamageNumber: (value: string | number, x: number, y: number, color?: string) => void;
    triggerShake: () => void;
}

export const useVfxStore = create<VfxState>((set) => ({
    damageNumbers: [],
    screenShake: false,

    addDamageNumber: (value, x, y, color = 'text-red-500') => {
        const id = Math.random().toString(36).substring(7);
        set(state => ({
            damageNumbers: [...state.damageNumbers, { id, value, x, y, color }]
        }));
        
        // Auto remove
        setTimeout(() => {
            set(state => ({
                damageNumbers: state.damageNumbers.filter(dn => dn.id !== id)
            }));
        }, 1000);
    },

    triggerShake: () => {
        set({ screenShake: true });
        setTimeout(() => set({ screenShake: false }), 300);
    }
}));

