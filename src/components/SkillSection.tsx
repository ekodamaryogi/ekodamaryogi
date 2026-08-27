'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

const cardGlows = [
  { cardClass: 'cyber-card-cyan hover:neon-glow-cyan border-cyan-500/20', textClass: 'text-cyan-400', badgeClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30' },
  { cardClass: 'cyber-card-magenta hover:neon-glow-magenta border-pink-500/20', textClass: 'text-pink-400', badgeClass: 'text-pink-300 bg-pink-500/10 border-pink-500/30' },
  { cardClass: 'cyber-card-violet hover:neon-glow-violet border-purple-500/20', textClass: 'text-purple-400', badgeClass: 'text-purple-300 bg-purple-500/10 border-purple-500/30' },
  { cardClass: 'cyber-card-emerald hover:neon-glow-emerald border-emerald-500/20', textClass: 'text-emerald-400', badgeClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' },
  { cardClass: 'cyber-card-amber hover:neon-glow-amber border-amber-500/20', textClass: 'text-amber-400', badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/30' }
];

export default function SkillSection() {
  const { data, add, remove, update, isLoading } = useCRUD<{id: string, name: string, level: string}>('skills');
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', level: '' });

  const openAddModal = () => {
    setIsEditing(null);
    setForm({ name: '', level: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(item.id);
    setForm({ name: item.name, level: item.level });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      update(isEditing, form);
    } else {
      add(form);
    }
    setIsModalOpen(false);
  };

  return (
    <motion.section id="skill" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="w-full pt-20 mt-8 scroll-mt-24">
      <div className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 neon-text-cyan">
          <span className="w-2.5 h-8 bg-cyan-400 rounded-full neon-glow-cyan"></span>
          Skills
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all neon-glow-cyan">
            <Plus size={16} /> Add Skill
          </button>
        )}
      </div>

      {isLoading && <p className="text-cyan-400/80 text-center py-8 font-mono">Loading cyber data...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {!isLoading && data.map((skill, index) => {
          const style = cardGlows[index % cardGlows.length];
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card p-6 flex flex-col justify-between group transition-all duration-300 ${style.cardClass}`}
            >
              <div>
                <h3 className={`text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:${style.textClass} transition-colors`}>
                  {skill.name}
                </h3>
                <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full border ${style.badgeClass}`}>
                  {skill.level}
                </span>
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-4 justify-end border-t border-gray-200 dark:border-white/10 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(skill)} className="p-2 hover:bg-cyan-500/20 rounded-lg text-gray-500 dark:text-gray-300 hover:text-cyan-300 transition-colors"><Pencil size={16}/></button>
                  <button onClick={() => remove(skill.id)} className="p-2 hover:bg-pink-500/20 text-gray-500 dark:text-gray-300 hover:text-pink-400 rounded-lg transition-colors"><Trash2 size={16}/></button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/40 border border-cyan-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-cyan-400 outline-none"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Level</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/40 border border-cyan-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-cyan-400 outline-none"
              value={form.level}
              onChange={e => setForm({...form, level: e.target.value})}
              placeholder="e.g. Advanced, Intermediate"
            />
          </div>
          <button type="submit" className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-medium py-3 rounded-xl transition-colors mt-2 neon-glow-cyan">
            {isEditing ? "Save Changes" : "Add Skill"}
          </button>
        </form>
      </Modal>
    </motion.section>
  );
}
