export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export type Category = string;

export const DEFAULT_CATEGORIES = [
  'HEALTH',
  'LEARNING',
  'CAREER',
  'PERSONAL'
];

export interface Stats {
  strength: number;
  intelligence: number;
  discipline: number;
  health: number;
}

export enum CharacterClass {
  WARRIOR = 'WARRIOR',
  MAGE = 'MAGE',
  PALADIN = 'PALADIN',
  ROGUE = 'ROGUE'
}

export interface Character {
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  gold: number;
  stats: Stats;
  isInitialized: boolean;
}

export interface Quest {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  xpReward: number;
  deadline?: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  statType: keyof Stats;
  streak: number;
  lastCompleted?: string;
}

export interface Boss {
  id: string;
  title: string;
  maxHp: number;
  currentHp: number;
  rewardXp: number;
  deadline: string;
}

export const XP_REWARDS = {
  [Difficulty.EASY]: 20,
  [Difficulty.MEDIUM]: 50,
  [Difficulty.HARD]: 100,
};

export const getXPForLevel = (level: number) => Math.floor(100 * Math.pow(level, 1.5));
