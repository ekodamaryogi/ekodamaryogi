'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

export default function SkillPage() {
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-cyber-blue/30 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-cyber-blue rounded-full"></span>
          Skills
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-blue-100 dark:bg-cyber-blue/20 hover:bg-blue-200 dark:hover:bg-cyber-blue/40 border border-blue-500 dark:border-cyber-blue text-blue-600 dark:text-cyber-blue px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all dark:hover:shadow-cyber">
            <Plus size={16} /> Add Skill
          </button>
        )}
      </div>

      {isLoading && <p className="text-gray-500 text-center py-8">Loading data...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {!isLoading && data.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-6 flex flex-col justify-between group"
          >
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyber-blue transition-colors">{skill.name}</h3>
              <p className="text-blue-600/80 dark:text-cyber-blue/80 text-sm font-medium">{skill.level}</p>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-4 justify-end border-t border-gray-200 dark:border-white/10 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(skill)} className="p-2 hover:bg-blue-100 dark:hover:bg-cyber-blue/20 rounded-lg text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyber-blue transition-colors"><Pencil size={16}/></button>
                <button onClick={() => remove(skill.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Level</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.level}
              onChange={e => setForm({...form, level: e.target.value})}
              placeholder="e.g. Advanced, Intermediate"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-2">
            {isEditing ? "Save Changes" : "Add Skill"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
