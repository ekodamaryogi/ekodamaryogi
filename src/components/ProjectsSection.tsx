'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

export type ProjectLink = { name: string; url: string };

export default function ProjectsSection() {
  const { data, add, remove, update, uploadImage, isLoading } = useCRUD<{id: string, title: string, desc: string, link?: string, links: ProjectLink[], image_url?: string}>('projects');
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState<{title: string, desc: string, links: ProjectLink[], image_url: string}>({ title: '', desc: '', links: [{name: 'View Project', url: ''}], image_url: '' });
  const [isUploading, setIsUploading] = useState(false);

  // State for project detail popup
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const openAddModal = () => {
    setIsEditing(null);
    setForm({ title: '', desc: '', links: [{name: 'View Project', url: ''}], image_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(item.id);
    let initialLinks = item.links || [];
    if (initialLinks.length === 0 && item.link) {
      initialLinks = [{ name: 'View Project', url: item.link }];
    } else if (initialLinks.length === 0) {
      initialLinks = [{ name: 'View Project', url: '' }];
    }
    setForm({ title: item.title, desc: item.desc, links: initialLinks, image_url: item.image_url || '' });
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
    const cleanedForm = {
      ...form,
      links: form.links.filter(l => l.name.trim() !== '' && l.url.trim() !== '')
    };

    if (isEditing) {
      update(isEditing, cleanedForm);
    } else {
      add(cleanedForm);
    }
    setIsModalOpen(false);
  };

  const handleLinkChange = (index: number, field: 'name' | 'url', value: string) => {
    const newLinks = [...form.links];
    newLinks[index][field] = value;
    setForm({ ...form, links: newLinks });
  };

  const addLinkField = () => {
    setForm({ ...form, links: [...form.links, { name: '', url: '' }] });
  };

  const removeLinkField = (index: number) => {
    const newLinks = form.links.filter((_, i) => i !== index);
    setForm({ ...form, links: newLinks });
  };

  return (
    <motion.section id="projects" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="w-full pt-20 mt-8 scroll-mt-24">
      <div className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 neon-text-cyan">
          <span className="w-2.5 h-8 bg-cyan-400 rounded-full neon-glow-cyan"></span>
          Projects
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all neon-glow-cyan">
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {isLoading && <p className="text-cyan-400/80 text-center py-8 font-mono">Loading projects data...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading && data.map((project, index) => {
          const isMagenta = index % 2 === 1;
          const cardClass = isMagenta ? 'cyber-card-magenta hover:neon-glow-magenta border-pink-500/30' : 'cyber-card-cyan hover:neon-glow-cyan border-cyan-500/30';
          const titleHover = isMagenta ? 'group-hover:text-pink-400' : 'group-hover:text-cyan-400';

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card flex flex-col overflow-hidden group transition-all duration-300 ${cardClass}`}
            >
              {/* Project Image */}
              <div className="h-48 w-full bg-black/40 relative border-b border-white/5 flex items-center justify-center overflow-hidden">
                {project.image_url ? (
                  <>
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 opacity-85 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
                  </>
                ) : (
                  <span className="text-cyan-500/40 text-5xl font-extrabold font-mono group-hover:text-cyan-400 transition-colors">{project.title.charAt(0)}</span>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow bg-white/40 dark:bg-black/30 transition-colors cursor-pointer" onClick={() => setSelectedProject(project)}>
                <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors ${titleHover}`}>{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow line-clamp-3 font-light">{project.desc}</p>

                <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {(project.links?.length > 0 ? project.links : (project.link ? [{name: 'View Project', url: project.link}] : [])).map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-1 transition-all font-mono">
                        {link.name} <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                      <button onClick={(e) => { e.stopPropagation(); openEditModal(project); }} className="p-1.5 hover:bg-cyan-500/20 rounded-lg text-gray-500 hover:text-cyan-300 transition-colors"><Pencil size={14}/></button>
                      <button onClick={(e) => { e.stopPropagation(); remove(project.id); }} className="p-1.5 hover:bg-pink-500/20 rounded-lg text-gray-500 hover:text-pink-400 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Project Image</label>
            <div className="flex items-center gap-4">
              {form.image_url && (
                <div className="w-16 h-16 rounded overflow-hidden border border-cyan-500/30 shrink-0">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-cyan-500/30 rounded-xl cursor-pointer hover:bg-cyan-500/10 transition-colors">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
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
              className="w-full bg-gray-100 dark:bg-black/40 border border-cyan-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-cyan-400 outline-none"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Project Links</label>
            <div className="flex flex-col gap-3">
              {form.links.map((link, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-grow grid grid-cols-2 gap-2">
                    <input
                      required={index === 0}
                      className="w-full bg-gray-100 dark:bg-black/40 border border-cyan-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-cyan-400 outline-none"
                      value={link.name}
                      onChange={e => handleLinkChange(index, 'name', e.target.value)}
                      placeholder="e.g. View Project, GitHub"
                    />
                    <input
                      required={index === 0}
                      type="url"
                      className="w-full bg-gray-100 dark:bg-black/40 border border-cyan-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-cyan-400 outline-none"
                      value={link.url}
                      onChange={e => handleLinkChange(index, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  {form.links.length > 1 && (
                    <button type="button" onClick={() => removeLinkField(index)} className="p-3 text-pink-400 hover:bg-pink-500/10 rounded-xl transition-colors shrink-0">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLinkField} className="self-start text-sm font-medium text-cyan-400 hover:underline flex items-center gap-1 mt-1 font-mono">
                <Plus size={14} /> Tambahkan Link
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
            <textarea
              required
              className="w-full bg-gray-100 dark:bg-black/40 border border-cyan-500/30 p-3 rounded-xl text-gray-900 dark:text-white min-h-[100px] focus:border-cyan-400 outline-none"
              value={form.desc}
              onChange={e => setForm({...form, desc: e.target.value})}
            />
          </div>
          <button type="submit" disabled={isUploading} className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 text-cyan-300 border border-cyan-500/50 font-medium py-3 rounded-xl transition-colors mt-2 neon-glow-cyan">
            {isEditing ? "Save Changes" : "Add Project"}
          </button>
        </form>
      </Modal>

      {/* Project Detail Modal */}
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title="Project Details">
        {selectedProject && (
          <div className="flex flex-col gap-6">
            {selectedProject.image_url && (
              <div className="w-full bg-black/40 rounded-xl overflow-hidden flex items-center justify-center border border-cyan-500/30 relative h-64 md:h-80">
                <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-contain" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 neon-text-cyan">{selectedProject.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-light">{selectedProject.desc}</p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-cyan-400/80 uppercase tracking-wider font-mono">Project Links</h4>
              <div className="flex flex-wrap gap-4">
                {(selectedProject.links?.length > 0 ? selectedProject.links : (selectedProject.link ? [{name: 'View Project', url: selectedProject.link}] : [])).map((link: ProjectLink, idx: number) => (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-lg transition-all neon-glow-cyan font-mono text-sm">
                    <span className="font-medium">{link.name}</span>
                    <ExternalLink size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

    </motion.section>
  );
}
