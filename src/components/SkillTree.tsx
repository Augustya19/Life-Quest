import React from 'react';
import { motion } from 'motion/react';
import { Plus, Flame, Award, Trash2, Edit2 } from 'lucide-react';
import { Habit } from '../types';

interface SkillTreeProps {
  habits: Habit[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

export default function SkillTree({ habits, onComplete, onDelete, onEdit }: SkillTreeProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {habits.map((habit) => {
        const isCompletedToday = habit.lastCompleted === today;
        
        return (
          <motion.div 
            key={habit.id}
            whileHover={{ scale: 1.02 }}
            className={`relative p-5 rounded-2xl border-4 transition-all game-shadow group ${isCompletedToday ? 'bg-rpg-green/5 border-rpg-green/20' : 'bg-white border-slate-100'}`}
          >
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(habit)}
                className="p-1.5 bg-white border-2 border-slate-100 rounded-lg text-slate-400 hover:text-rpg-blue hover:border-rpg-blue transition-all"
              >
                <Edit2 size={12} />
              </button>
              <button 
                onClick={() => onDelete(habit.id)}
                className="p-1.5 bg-white border-2 border-slate-100 rounded-lg text-slate-400 hover:text-rpg-red hover:border-rpg-red transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center game-shadow ${isCompletedToday ? 'bg-rpg-green text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Flame size={28} />
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-800 leading-tight">{habit.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-game text-rpg-purple uppercase">
                      <Award size={12} />
                      <span>{habit.statType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-game text-rpg-gold uppercase">
                      <Flame size={12} />
                      <span>{habit.streak} Streak</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                disabled={isCompletedToday}
                onClick={() => onComplete(habit.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all game-shadow active:scale-90 ${isCompletedToday ? 'bg-rpg-green/20 text-rpg-green' : 'bg-rpg-purple text-white hover:glow-purple'}`}
              >
                {isCompletedToday ? <Plus size={24} className="rotate-45" /> : <Plus size={24} />}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
