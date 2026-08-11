'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, Award, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

export default function CertificationPage() {
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-cyber-blue/30 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-cyber-blue rounded-full"></span>
          Certifications
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-blue-100 dark:bg-cyber-blue/20 hover:bg-blue-200 dark:hover:bg-cyber-blue/40 border border-blue-500 dark:border-cyber-blue text-blue-600 dark:text-cyber-blue px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all dark:hover:shadow-cyber">
            <Plus size={16} /> Add Cert
          </button>
        )}
      </div>

      {isLoading && <p className="text-gray-500 text-center py-8">Loading data...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isLoading && data.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="glass-card flex flex-col border-t-4 border-t-blue-500 overflow-hidden group"
          >
            {cert.image_url && (
               <div className="h-40 w-full bg-gray-200 dark:bg-white/5 relative border-b border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
                 <img src={cert.image_url} alt={cert.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-blue-100/30 dark:bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500" />
               </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
              {!cert.image_url && (
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Award size={24} />
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{cert.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{cert.issuer}</p>
              <p className="text-gray-500 text-sm mt-4 font-semibold">{cert.year}</p>

              {isAdmin && (
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <button onClick={() => openEditModal(cert)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"><Pencil size={14}/></button>
                  <button onClick={() => remove(cert.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg transition-colors"><Trash2 size={14}/></button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Certification" : "Add Certification"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Certificate Image</label>
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
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Credential ID</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.issuer}
              onChange={e => setForm({...form, issuer: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Year</label>
            <input
              required
              type="text"
              className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
              value={form.year}
              onChange={e => setForm({...form, year: e.target.value})}
              placeholder="e.g. 2023"
            />
          </div>
          <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors mt-2">
            {isEditing ? "Save Changes" : "Add Certification"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
