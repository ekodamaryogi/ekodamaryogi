'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

export default function ProjectsPage() {
  const { data, add, remove, update, uploadImage, isLoading } = useCRUD<{id: string, title: string, desc: string, link: string, image_url?: string}>('projects');
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', desc: '', link: '', image_url: '' });
  const [isUploading, setIsUploading] = useState(false);

  const openAddModal = () => {
    setIsEditing(null);
    setForm({ title: '', desc: '', link: '', image_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(item.id);
    setForm({ title: item.title, desc: item.desc, link: item.link, image_url: item.image_url || '' });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setForm({ ...form, image_url: url });
    }
    setIsUploading(false);
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
          Projects
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-blue-100 dark:bg-cyber-blue/20 hover:bg-blue-200 dark:hover:bg-cyber-blue/40 border border-blue-500 dark:border-cyber-blue text-blue-600 dark:text-cyber-blue px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all dark:hover:shadow-cyber">
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {isLoading && <p className="text-gray-500 text-center py-8">Loading data...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading && data.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass-card flex flex-col overflow-hidden group hover:border-blue-400/50 dark:hover:border-cyber-blue/50 transition-colors"
          >
            {/* Project Image */}
            <div className="h-48 w-full bg-gray-100 dark:bg-cyber-dark/50 relative border-b border-gray-200 dark:border-white/5 flex items-center justify-center overflow-hidden">
              {project.image_url ? (
                <>
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-blue-500/10 dark:bg-cyber-blue/10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
                </>
              ) : (
                <span className="text-gray-400 dark:text-white/20 text-4xl font-bold group-hover:text-blue-500 dark:group-hover:text-cyber-blue transition-colors">{project.title.charAt(0)}</span>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow bg-white/40 dark:bg-cyber-dark/40 group-hover:bg-blue-50/50 dark:group-hover:bg-cyber-accent/30 transition-colors">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyber-blue transition-colors">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3">{project.desc}</p>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyber-blue hover:text-blue-800 dark:hover:text-cyber-blue/80 dark:hover:shadow-cyber text-sm font-medium flex items-center gap-1 transition-all">
                  View Project <ExternalLink size={14} />
                </a>
                {isAdmin && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(project)} className="p-1.5 hover:bg-blue-100 dark:hover:bg-cyber-blue/20 rounded-lg text-gray-500 hover:text-blue-600 dark:hover:text-cyber-blue transition-colors"><Pencil size={14}/></button>
                    <button onClick={() => remove(project.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14}/></button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Project Image</label>
            <div className="flex items-center gap-4">
              {form.image_url && (
                <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-white/10 shrink-0">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ImageIcon size={16} /> {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Project Title</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Link URL</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.link}
              onChange={e => setForm({...form, link: e.target.value})}
              placeholder="https://..."
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
          <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors mt-2">
            {isEditing ? "Save Changes" : "Add Project"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
