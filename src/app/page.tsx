'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Linkedin, Github, Mail, Instagram, Download, Pencil, File as FileIcon } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCRUD } from '@/hooks/useCRUD';
import { useState, useRef } from 'react';
import Modal from '@/components/Modal';
import SkillSection from '@/components/SkillSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import CertificationSection from '@/components/CertificationSection';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const { isAdmin } = useAuth();
  const { data: cvData, add: addCV, update: updateCV, uploadImage } = useCRUD<{id: string, file_url: string}>('cv_settings');
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCV = cvData.length > 0 ? cvData[cvData.length - 1] : null;

  const handleCVUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    try {
      const file = fileInputRef.current.files[0];
      const url = await uploadImage(file);
      if (url) {
        if (currentCV) {
          await updateCV(currentCV.id, { file_url: url });
        } else {
          await addCV({ file_url: url });
        }
        setIsCVModalOpen(false);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen cyber-grid-bg">

      {/* Hero Section */}
      <motion.section
        id="home"
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } }
        }}
        className="w-full flex flex-col items-center text-center pt-12 pb-16 px-4 rounded-3xl cyber-banner-grid border border-cyan-500/10 shadow-2xl relative overflow-hidden"
      >
        <motion.div 
          variants={fadeUp} 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-32 h-32 md:w-40 md:h-40 mb-6 rounded-full overflow-hidden border-4 border-cyan-500/40 dark:border-cyan-400/60 neon-glow-cyan transition-all duration-300 cursor-pointer"
        >
          <img src="/6e3b9488-9a65-4db7-826a-6c78895cde70.jpg" alt="Eko Damar Yogi" className="w-full h-full object-cover" />
        </motion.div>


        <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white neon-text-cyan">
          Eko Damar Yogi
        </motion.h1>

        <motion.h2 variants={fadeUp} className="text-lg md:text-xl text-cyan-600 dark:text-cyan-400 font-semibold mb-6 tracking-wide">
          Bachelor of Mathematics, Faculty of Science and Mathematics 
          <br />
          <span className="text-pink-500 dark:text-pink-400 font-medium">Diponegoro University</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mb-8 font-light">
          Mathematics graduate with a strong interest in data processing and analysis. Possesses strong and systematic analytical and problem-solving skills, with the ability to adapt to dynamic work environments and collaborate effectively within a team. Experienced in data processing, analysis, visualization, and dashboard development to support data-driven decision-making.
        </motion.p>

        <motion.div variants={fadeUp} className="flex gap-4 mb-8">
          {[
            { icon: Linkedin, href: 'https://www.linkedin.com/in/eko-damar-yogi/', glowClass: 'hover:neon-glow-cyan hover:border-cyan-400' },
            { icon: Github, href: 'https://github.com/ekodamaryogi', glowClass: 'hover:neon-glow-violet hover:border-purple-400' },
            { icon: Instagram, href: 'https://www.instagram.com/eko.d.y_', glowClass: 'hover:neon-glow-magenta hover:border-pink-400' },
            { icon: Mail, href: 'mailto:eko@example.com', glowClass: 'hover:neon-glow-amber hover:border-amber-400' }
          ].map((social, i) => (
            <Link
              key={i}
              href={social.href}
              className={`w-12 h-12 rounded-full glass flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-cyan-400 dark:hover:text-cyan-300 transition-all transform hover:-translate-y-1 ${social.glowClass}`}
            >
              <social.icon size={20} />
            </Link>
          ))}
        </motion.div>
      </motion.section>

      {/* Sections */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 px-4">
        <SkillSection />
        <ExperienceSection />
        <ProjectsSection />
        <CertificationSection />
      </div>

      {/* Download CV Section at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex flex-col items-center justify-center mt-12 mb-12"
      >
        <div className="flex items-center gap-4">
          <a
            href={currentCV?.file_url || '#'}
            download
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-cyan-300 bg-white/70 dark:bg-black/60 border border-cyan-500/50 rounded-xl overflow-hidden hover:bg-cyan-500/10 transition-all duration-300 neon-glow-cyan"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-cyan-500/20 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="relative flex items-center gap-2">
              <Download size={18} /> Download CV
            </span>
          </a>

          {isAdmin && (
            <button
              onClick={() => setIsCVModalOpen(true)}
              className="p-3.5 text-gray-500 dark:text-cyan-400 hover:text-cyan-300 bg-white/70 dark:bg-black/60 border border-cyan-500/40 rounded-xl transition-all neon-glow-cyan"
              title="Edit CV"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Edit CV Modal */}
      <Modal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} title="Upload CV File">
        <form onSubmit={handleCVUpload} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300 text-gray-700">Select File (PDF, Word, or Image)</label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-black/40 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileIcon className="w-8 h-8 mb-2 text-cyan-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
                </div>
                <input id="cv-upload" type="file" ref={fileInputRef} className="hidden" required accept=".pdf,.doc,.docx,image/*" />
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/60 font-medium py-3 rounded-xl transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-cyan"
          >
            {isUploading ? "Uploading..." : "Save CV"}
          </button>
        </form>
      </Modal>

    </div>
  );
}
