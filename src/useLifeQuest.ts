import { useState, useEffect } from 'react';
import { Character, Quest, Habit, Boss, XP_REWARDS, getXPForLevel, Difficulty, Category, DEFAULT_CATEGORIES, CharacterClass } from './types';

const INITIAL_CHARACTER: Character = {
  name: 'New Hero',
  class: CharacterClass.WARRIOR,
  level: 1,
  xp: 0,
  gold: 50,
  stats: {
    strength: 10,
    intelligence: 10,
    discipline: 10,
    health: 100,
  },
  isInitialized: false,
};

const CLASS_BONUSES = {
  [CharacterClass.WARRIOR]: { strength: 5, health: 20, intelligence: 0, discipline: 0 },
  [CharacterClass.MAGE]: { strength: 0, health: 0, intelligence: 8, discipline: 2 },
  [CharacterClass.PALADIN]: { strength: 2, health: 10, intelligence: 0, discipline: 8 },
  [CharacterClass.ROGUE]: { strength: 0, health: 0, intelligence: 5, discipline: 5 },
};

export function useLifeQuest() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('lq_categories');
    if (saved) return JSON.parse(saved);
    return DEFAULT_CATEGORIES;
  });

  const [character, setCharacter] = useState<Character>(() => {
    const saved = localStorage.getItem('lq_character');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_CHARACTER, ...parsed };
    }
    return INITIAL_CHARACTER;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('lq_quests');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: 'Complete Portfolio Project', category: 'CAREER', difficulty: Difficulty.HARD, xpReward: 100, completed: false },
      { id: '2', title: 'Read 20 pages of a book', category: 'LEARNING', difficulty: Difficulty.EASY, xpReward: 20, completed: false },
      { id: '3', title: 'Morning Workout', category: 'HEALTH', difficulty: Difficulty.MEDIUM, xpReward: 50, completed: false },
    ];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('lq_habits');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'h1', title: 'Meditation', statType: 'discipline', streak: 5 },
      { id: 'h2', title: 'Coding Practice', statType: 'intelligence', streak: 12 },
      { id: 'h3', title: 'Gym Session', statType: 'strength', streak: 3 },
    ];
  });

  const [bosses, setBosses] = useState<Boss[]>(() => {
    const saved = localStorage.getItem('lq_bosses');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'b1', title: 'The Final Exam', maxHp: 100, currentHp: 80, rewardXp: 500, deadline: '2024-06-01' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('lq_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('lq_character', JSON.stringify(character));
  }, [character]);

  useEffect(() => {
    localStorage.setItem('lq_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('lq_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('lq_bosses', JSON.stringify(bosses));
  }, [bosses]);

  const addXP = (amount: number) => {
    setCharacter(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newGold = prev.gold + Math.floor(amount / 2);
      let xpForNext = getXPForLevel(newLevel);

      while (newXP >= xpForNext) {
        newXP -= xpForNext;
        newLevel += 1;
        xpForNext = getXPForLevel(newLevel);
        newGold += newLevel * 10; // Level up bonus
      }

      return { ...prev, xp: newXP, level: newLevel, gold: newGold };
    });
  };

  const completeQuest = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (quest && !quest.completed) {
      addXP(quest.xpReward);
      setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
    }
  };

  const removeQuest = (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const addQuest = (title: string, category: Category, difficulty: Difficulty, addToDaily: boolean = false) => {
    const newQuest: Quest = {
      id: crypto.randomUUID(),
      title,
      category,
      difficulty,
      xpReward: XP_REWARDS[difficulty],
      completed: false,
    };
    setQuests(prev => [newQuest, ...prev]);

    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }

    if (addToDaily) {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        title,
        statType: 'discipline', // Default to discipline
        streak: 0,
      };
      setHabits(prev => [...prev, newHabit]);
    }
  };

  const addHabit = (title: string, statType: keyof Character['stats']) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      statType,
      streak: 0,
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const updateStat = (stat: keyof Character['stats'], amount: number) => {
    setCharacter(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: prev.stats[stat] + amount,
      },
    }));
  };

  const updateProfile = (name: string, charClass?: CharacterClass) => {
    setCharacter(prev => ({ 
      ...prev, 
      name, 
      class: charClass || prev.class 
    }));
  };

  const createCharacter = (name: string, charClass: CharacterClass) => {
    const bonuses = CLASS_BONUSES[charClass];
    setCharacter(prev => ({
      ...prev,
      name,
      class: charClass,
      isInitialized: true,
      stats: {
        strength: prev.stats.strength + bonuses.strength,
        intelligence: prev.stats.intelligence + bonuses.intelligence,
        discipline: prev.stats.discipline + bonuses.discipline,
        health: prev.stats.health + bonuses.health,
      }
    }));
  };

  const completeHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      const today = new Date().toISOString().split('T')[0];
      if (habit.lastCompleted !== today) {
        updateStat(habit.statType, 1);
        addXP(10); // Small XP for habits
        setHabits(prev => prev.map(h => h.id === id ? { ...h, streak: h.streak + 1, lastCompleted: today } : h));
      }
    }
  };

  const attackBoss = (id: string, damage: number) => {
    setBosses(prev => prev.map(b => {
      if (b.id === id) {
        const newHp = Math.max(0, b.currentHp - damage);
        if (newHp === 0 && b.currentHp > 0) {
          addXP(b.rewardXp);
        }
        return { ...b, currentHp: newHp };
      }
      return b;
    }));
  };

  const addBoss = (title: string, maxHp: number, rewardXp: number, deadline: string) => {
    const newBoss: Boss = {
      id: crypto.randomUUID(),
      title,
      maxHp,
      currentHp: maxHp,
      rewardXp,
      deadline,
    };
    setBosses(prev => [...prev, newBoss]);
  };

  const removeBoss = (id: string) => {
    setBosses(prev => prev.filter(b => b.id !== id));
  };

  const updateBoss = (id: string, updates: Partial<Boss>) => {
    setBosses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  return {
    categories,
    character,
    quests,
    habits,
    bosses,
    addQuest,
    addHabit,
    addBoss,
    updateProfile,
    createCharacter,
    completeQuest,
    removeQuest,
    updateQuest,
    completeHabit,
    removeHabit,
    updateHabit,
    attackBoss,
    removeBoss,
    updateBoss,
  };
}
