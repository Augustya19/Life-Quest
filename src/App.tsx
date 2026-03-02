import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sword, LayoutDashboard, Scroll, Trophy, Settings, Coins, Heart, Zap, Shield } from 'lucide-react';
import { useLifeQuest } from './useLifeQuest';
import { Category, Difficulty, CharacterClass } from './types';
import XPBar from './components/XPBar';
import CharacterPanel from './components/CharacterPanel';
import QuestCard from './components/QuestCard';
import BossBattleCard from './components/BossBattleCard';
import SkillTree from './components/SkillTree';

export default function App() {
  const { 
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
    updateBoss
  } = useLifeQuest();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'quests' | 'skills' | 'settings' | 'shop'>('dashboard');
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddBoss, setShowAddBoss] = useState(false);

  const [editingQuest, setEditingQuest] = useState<any | null>(null);
  const [editingHabit, setEditingHabit] = useState<any | null>(null);
  const [editingBoss, setEditingBoss] = useState<any | null>(null);
  
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestCategory, setNewQuestCategory] = useState<string>('PERSONAL');
  const [newQuestDifficulty, setNewQuestDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [addToDaily, setAddToDaily] = useState(false);

  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [newSkillStat, setNewSkillStat] = useState<keyof typeof character.stats>('discipline');

  const [newBossTitle, setNewBossTitle] = useState('');
  const [newBossHp, setNewBossHp] = useState(100);
  const [newBossDeadline, setNewBossDeadline] = useState('');

  const [editName, setEditName] = useState(character.name);
  const [editClass, setEditClass] = useState<CharacterClass>(character.class);

  const [creationName, setCreationName] = useState('');
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);

  const CHARACTERS = [
    { 
      id: CharacterClass.WARRIOR, 
      name: 'The Iron Vanguard', 
      class: CharacterClass.WARRIOR,
      icon: Sword, 
      desc: 'A former captain seeking to rebuild his strength through physical discipline.', 
      bonus: '+5 STR, +20 HP',
      color: 'border-orange-500',
      glow: 'glow-orange'
    },
    { 
      id: CharacterClass.MAGE, 
      name: 'The Arcane Scholar', 
      class: CharacterClass.MAGE,
      icon: Zap, 
      desc: 'A seeker of knowledge who believes true power comes from a focused mind.', 
      bonus: '+8 INT, +2 DIS',
      color: 'border-blue-500',
      glow: 'glow-blue'
    },
    { 
      id: CharacterClass.PALADIN, 
      name: 'The Eternal Guardian', 
      class: CharacterClass.PALADIN,
      icon: Shield, 
      desc: 'Bound by an ancient oath to protect the realm through unbreakable routine.', 
      bonus: '+8 DIS, +10 HP',
      color: 'border-emerald-500',
      glow: 'glow-emerald'
    },
    { 
      id: CharacterClass.ROGUE, 
      name: 'The Shadow Whisperer', 
      class: CharacterClass.ROGUE,
      icon: Heart, 
      desc: 'A master of efficiency who operates in silence, perfecting the art of the strike.', 
      bonus: '+5 INT, +5 DIS',
      color: 'border-purple-500',
      glow: 'glow-purple'
    },
  ];

  const handleCreateCharacter = (e: FormEvent) => {
    e.preventDefault();
    if (creationName.trim()) {
      const char = CHARACTERS[selectedCharacterIndex];
      createCharacter(creationName, char.class);
    }
  };

  const handleAddQuest = (e: FormEvent) => {
    e.preventDefault();
    if (newQuestTitle.trim()) {
      const finalCategory = isCustomCategory ? customCategory.trim() : newQuestCategory;
      if (finalCategory) {
        addQuest(newQuestTitle, finalCategory, newQuestDifficulty, addToDaily);
        setNewQuestTitle('');
        setCustomCategory('');
        setIsCustomCategory(false);
        setAddToDaily(false);
        setShowAddQuest(false);
      }
    }
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (newSkillTitle.trim()) {
      addHabit(newSkillTitle, newSkillStat);
      setNewSkillTitle('');
      setShowAddSkill(false);
    }
  };

  const handleAddBoss = (e: FormEvent) => {
    e.preventDefault();
    if (newBossTitle.trim() && newBossDeadline) {
      addBoss(newBossTitle, newBossHp, newBossHp * 5, newBossDeadline);
      setNewBossTitle('');
      setNewBossHp(100);
      setNewBossDeadline('');
      setShowAddBoss(false);
    }
  };

  const handleUpdateQuest = (e: FormEvent) => {
    e.preventDefault();
    if (editingQuest && editingQuest.title.trim()) {
      updateQuest(editingQuest.id, editingQuest);
      setEditingQuest(null);
    }
  };

  const handleUpdateHabit = (e: FormEvent) => {
    e.preventDefault();
    if (editingHabit && editingHabit.title.trim()) {
      updateHabit(editingHabit.id, editingHabit);
      setEditingHabit(null);
    }
  };

  const handleUpdateBoss = (e: FormEvent) => {
    e.preventDefault();
    if (editingBoss && editingBoss.title.trim()) {
      updateBoss(editingBoss.id, editingBoss);
      setEditingBoss(null);
    }
  };

  if (!character.isInitialized) {
    return (
      <div className="min-h-screen bg-rpg-bg flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white rounded-[40px] p-8 md:p-12 border-8 border-slate-100 shadow-2xl overflow-y-auto max-h-[95vh]"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-game uppercase tracking-tighter text-slate-800 mb-4">Create Your Hero</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">Your journey begins here...</p>
          </div>

          <form onSubmit={handleCreateCharacter} className="space-y-12">
            <div className="max-w-md mx-auto">
              <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-4 text-center">Hero Name</label>
              <input 
                autoFocus
                type="text" 
                required
                value={creationName}
                onChange={(e) => setCreationName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl px-6 py-5 font-black text-xl text-slate-800 text-center focus:outline-none focus:border-rpg-purple transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CHARACTERS.map((char, index) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => setSelectedCharacterIndex(index)}
                  className={`relative flex flex-col items-center p-6 rounded-[32px] border-4 transition-all text-center group ${
                    selectedCharacterIndex === index 
                      ? `bg-white ${char.color} ${char.glow} -translate-y-2` 
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 border-4 transition-all ${
                    selectedCharacterIndex === index ? char.color : 'border-white bg-white'
                  }`}>
                    <char.icon size={40} className={selectedCharacterIndex === index ? 'text-slate-800' : 'text-slate-300'} />
                  </div>
                  
                  <h4 className="font-black text-lg text-slate-800 mb-1">{char.name}</h4>
                  <p className="text-[10px] font-game text-rpg-purple uppercase tracking-tight mb-3">{char.bonus}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{char.desc}</p>
                  
                  {selectedCharacterIndex === index && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute -top-3 -right-3 bg-rpg-purple text-white p-2 rounded-xl shadow-lg"
                    >
                      <Shield size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <div className="max-w-md mx-auto pt-4">
              <button 
                type="submit"
                className="w-full py-6 bg-rpg-purple hover:bg-purple-500 text-white font-black uppercase tracking-widest text-xl rounded-3xl game-shadow glow-purple transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Begin Adventure
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-28 px-4">
      <XPBar currentXP={character.xp} level={character.level} gold={character.gold} />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Character Info */}
        <aside className="lg:col-span-3 space-y-6">
          <CharacterPanel name={character.name} class={character.class} stats={character.stats} />
          
          <nav className="bg-white rounded-3xl p-3 border-4 border-slate-100 game-shadow">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'quests', icon: Scroll, label: 'Quest Log' },
              { id: 'skills', icon: Trophy, label: 'Skill Tree' },
              { id: 'shop', icon: Coins, label: 'Item Shop' },
              { id: 'settings', icon: Settings, label: 'Options' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-tight transition-all mb-1 ${
                  activeTab === item.id 
                    ? 'bg-rpg-purple text-white glow-purple' 
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-9 space-y-10">
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Boss Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-game uppercase tracking-tighter flex items-center gap-3 text-slate-800">
                    <Sword className="text-rpg-red" /> Active Bosses
                  </h2>
                  <button 
                    onClick={() => setShowAddBoss(true)}
                    className="p-3 bg-white border-4 border-slate-100 rounded-2xl text-rpg-red game-shadow hover:game-shadow-hover transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {bosses.map(boss => (
                    <BossBattleCard 
                      key={boss.id} 
                      boss={boss} 
                      onAttack={attackBoss} 
                      onDelete={removeBoss}
                      onEdit={setEditingBoss}
                    />
                  ))}
                  {bosses.length === 0 && (
                    <div className="py-16 text-center bg-white rounded-3xl border-4 border-dashed border-slate-100">
                      <p className="text-slate-400 font-black uppercase tracking-widest italic">No bosses currently threatening the realm...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Quests Preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-game uppercase tracking-tighter flex items-center gap-3 text-slate-800">
                    <Scroll className="text-rpg-blue" /> Current Quests
                  </h2>
                  <button 
                    onClick={() => setShowAddQuest(true)}
                    className="p-3 bg-white border-4 border-slate-100 rounded-2xl text-rpg-blue game-shadow hover:game-shadow-hover transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {quests.filter(q => !q.completed).slice(0, 4).map(quest => (
                      <QuestCard 
                        key={quest.id} 
                        quest={quest} 
                        onComplete={completeQuest} 
                        onDelete={removeQuest}
                        onEdit={setEditingQuest}
                      />
                    ))}
                  </AnimatePresence>
                  {quests.filter(q => !q.completed).length === 0 && (
                    <div className="col-span-full py-16 text-center bg-white rounded-3xl border-4 border-dashed border-slate-100">
                      <p className="text-slate-400 font-black uppercase tracking-widest italic">The quest board is empty...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills/Habits Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-game uppercase tracking-tighter flex items-center gap-3 text-slate-800">
                    <Trophy className="text-rpg-gold" /> Daily Skills
                  </h2>
                  <button 
                    onClick={() => setShowAddSkill(true)}
                    className="p-3 bg-white border-4 border-slate-100 rounded-2xl text-rpg-gold game-shadow hover:game-shadow-hover transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <SkillTree 
                  habits={habits} 
                  onComplete={completeHabit} 
                  onDelete={removeHabit}
                  onEdit={setEditingHabit}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'quests' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-game uppercase tracking-tighter text-slate-800">Quest Log</h2>
                <button 
                  onClick={() => setShowAddQuest(true)}
                  className="px-6 py-3 bg-rpg-blue hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-purple transition-all"
                >
                  <Plus size={20} /> New Quest
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {quests.map(quest => (
                    <QuestCard 
                      key={quest.id} 
                      quest={quest} 
                      onComplete={completeQuest} 
                      onDelete={removeQuest}
                      onEdit={setEditingQuest}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-game uppercase tracking-tighter text-slate-800">Skill Tree</h2>
                <button 
                  onClick={() => setShowAddSkill(true)}
                  className="px-6 py-3 bg-rpg-gold hover:bg-amber-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-gold transition-all"
                >
                  <Plus size={20} /> New Skill
                </button>
              </div>
              <SkillTree 
                habits={habits} 
                onComplete={completeHabit} 
                onDelete={removeHabit}
                onEdit={setEditingHabit}
              />
            </motion.div>
          )}

          {activeTab === 'shop' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-game uppercase tracking-tighter text-slate-800">Item Shop</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'p1', name: 'Health Potion', price: 50, icon: Heart, desc: 'Restore 20 HP' },
                  { id: 'p2', name: 'EXP Scroll', price: 150, icon: Scroll, desc: 'Gain 100 XP' },
                  { id: 'p3', name: 'Strength Charm', price: 300, icon: Zap, desc: '+5 Strength' },
                ].map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-6 border-4 border-slate-100 game-shadow flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-rpg-purple mb-4 border-2 border-slate-100">
                      <item.icon size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-400 mb-4">{item.desc}</p>
                    <button 
                      disabled={character.gold < item.price}
                      className={`w-full py-3 rounded-xl font-game text-[10px] uppercase transition-all ${
                        character.gold >= item.price 
                          ? 'bg-rpg-gold text-white game-shadow hover:glow-gold' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {item.price} G
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-game uppercase tracking-tighter text-slate-800">Options</h2>
              
              <div className="bg-white rounded-3xl p-8 border-4 border-slate-100 game-shadow space-y-8">
                {/* Profile Section */}
                <div>
                  <h3 className="text-xl font-black uppercase mb-6 text-slate-800 flex items-center gap-2">
                    <Settings className="text-rpg-purple" size={20} /> Character Profile
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Character Name</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-4">Change Character Class</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {CHARACTERS.map(char => (
                          <button
                            key={char.id}
                            onClick={() => {
                              setEditClass(char.class);
                            }}
                            className={`relative flex flex-col items-center p-4 rounded-2xl border-4 transition-all ${
                              editClass === char.class ? 'border-rpg-purple bg-rpg-purple/5 glow-purple' : 'border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-slate-50">
                              <char.icon size={24} className={editClass === char.class ? 'text-rpg-purple' : 'text-slate-300'} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-600">{char.class}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => updateProfile(editName, editClass)}
                      className="w-full py-4 bg-rpg-purple hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-purple transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="border-t-4 border-slate-50 pt-8">
                  <h3 className="text-xl font-black uppercase mb-2 text-slate-800">Danger Zone</h3>
                  <p className="text-sm text-slate-500 mb-6">Resetting your progress will delete all quests, habits, and character stats. This cannot be undone.</p>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all progress?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-8 py-4 bg-rpg-red hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest game-shadow transition-all"
                  >
                    Reset All Progress
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </section>
      </main>

      {/* Add Quest Modal */}
      <AnimatePresence>
        {showAddQuest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddQuest(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-2xl font-game uppercase tracking-tighter text-slate-800 mb-6">New Quest</h3>
              <form onSubmit={handleAddQuest} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Objective</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newQuestTitle}
                    onChange={(e) => setNewQuestTitle(e.target.value)}
                    placeholder="What is your mission?"
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Category</label>
                    {!isCustomCategory ? (
                      <div className="flex gap-2">
                        <select 
                          value={newQuestCategory}
                          onChange={(e) => setNewQuestCategory(e.target.value)}
                          className="flex-1 bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button 
                          type="button"
                          onClick={() => setIsCustomCategory(true)}
                          className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-rpg-purple transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="New Category..."
                          className="flex-1 bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                        />
                        <button 
                          type="button"
                          onClick={() => setIsCustomCategory(false)}
                          className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Difficulty</label>
                    <select 
                      value={newQuestDifficulty}
                      onChange={(e) => setNewQuestDifficulty(e.target.value as Difficulty)}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                    >
                      <option value={Difficulty.EASY}>Easy (20 XP)</option>
                      <option value={Difficulty.MEDIUM}>Medium (50 XP)</option>
                      <option value={Difficulty.HARD}>Hard (100 XP)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border-4 border-slate-100">
                  <input 
                    type="checkbox"
                    id="addToDaily"
                    checked={addToDaily}
                    onChange={(e) => setAddToDaily(e.target.checked)}
                    className="w-6 h-6 rounded-lg border-4 border-slate-200 text-rpg-purple focus:ring-rpg-purple"
                  />
                  <label htmlFor="addToDaily" className="text-sm font-black uppercase tracking-tight text-slate-600 cursor-pointer">
                    Add to Daily Skills (Habit)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddQuest(false)}
                    className="py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-4 bg-rpg-purple hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-purple transition-all"
                  >
                    Accept
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showAddSkill && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSkill(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-2xl"
            >
              <h3 className="text-2xl font-game uppercase tracking-tighter text-slate-800 mb-6">New Skill</h3>
              <form onSubmit={handleAddSkill} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Skill Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newSkillTitle}
                    onChange={(e) => setNewSkillTitle(e.target.value)}
                    placeholder="e.g. Daily Meditation"
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:outline-none focus:border-rpg-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Stat to Level Up</label>
                  <select 
                    value={newSkillStat}
                    onChange={(e) => setNewSkillStat(e.target.value as any)}
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-gold transition-colors"
                  >
                    <option value="strength">Strength</option>
                    <option value="intelligence">Intelligence</option>
                    <option value="discipline">Discipline</option>
                    <option value="health">Health</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddSkill(false)}
                    className="py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-4 bg-rpg-gold hover:bg-amber-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-gold transition-all"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Boss Modal */}
      <AnimatePresence>
        {showAddBoss && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBoss(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-2xl"
            >
              <h3 className="text-2xl font-game uppercase tracking-tighter text-slate-800 mb-6">New Boss</h3>
              <form onSubmit={handleAddBoss} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Boss Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newBossTitle}
                    onChange={(e) => setNewBossTitle(e.target.value)}
                    placeholder="e.g. Q1 Project Launch"
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:outline-none focus:border-rpg-red transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">HP (Difficulty)</label>
                    <input 
                      type="number" 
                      value={newBossHp}
                      onChange={(e) => setNewBossHp(Number(e.target.value))}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Deadline</label>
                    <input 
                      type="date" 
                      value={newBossDeadline}
                      onChange={(e) => setNewBossDeadline(e.target.value)}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-red transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddBoss(false)}
                    className="py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-4 bg-rpg-red hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-purple transition-all"
                  >
                    Summon
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Edit Quest Modal */}
      <AnimatePresence>
        {editingQuest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingQuest(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-2xl font-game uppercase tracking-tighter text-slate-800 mb-6">Edit Quest</h3>
              <form onSubmit={handleUpdateQuest} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Objective</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={editingQuest.title}
                    onChange={(e) => setEditingQuest({ ...editingQuest, title: e.target.value })}
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Category</label>
                    <select 
                      value={editingQuest.category}
                      onChange={(e) => setEditingQuest({ ...editingQuest, category: e.target.value })}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Difficulty</label>
                    <select 
                      value={editingQuest.difficulty}
                      onChange={(e) => setEditingQuest({ ...editingQuest, difficulty: e.target.value as Difficulty })}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-purple transition-colors"
                    >
                      <option value={Difficulty.EASY}>Easy</option>
                      <option value={Difficulty.MEDIUM}>Medium</option>
                      <option value={Difficulty.HARD}>Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingQuest(null)}
                    className="py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-4 bg-rpg-purple hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-purple transition-all"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Skill Modal */}
      <AnimatePresence>
        {editingHabit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingHabit(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-2xl"
            >
              <h3 className="text-2xl font-game uppercase tracking-tighter text-slate-800 mb-6">Edit Skill</h3>
              <form onSubmit={handleUpdateHabit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Skill Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={editingHabit.title}
                    onChange={(e) => setEditingHabit({ ...editingHabit, title: e.target.value })}
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:outline-none focus:border-rpg-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Stat to Level Up</label>
                  <select 
                    value={editingHabit.statType}
                    onChange={(e) => setEditingHabit({ ...editingHabit, statType: e.target.value as any })}
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-gold transition-colors"
                  >
                    <option value="strength">Strength</option>
                    <option value="intelligence">Intelligence</option>
                    <option value="discipline">Discipline</option>
                    <option value="health">Health</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingHabit(null)}
                    className="py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-4 bg-rpg-gold hover:bg-amber-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-gold transition-all"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Boss Modal */}
      <AnimatePresence>
        {editingBoss && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingBoss(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border-4 border-slate-100 shadow-2xl"
            >
              <h3 className="text-2xl font-game uppercase tracking-tighter text-slate-800 mb-6">Edit Boss</h3>
              <form onSubmit={handleUpdateBoss} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Boss Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={editingBoss.title}
                    onChange={(e) => setEditingBoss({ ...editingBoss, title: e.target.value })}
                    className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:outline-none focus:border-rpg-red transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Max HP</label>
                    <input 
                      type="number" 
                      value={editingBoss.maxHp}
                      onChange={(e) => setEditingBoss({ ...editingBoss, maxHp: Number(e.target.value), currentHp: Math.min(editingBoss.currentHp, Number(e.target.value)) })}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-game uppercase tracking-widest text-slate-400 mb-2">Deadline</label>
                    <input 
                      type="date" 
                      value={editingBoss.deadline}
                      onChange={(e) => setEditingBoss({ ...editingBoss, deadline: e.target.value })}
                      className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-rpg-red transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingBoss(null)}
                    className="py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-4 bg-rpg-red hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl game-shadow glow-purple transition-all"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
