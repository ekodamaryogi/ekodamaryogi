'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Linkedin, Github, Mail, Instagram, ChevronRight, Download, Pencil, File as FileIcon } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCRUD } from '@/hooks/useCRUD';
import { useState, useRef } from 'react';
import Modal from '@/components/Modal';

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
    <div className="flex flex-col items-center max-w-3xl mx-auto w-full">

      {/* Hero Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } }
        }}
        className="w-full flex flex-col items-center text-center mt-12"
      >
        <motion.div 
          variants={fadeUp} 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-32 h-32 md:w-40 md:h-40 mb-6 rounded-full overflow-hidden border-4 border-gray-200 dark:border-white/10 shadow-2xl hover:shadow-cyber-hover transition-shadow duration-300 cursor-pointer"
        >
          <img src="/profile.png" alt="Eko Damar Yogi" className="w-full h-full object-cover" />
        </motion.div>


        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
          Eko Damar Yogi
        </motion.h1>

        <motion.h2 variants={fadeUp} className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-medium mb-6">
          Bachelor of Mathematics, Faculty of Science and Mathematics 
          <br />Diponegoro University
        </motion.h2>

        <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          Mathematics graduate with a strong interest in data processing and analysis. Possesses strong and systematic analytical and problem-solving skills, with the ability to adapt to dynamic work environments and collaborate effectively within a team. Experienced in data processing, analysis, visualization, and dashboard development to support data-driven decision-making.
        </motion.p>

        <motion.div variants={fadeUp} className="flex gap-4 mb-16">
          {[
            { icon: Linkedin, href: '#' },
            { icon: Github, href: '#' },
            { icon: Instagram, href: '#' },
            { icon: Mail, href: 'mailto:eko@example.com' }
          ].map((social, i) => (
            <Link
              key={i}
              href={social.href}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-cyber-blue dark:hover:text-cyber-blue hover:bg-gray-100 dark:hover:bg-white/10 transition-all transform hover:-translate-y-1 hover:shadow-cyber"
            >
              <social.icon size={20} />
            </Link>
          ))}
        </motion.div>
      </motion.div>

      {/* Get to know me */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full mb-16"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-gray-300 dark:bg-cyber-blue/30 flex-grow"></div>
          <h3 className="text-2xl font-semibold tracking-wide text-gray-800 dark:text-white">Get to know me</h3>
          <div className="h-px bg-gray-300 dark:bg-cyber-blue/30 flex-grow"></div>
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          Explore my background, technical expertise, past projects, and academic certifications.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { name: 'Skill', path: '/skill' },
            { name: 'Experience', path: '/experience' },
            { name: 'Projects', path: '/projects' },
            { name: 'Certification', path: '/certification' }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="glass-card p-6 flex items-center justify-between group"
            >
              <span className="text-lg font-medium text-gray-800 dark:text-gray-100 group-hover:text-cyber-blue dark:group-hover:text-cyber-blue transition-colors">{item.name}</span>
              <ChevronRight className="text-gray-400 dark:text-gray-500 group-hover:text-cyber-blue dark:group-hover:text-cyber-blue transform group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

      </motion.div>

      {/* Download CV Section at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex flex-col items-center justify-center mt-8 mb-8"
      >
        <div className="flex items-center gap-4">
          <a
            href={currentCV?.file_url || '#'}
            download
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-gray-900 dark:text-white bg-white/50 dark:bg-cyber-accent border border-gray-300 dark:border-cyber-blue/50 rounded-xl overflow-hidden hover:bg-gray-100 dark:hover:bg-cyber-dark transition-all duration-300 shadow-md dark:hover:shadow-cyber-hover dark:hover:border-cyber-blue"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-500 dark:bg-cyber-blue rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center gap-2">
              <Download size={18} /> Download CV
            </span>
          </a>

          {isAdmin && (
            <button
              onClick={() => setIsCVModalOpen(true)}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyber-blue bg-white/80 dark:bg-cyber-dark border border-gray-200 dark:border-white/10 rounded-xl dark:hover:border-cyber-blue/50 transition-all shadow-md dark:shadow-lg dark:hover:shadow-cyber"
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
              <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-cyber-dark/50 border-gray-300 dark:border-white/10 hover:border-blue-500 dark:hover:border-cyber-blue hover:bg-gray-100 dark:hover:bg-cyber-accent/30 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileIcon className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                </div>
                <input id="cv-upload" type="file" ref={fileInputRef} className="hidden" required accept=".pdf,.doc,.docx,image/*" />
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-100 dark:bg-cyber-blue/20 hover:bg-blue-200 dark:hover:bg-cyber-blue/40 text-blue-600 dark:text-cyber-blue border border-blue-600 dark:border-cyber-blue font-medium py-3 rounded-xl transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:shadow-cyber"
          >
            {isUploading ? "Uploading..." : "Save CV"}
          </button>
        </form>
      </Modal>

    </div>
  );
}
