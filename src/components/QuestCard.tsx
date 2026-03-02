import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, Award, Coins, Trash2, Edit2 } from 'lucide-react';
import { Quest, Difficulty } from '../types';

interface QuestCardProps {
  key?: string;
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (quest: Quest) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'HEALTH': 'text-emerald-600 bg-emerald-100',
  'LEARNING': 'text-blue-600 bg-blue-100',
  'CAREER': 'text-amber-600 bg-amber-100',
  'PERSONAL': 'text-purple-600 bg-purple-100',
};

const DEFAULT_CATEGORY_COLOR = 'text-slate-600 bg-slate-100';

const DIFFICULTY_BORDERS = {
  [Difficulty.EASY]: 'border-emerald-200',
  [Difficulty.MEDIUM]: 'border-blue-200',
  [Difficulty.HARD]: 'border-red-200',
};

export default function QuestCard({ quest, onComplete, onDelete, onEdit }: QuestCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`relative bg-white rounded-2xl p-5 border-4 ${DIFFICULTY_BORDERS[quest.difficulty]} game-shadow-hover transition-all duration-300 group ${quest.completed ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(quest)}
          className="p-1.5 bg-white border-2 border-slate-100 rounded-lg text-slate-400 hover:text-rpg-blue hover:border-rpg-blue transition-all"
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={() => onDelete(quest.id)}
          className="p-1.5 bg-white border-2 border-slate-100 rounded-lg text-slate-400 hover:text-rpg-red hover:border-rpg-red transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-[10px] font-game uppercase tracking-tight px-2 py-1 rounded-lg ${CATEGORY_COLORS[quest.category] || DEFAULT_CATEGORY_COLOR}`}>
              {quest.category}
            </span>
            {quest.deadline && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <Clock size={12} />
                <span>{quest.deadline}</span>
              </div>
            )}
          </div>
          <h3 className={`text-lg font-black text-slate-800 leading-tight ${quest.completed ? 'line-through opacity-50' : ''}`}>
            {quest.title}
          </h3>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-rpg-purple">
              <Award size={14} />
              <span className="text-[10px] font-game">+{quest.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1 text-rpg-gold">
              <Coins size={14} />
              <span className="text-[10px] font-game">+{Math.floor(quest.xpReward / 2)} G</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => !quest.completed && onComplete(quest.id)}
          className={`p-1 rounded-xl transition-all active:scale-90 ${quest.completed ? 'text-rpg-green' : 'text-slate-300 hover:text-rpg-purple hover:bg-slate-50'}`}
        >
          {quest.completed ? <CheckCircle2 size={32} /> : <Circle size={32} />}
        </button>
      </div>
    </motion.div>
  );
}
