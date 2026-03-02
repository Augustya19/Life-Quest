import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Brain, Heart, User } from 'lucide-react';
import { Stats } from '../types';

interface CharacterPanelProps {
  name: string;
  class: string;
  stats: Stats;
}

export default function CharacterPanel({ name, class: charClass, stats }: CharacterPanelProps) {
  const statItems = [
    { label: 'Strength', value: stats.strength, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500' },
    { label: 'Intelligence', value: stats.intelligence, icon: Brain, color: 'text-blue-500', bg: 'bg-blue-500' },
    { label: 'Discipline', value: stats.discipline, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500' },
    { label: 'Health', value: stats.health, icon: Heart, color: 'text-red-500', bg: 'bg-red-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl p-6 border-4 border-slate-100 game-shadow"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-rpg-purple to-rpg-blue flex items-center justify-center text-white border-4 border-white game-shadow glow-purple overflow-hidden">
            <User size={48} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rpg-gold text-white p-2 rounded-lg game-shadow">
            <Shield size={16} />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">{name}</h2>
        <p className="text-[10px] font-game text-rpg-purple uppercase tracking-widest mt-1">{charClass}</p>
      </div>

      <div className="space-y-5">
        {statItems.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${stat.color.replace('text', 'bg')}/10`}>
                  <stat.icon size={14} className={stat.color} />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{stat.label}</span>
              </div>
              <span className="text-sm font-black text-slate-800">{stat.value}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (stat.value / 100) * 100)}%` }}
                className={`h-full rounded-full ${stat.bg}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
