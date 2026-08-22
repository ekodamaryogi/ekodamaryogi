'use client';

import { useCRUD } from '@/hooks/useCRUD';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus, Briefcase } from 'lucide-react';
import { useState, useMemo } from 'react';
import Modal from '@/components/Modal';

export default function ExperienceSection() {
  const { data, add, remove, update, isLoading } = useCRUD<{id: string, role: string, company: string, period: string, desc: string}>('experience');
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    role: '',
    company: '',
    startMonth: '01',
    startYear: new Date().getFullYear().toString(),
    endMonth: '01',
    endYear: new Date().getFullYear().toString(),
    isCurrent: false,
    desc: ''
  });

  const openAddModal = () => {
    setIsEditing(null);
    setForm({
      role: '',
      company: '',
      startMonth: '01',
      startYear: new Date().getFullYear().toString(),
      endMonth: '01',
      endYear: new Date().getFullYear().toString(),
      isCurrent: false,
      desc: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(item.id);
    let startMonth = '01', startYear = new Date().getFullYear().toString();
    let endMonth = '01', endYear = new Date().getFullYear().toString();
    let isCurrent = false;

    try {
      // Try to parse the JSON format
      const parsedPeriod = JSON.parse(item.period);
      if (parsedPeriod.start) {
        const [y, m] = parsedPeriod.start.split('-');
        startYear = y;
        startMonth = m;
      }
      if (parsedPeriod.end === 'present') {
        isCurrent = true;
      } else if (parsedPeriod.end) {
        const [y, m] = parsedPeriod.end.split('-');
        endYear = y;
        endMonth = m;
      }
    } catch (e) {
      // Fallback if it's the old plain text format
      console.warn("Legacy period format detected");
    }

    setForm({
      role: item.role,
      company: item.company,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrent,
      desc: item.desc
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const periodObj = {
      start: `${form.startYear}-${form.startMonth}`,
      end: form.isCurrent ? 'present' : `${form.endYear}-${form.endMonth}`
    };

    const payload = {
      role: form.role,
      company: form.company,
      period: JSON.stringify(periodObj),
      desc: form.desc
    };

    if (isEditing) {
      update(isEditing, payload);
    } else {
      add(payload);
    }
    setIsModalOpen(false);
  };



  // Formatter helper
  const formatPeriod = (periodStr: string) => {
    try {
      const p = JSON.parse(periodStr);
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

      const formatMonthYear = (dateStr: string) => {
        if (dateStr === 'present') return 'Sekarang';
        const [y, m] = dateStr.split('-');
        return `${months[parseInt(m) - 1]} ${y}`;
      };

      if (p.start && p.end) {
        return `${formatMonthYear(p.start)} - ${formatMonthYear(p.end)}`;
      }
      return periodStr;
    } catch(e) {
      return periodStr; // Legacy text fallback
    }
  };

  // Helper to parse period and sort data
  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      let endA = 0; // default to oldest
      let endB = 0;

      try {
        const pA = JSON.parse(a.period);
        if (pA.end === 'present') {
          endA = Infinity; // Present is always newest
        } else if (pA.end) {
          endA = new Date(`${pA.end}-01`).getTime();
        }
      } catch(e) {
        // Fallback for old text-based data
      }

      try {
        const pB = JSON.parse(b.period);
        if (pB.end === 'present') {
          endB = Infinity;
        } else if (pB.end) {
          endB = new Date(`${pB.end}-01`).getTime();
        }
      } catch(e) {
        // Fallback
      }

      // Sort descending (newest first)
      return endB - endA;
    });
  }, [data]);

  return (
    <motion.section id="experience" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="w-full pt-20 mt-8 max-w-4xl mx-auto scroll-mt-24">
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
        {!isLoading && sortedData.map((exp, index) => (
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
                  {formatPeriod(exp.period)}
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
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Date</label>
            <div className="flex gap-2">
              <select
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                value={form.startMonth}
                onChange={e => setForm({...form, startMonth: e.target.value})}
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              <input
                type="number"
                required
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                value={form.startYear}
                onChange={e => setForm({...form, startYear: e.target.value})}
                placeholder="Year (e.g. 2020)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">End Date</label>
            <div className="flex gap-2 mb-2 items-center">
              <input
                type="checkbox"
                id="isCurrent"
                checked={form.isCurrent}
                onChange={e => setForm({...form, isCurrent: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isCurrent" className="text-sm font-medium dark:text-gray-300 cursor-pointer">Sekarang (Present)</label>
            </div>
            {!form.isCurrent && (
              <div className="flex gap-2">
                <select
                  className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                  value={form.endMonth}
                  onChange={e => setForm({...form, endMonth: e.target.value})}
                >
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
                <input
                  type="number"
                  required={!form.isCurrent}
                  className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 p-3 rounded-xl text-gray-900 dark:text-white"
                  value={form.endYear}
                  onChange={e => setForm({...form, endYear: e.target.value})}
                  placeholder="Year (e.g. 2023)"
                />
              </div>
            )}
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
    </motion.section>
  );
}
