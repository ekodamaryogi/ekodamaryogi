'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <img src="/profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="font-mono font-bold tracking-wider hidden md:block text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyber-blue transition-colors">
            Eko Damar Yogi
          </span>
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex item-center justify-center gap-0.5 lg:gap-1 flex-1 min-w-0 overflow-hidden">
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

        {/* Home Link Mobile */}
        <div className="flex md:hidden item-center justify-center flex-1 min-w-0">
           <Link
              href="/"
              className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap font-mono ${
                pathname === '/' ? 'text-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.3)] bg-cyber-blue/10' : 'text-gray-400 hover:text-cyber-blue'
              }`}
            >
              {pathname === '/' && (
                <motion.div
                  layoutId="active-pill-mobile"
                  className="absolute inset-0 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="relative z-10">Home</span>
            </Link>
        </div>

        {/* Right Section (Theme Toggle & Mobile Menu) */}
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors dark:text-white text-gray-900 shrink-0"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors dark:text-white text-gray-900 shrink-0"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-4 py-2 w-48 glass rounded-2xl border border-cyber-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] flex flex-col md:hidden"
              >
                {navItems.filter(item => item.name !== 'Home').map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 text-sm font-medium transition-colors font-mono hover:bg-cyber-blue/10 ${
                        isActive ? 'text-cyber-blue' : 'text-gray-900 dark:text-gray-300 dark:hover:text-cyber-blue'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </nav>
  );
}
