'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/components/Modal';

export type ProjectLink = { name: string; url: string };

export type ProjectData = {
  id: string;
  title: string;
  desc: string;
  link: string; // Legacy
  links?: ProjectLink[];
  project_date?: string;
  category?: string;
  tools?: string;
  role?: string;
  project_type?: string;
  image_url?: string;
};

export default function ProjectsPage() {
  const { data, add, remove, update, uploadImage, isLoading } = useCRUD<ProjectData>('projects');
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [form, setForm] = useState<Omit<ProjectData, 'id'>>({
    title: '', desc: '', link: '', image_url: '',
    links: [{ name: 'View Project', url: '' }],
    project_date: '', category: '', tools: '', role: '', project_type: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const openDetailPopup = (project: ProjectData) => {
    setSelectedProject(project);
    setIsDetailPopupOpen(true);
  };

  const openAddModal = () => {
    setIsEditing(null);
    setForm({
      title: '', desc: '', link: '', image_url: '',
      links: [{ name: 'View Project', url: '' }],
      project_date: '', category: '', tools: '', role: '', project_type: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ProjectData) => {
    setIsEditing(item.id);

    // Handle backward compatibility for links
    let initialLinks = item.links && item.links.length > 0 ? item.links : [];
    if (initialLinks.length === 0 && item.link) {
      initialLinks = [{ name: 'View Project', url: item.link }];
    } else if (initialLinks.length === 0) {
      initialLinks = [{ name: 'View Project', url: '' }];
    }

    setForm({
      title: item.title,
      desc: item.desc,
      link: item.link,
      image_url: item.image_url || '',
      links: initialLinks,
      project_date: item.project_date || '',
      category: item.category || '',
      tools: item.tools || '',
      role: item.role || '',
      project_type: item.project_type || ''
    });
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

    // Ensure the legacy 'link' field gets the first link's url if available
    const formToSubmit = { ...form };
    if (formToSubmit.links && formToSubmit.links.length > 0) {
      formToSubmit.link = formToSubmit.links[0].url;
    }

    if (isEditing) {
      update(isEditing, formToSubmit);
    } else {
      add(formToSubmit);
    }
    setIsModalOpen(false);
  };

  const handleLinkChange = (index: number, field: 'name' | 'url', value: string) => {
    if (!form.links) return;
    const newLinks = form.links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setForm({ ...form, links: newLinks });
  };

  const addLink = () => {
    setForm({ ...form, links: [...(form.links || []), { name: '', url: '' }] });
  };

  const removeLink = (index: number) => {
    if (!form.links || form.links.length <= 1) return;
    const newLinks = form.links.filter((_, i) => i !== index);
    setForm({ ...form, links: newLinks });
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
            className="glass-card flex flex-col overflow-hidden group hover:border-blue-400/50 dark:hover:border-cyber-blue/50 transition-colors cursor-pointer"
            onClick={() => openDetailPopup(project)}
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
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-3">{project.desc}</p>

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-white/5 pb-2">
                {(project.links && project.links.length > 0 ? project.links : [{ name: 'View Project', url: project.link }]).map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 dark:text-cyber-blue hover:text-blue-800 dark:hover:text-cyber-blue/80 dark:hover:shadow-cyber text-sm font-medium flex items-center gap-1 transition-all"
                  >
                    {link.name} <ExternalLink size={12} />
                  </a>
                ))}
              </div>

              {isAdmin && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 z-10 bg-white/80 dark:bg-black/50 p-1 rounded-xl backdrop-blur-sm">
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(project); }} className="p-1.5 hover:bg-blue-100 dark:hover:bg-cyber-blue/20 rounded-lg text-gray-500 hover:text-blue-600 dark:hover:text-cyber-blue transition-colors"><Pencil size={14}/></button>
                  <button onClick={(e) => { e.stopPropagation(); remove(project.id); }} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14}/></button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Detail Popup */}
      <Modal isOpen={isDetailPopupOpen} onClose={() => setIsDetailPopupOpen(false)} title="Project Details">
        {selectedProject && (
          <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {selectedProject.image_url && (
              <div className="w-full h-64 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-white/10">
                <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedProject.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedProject.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
              {selectedProject.project_date && (
                <div>
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Project Date</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedProject.project_date}</span>
                </div>
              )}
              {selectedProject.category && (
                <div>
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedProject.category}</span>
                </div>
              )}
              {selectedProject.tools && (
                <div>
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Technology / Tools</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedProject.tools}</span>
                </div>
              )}
              {selectedProject.role && (
                <div>
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Role</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedProject.role}</span>
                </div>
              )}
              {selectedProject.project_type && (
                <div>
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Project Type</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedProject.project_type}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Project Links</h3>
              <div className="flex flex-wrap gap-3">
                {(selectedProject.links && selectedProject.links.length > 0 ? selectedProject.links : [{ name: 'View Project', url: selectedProject.link }]).map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 dark:bg-cyber-blue/10 hover:bg-blue-100 dark:hover:bg-cyber-blue/20 text-blue-600 dark:text-cyber-blue px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all border border-blue-200 dark:border-cyber-blue/30 dark:hover:shadow-cyber"
                  >
                    {link.name} <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Project Date</label>
              <input
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                value={form.project_date || ''}
                onChange={e => setForm({...form, project_date: e.target.value})}
                placeholder="e.g. Jan 2025 - Feb 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
              <input
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                value={form.category || ''}
                onChange={e => setForm({...form, category: e.target.value})}
                placeholder="e.g. Web Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Technology / Tools</label>
              <input
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                value={form.tools || ''}
                onChange={e => setForm({...form, tools: e.target.value})}
                placeholder="e.g. React, Next.js, Tailwind"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Role</label>
              <input
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                value={form.role || ''}
                onChange={e => setForm({...form, role: e.target.value})}
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Project Type</label>
              <input
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                value={form.project_type || ''}
                onChange={e => setForm({...form, project_type: e.target.value})}
                placeholder="e.g. Personal Project"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Links</label>
            <div className="flex flex-col gap-3">
              {form.links?.map((linkItem, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      required
                      className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                      value={linkItem.name}
                      onChange={e => handleLinkChange(index, 'name', e.target.value)}
                      placeholder={index === 0 ? "View Project" : `Link ${index + 1} Name`}
                    />
                    <input
                      required
                      className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                      value={linkItem.url}
                      onChange={e => handleLinkChange(index, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  {index > 0 && (
                    <button type="button" onClick={() => removeLink(index)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLink} className="self-start text-sm font-medium text-blue-600 dark:text-cyber-blue hover:underline flex items-center gap-1 mt-1">
                <Plus size={14} /> Tambahkan Link
              </button>
            </div>
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
