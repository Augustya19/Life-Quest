import React from 'react';
import { motion } from 'motion/react';
import { Coins, Trophy } from 'lucide-react';
import { getXPForLevel } from '../types';

interface XPBarProps {
  currentXP: number;
  level: number;
  gold: number;
}

export default function XPBar({ currentXP, level, gold }: XPBarProps) {
  const xpNeeded = getXPForLevel(level);
  const progress = (currentXP / xpNeeded) * 100;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b-4 border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <motion.div 
          key={level}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 bg-rpg-purple px-4 py-2 rounded-xl game-shadow glow-purple text-white"
        >
          <Trophy size={20} />
          <div className="flex flex-col">
            <span className="text-[8px] font-game uppercase leading-none mb-1">LVL</span>
            <span className="text-xl font-black leading-none">{level}</span>
          </div>
        </motion.div>
        
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-game uppercase tracking-tight mb-2 text-slate-500">
            <span>Experience</span>
            <span>{currentXP} / {xpNeeded} XP</span>
          </div>
          <div className="h-5 bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              className="h-full bg-gradient-to-r from-rpg-purple to-rpg-blue rounded-sm progress-shimmer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-rpg-gold px-4 py-2 rounded-xl game-shadow glow-gold text-white">
          <Coins size={20} />
          <span className="text-lg font-black">{gold}</span>
        </div>
      </div>
    </div>
  );
}
