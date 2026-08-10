'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Skill', path: '/skill' },
  { name: 'Experience', path: '/experience' },
  { name: 'Projects', path: '/projects' },
  { name: 'Certification', path: '/certification' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === '/') return null;

  return (
    <nav className="sticky top-0 z-50 w-full flex justify-center pt-6 px-4 mb-8">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-full px-6 py-3 flex items-center justify-between gap-4 w-full max-w-4xl border border-cyber-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
      >
        {/* Profile Info */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-cyber-dark flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white border-2 border-gray-300 dark:border-cyber-blue/50 group-hover:border-blue-500 dark:group-hover:border-cyber-blue dark:group-hover:shadow-cyber transition-all overflow-hidden">
            <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="font-mono font-bold tracking-wider hidden md:block text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyber-blue transition-colors">
            Eko Damar Yogi
          </span>
        </Link>

        {/* Links */}
        <div className="flex item-center justify-center gap-0.5 lg:gap-1 flex-1 min-w-0 overflow-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap font-mono ${
                  isActive ? 'text-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.3)] bg-cyber-blue/10' : 'text-gray-400 hover:text-cyber-blue'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors dark:text-white text-gray-900 shrink-0"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </motion.div>
    </nav>
  );
}
