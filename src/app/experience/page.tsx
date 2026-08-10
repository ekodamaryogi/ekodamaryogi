'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, Briefcase } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

export default function ExperiencePage() {
  const { data, add, remove, update, isLoading } = useCRUD<{id: string, role: string, company: string, period: string, desc: string}>('experience');
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ role: '', company: '', period: '', desc: '' });

  const openAddModal = () => {
    setIsEditing(null);
    setForm({ role: '', company: '', period: '', desc: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(item.id);
    setForm({ role: item.role, company: item.company, period: item.period, desc: item.desc });
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-cyber-blue/30 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-cyber-blue rounded-full"></span>
          Experience
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-blue-100 dark:bg-cyber-blue/20 hover:bg-blue-200 dark:hover:bg-cyber-blue/40 border border-blue-500 dark:border-cyber-blue text-blue-600 dark:text-cyber-blue px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all dark:hover:shadow-cyber">
            <Plus size={16} /> Add Experience
          </button>
        )}
      </div>

      {isLoading && <p className="text-gray-500 text-center py-8">Loading data...</p>}

      <div className="relative border-l border-blue-200 dark:border-cyber-blue/30 ml-4 md:ml-6 space-y-12">
        {!isLoading && data.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative pl-8 md:pl-12 group"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-white dark:bg-cyber-dark rounded-full flex items-center justify-center border-2 border-blue-500 dark:border-cyber-blue shadow-md dark:shadow-cyber group-hover:bg-blue-500 dark:group-hover:bg-cyber-blue transition-colors">
              <Briefcase size={12} className="text-blue-500 dark:text-cyber-blue group-hover:text-white dark:group-hover:text-cyber-dark transition-colors" />
            </div>

            <div className="glass-card p-6 rounded-2xl group-hover:border-blue-400/50 dark:group-hover:border-cyber-blue/50 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-cyber-blue transition-colors">{exp.role}</h3>
                  <h4 className="text-blue-600/80 dark:text-cyber-blue/80 font-medium">{exp.company}</h4>
                </div>
                <span className="text-sm font-semibold bg-blue-50 dark:bg-cyber-blue/10 border border-blue-200 dark:border-cyber-blue/20 px-3 py-1 rounded-full text-blue-600 dark:text-cyber-blue mt-2 md:mt-0 whitespace-nowrap font-mono">
                  {exp.period}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {exp.desc}
              </p>

              {isAdmin && (
                <div className="flex gap-2 mt-6 justify-end pt-4 border-t border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(exp)} className="p-2 hover:bg-blue-100 dark:hover:bg-cyber-blue/20 rounded-lg text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyber-blue transition-colors"><Pencil size={16}/></button>
                  <button onClick={() => remove(exp.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16}/></button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Experience" : "Add Experience"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Role Title</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Company</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.company}
              onChange={e => setForm({...form, company: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Period</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.period}
              onChange={e => setForm({...form, period: e.target.value})}
              placeholder="e.g. 2020 - 2022"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
            <textarea
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white min-h-[100px]"
              value={form.desc}
              onChange={e => setForm({...form, desc: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-2">
            {isEditing ? "Save Changes" : "Add Experience"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
