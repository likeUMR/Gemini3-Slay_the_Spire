import React from 'react';
import { useVfxStore } from '../../store/useVfxStore';
import { AnimatePresence, motion } from 'framer-motion';

export const VfxLayer: React.FC = () => {
    const damageNumbers = useVfxStore(s => s.damageNumbers);

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {damageNumbers.map(dn => (
                    <motion.div
                        key={dn.id}
                        initial={{ opacity: 0, y: dn.y, x: dn.x, scale: 0.5 }}
                        animate={{ opacity: 1, y: dn.y - 100, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        className={`absolute font-bold text-4xl drop-shadow-md ${dn.color}`}
                        style={{ 
                            left: 0, 
                            top: 0,
                            textShadow: '2px 2px 0 #000'
                         }} 
                    >
                        {dn.value}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

