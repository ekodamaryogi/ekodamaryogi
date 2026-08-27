'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, Award, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

const certStyles = [
  { cardClass: 'cyber-card-amber hover:neon-glow-amber border-amber-500/30', iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', titleHover: 'group-hover:text-amber-400' },
  { cardClass: 'cyber-card-emerald hover:neon-glow-emerald border-emerald-500/30', iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', titleHover: 'group-hover:text-emerald-400' },
  { cardClass: 'cyber-card-cyan hover:neon-glow-cyan border-cyan-500/30', iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', titleHover: 'group-hover:text-cyan-400' },
  { cardClass: 'cyber-card-violet hover:neon-glow-violet border-purple-500/30', iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30', titleHover: 'group-hover:text-purple-400' }
];

export default function CertificationSection() {
  const { data, add, remove, update, uploadImage, isLoading } = useCRUD<{id: string, name: string, issuer: string, year: string, image_url?: string}>('certifications');
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', issuer: '', year: '', image_url: '' });
  const [isUploading, setIsUploading] = useState(false);

  const openAddModal = () => {
    setIsEditing(null);
    setForm({ name: '', issuer: '', year: '', image_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(item.id);
    setForm({ name: item.name, issuer: item.issuer, year: item.year, image_url: item.image_url || '' });
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
    <motion.section id="certification" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="w-full pt-20 mt-8 scroll-mt-24">
      <div className="flex justify-between items-center mb-8 border-b border-amber-500/30 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 neon-text-violet">
          <span className="w-2.5 h-8 bg-amber-400 rounded-full neon-glow-amber"></span>
          Certifications
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all neon-glow-amber">
            <Plus size={16} /> Add Cert
          </button>
        )}
      </div>

      {isLoading && <p className="text-amber-400/80 text-center py-8 font-mono">Loading certifications...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isLoading && data.map((cert, index) => {
          const style = certStyles[index % certStyles.length];
          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card flex flex-col overflow-hidden group transition-all duration-300 ${style.cardClass}`}
            >
              {cert.image_url && (
                <div className="h-40 w-full bg-black/40 relative border-b border-white/5 flex items-center justify-center overflow-hidden">
                  <img src={cert.image_url} alt={cert.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 opacity-85 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                {!cert.image_url && (
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${style.iconColor}`}>
                    <Award size={24} />
                  </div>
                )}

                <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors ${style.titleHover}`}>{cert.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{cert.issuer}</p>
                <p className="text-cyan-400 text-xs mt-4 font-semibold font-mono">{cert.year}</p>

                {isAdmin && (
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <button onClick={() => openEditModal(cert)} className="p-1.5 hover:bg-amber-500/20 rounded-lg text-gray-500 dark:text-gray-300 hover:text-amber-300 transition-colors"><Pencil size={14}/></button>
                    <button onClick={() => remove(cert.id)} className="p-1.5 hover:bg-pink-500/20 text-pink-400 rounded-lg transition-colors"><Trash2 size={14}/></button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Certification" : "Add Certification"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Certificate Image</label>
            <div className="flex items-center gap-4">
              {form.image_url && (
                <div className="w-16 h-16 rounded overflow-hidden border border-amber-500/30 shrink-0">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-amber-500/30 rounded-xl cursor-pointer hover:bg-amber-500/10 transition-colors">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                    <ImageIcon size={16} /> {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/40 border border-amber-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-amber-400 outline-none"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Credential ID / Issuer</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/40 border border-amber-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-amber-400 outline-none"
              value={form.issuer}
              onChange={e => setForm({...form, issuer: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Year</label>
            <input
              required
              type="text"
              className="w-full bg-gray-100 dark:bg-black/40 border border-amber-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-amber-400 outline-none"
              value={form.year}
              onChange={e => setForm({...form, year: e.target.value})}
              placeholder="e.g. 2023"
            />
          </div>
          <button type="submit" disabled={isUploading} className="w-full bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-300 border border-amber-500/50 font-medium py-3 rounded-xl transition-colors mt-2 neon-glow-amber">
            {isEditing ? "Save Changes" : "Add Certification"}
          </button>
        </form>
      </Modal>
    </motion.section>
  );
}
