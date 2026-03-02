import React from 'react';
import { motion } from 'motion/react';
import { Sword, Target, Timer, Coins, Trash2, Edit2 } from 'lucide-react';
import { Boss } from '../types';

interface BossBattleCardProps {
  key?: string;
  boss: Boss;
  onAttack: (id: string, damage: number) => void;
  onDelete: (id: string) => void;
  onEdit: (boss: Boss) => void;
}

export default function BossBattleCard({ boss, onAttack, onDelete, onEdit }: BossBattleCardProps) {
  const hpPercentage = (boss.currentHp / boss.maxHp) * 100;
  const isDefeated = boss.currentHp <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden bg-white rounded-3xl p-8 border-4 group ${isDefeated ? 'border-rpg-green' : 'border-rpg-red'} game-shadow glow-purple`}
    >
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={() => onEdit(boss)}
          className="p-2 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-rpg-blue hover:border-rpg-blue transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(boss.id)}
          className="p-2 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-rpg-red hover:border-rpg-red transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <Sword size={160} />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-rpg-red text-white text-[8px] font-game uppercase rounded-lg">Boss Encounter</span>
              <div className="flex items-center gap-1 text-slate-400 text-[10px] font-game uppercase">
                <Timer size={12} />
                <span>{boss.deadline}</span>
              </div>
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-800 italic">{boss.title}</h3>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border-2 border-slate-100">
            <div className="text-center">
              <span className="block text-[8px] font-game text-slate-400 uppercase mb-1">Reward</span>
              <div className="flex items-center gap-2">
                <span className="text-rpg-purple font-black">+{boss.rewardXp} XP</span>
                <div className="flex items-center gap-1 text-rpg-gold font-black">
                  <Coins size={14} />
                  <span>+{Math.floor(boss.rewardXp / 2)} G</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-game uppercase text-slate-600">
            <span className={isDefeated ? 'text-rpg-green' : 'text-rpg-red'}>
              {isDefeated ? 'Victory!' : 'Enemy HP'}
            </span>
            <span>{boss.currentHp} / {boss.maxHp}</span>
          </div>
          <div className="h-8 bg-slate-100 rounded-2xl overflow-hidden border-4 border-slate-50 p-1">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${hpPercentage}%` }}
              className={`h-full rounded-xl ${isDefeated ? 'bg-rpg-green' : 'bg-gradient-to-r from-rpg-red to-orange-500'} progress-shimmer`}
            />
          </div>
        </div>

        {!isDefeated && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAttack(boss.id, 20)}
            className="mt-8 w-full py-4 bg-rpg-red hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl game-shadow transition-all flex items-center justify-center gap-3"
          >
            <Target size={24} />
            Strike Enemy
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
