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
      return periodStr;
    }
  };

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      let endA = 0;
      let endB = 0;

      try {
        const pA = JSON.parse(a.period);
        if (pA.end === 'present') {
          endA = Infinity;
        } else if (pA.end) {
          endA = new Date(`${pA.end}-01`).getTime();
        }
      } catch(e) {}

      try {
        const pB = JSON.parse(b.period);
        if (pB.end === 'present') {
          endB = Infinity;
        } else if (pB.end) {
          endB = new Date(`${pB.end}-01`).getTime();
        }
      } catch(e) {}

      return endB - endA;
    });
  }, [data]);

  return (
    <motion.section id="experience" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="w-full pt-20 mt-8 max-w-4xl mx-auto scroll-mt-24">
      <div className="flex justify-between items-center mb-8 border-b border-purple-500/30 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 neon-text-violet">
          <span className="w-2.5 h-8 bg-purple-500 rounded-full neon-glow-violet"></span>
          Experience
        </h1>
        {isAdmin && (
          <button onClick={openAddModal} className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all neon-glow-violet">
            <Plus size={16} /> Add Experience
          </button>
        )}
      </div>

      {isLoading && <p className="text-purple-400/80 text-center py-8 font-mono">Loading timeline data...</p>}

      <div className="relative border-l border-purple-500/30 ml-4 md:ml-6 space-y-12">
        {!isLoading && sortedData.map((exp, index) => {
          const isMagenta = index % 2 === 1;
          const cardClass = isMagenta ? 'cyber-card-magenta hover:neon-glow-magenta border-pink-500/30' : 'cyber-card-violet hover:neon-glow-violet border-purple-500/30';
          const titleColor = isMagenta ? 'group-hover:text-pink-400' : 'group-hover:text-purple-400';
          const dotBorder = isMagenta ? 'border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'border-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]';

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-3.5 top-1.5 w-7 h-7 bg-white dark:bg-black rounded-full flex items-center justify-center border-2 ${dotBorder} transition-all`}>
                <Briefcase size={12} className="text-purple-400" />
              </div>

              <div className={`glass-card p-6 rounded-2xl transition-all duration-300 ${cardClass}`}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-1 transition-colors ${titleColor}`}>{exp.role}</h3>
                    <h4 className="text-cyan-400/90 font-medium font-mono text-sm">{exp.company}</h4>
                  </div>
                  <span className="text-xs font-semibold bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full text-purple-300 mt-2 md:mt-0 whitespace-nowrap font-mono neon-glow-violet">
                    {formatPeriod(exp.period)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap font-light">
                  {exp.desc}
                </p>

                {isAdmin && (
                  <div className="flex gap-2 mt-6 justify-end pt-4 border-t border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(exp)} className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-500 dark:text-gray-300 hover:text-purple-300 transition-colors"><Pencil size={16}/></button>
                    <button onClick={() => remove(exp.id)} className="p-2 hover:bg-pink-500/20 text-gray-500 dark:text-gray-300 hover:text-pink-400 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Experience" : "Add Experience"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Role Title</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/40 border border-purple-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-purple-400 outline-none"
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Company</label>
            <input
              required
              className="w-full bg-gray-100 dark:bg-black/40 border border-purple-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-purple-400 outline-none"
              value={form.company}
              onChange={e => setForm({...form, company: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Date</label>
            <div className="flex gap-2">
              <select
                className="w-full bg-gray-100 dark:bg-black/40 border border-purple-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-purple-400 outline-none"
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
                className="w-full bg-gray-100 dark:bg-black/40 border border-purple-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-purple-400 outline-none"
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
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <label htmlFor="isCurrent" className="text-sm font-medium dark:text-gray-300 cursor-pointer">Sekarang (Present)</label>
            </div>
            {!form.isCurrent && (
              <div className="flex gap-2">
                <select
                  className="w-full bg-gray-100 dark:bg-black/40 border border-purple-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-purple-400 outline-none"
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
                  className="w-full bg-gray-100 dark:bg-black/40 border border-purple-500/30 p-3 rounded-xl text-gray-900 dark:text-white focus:border-purple-400 outline-none"
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
              className="w-full bg-gray-100 dark:bg-black/40 border border-purple-500/30 p-3 rounded-xl text-gray-900 dark:text-white min-h-[100px] focus:border-purple-400 outline-none"
              value={form.desc}
              onChange={e => setForm({...form, desc: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 font-medium py-3 rounded-xl transition-colors mt-2 neon-glow-violet">
            {isEditing ? "Save Changes" : "Add Experience"}
          </button>
        </form>
      </Modal>
    </motion.section>
  );
}
