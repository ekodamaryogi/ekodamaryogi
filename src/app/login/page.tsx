'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-gray-200 dark:border-cyber-blue/50 dark:shadow-cyber p-8 rounded-2xl max-w-md w-full text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-cyber-blue">System Access Granted</h2>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-500/20 dark:hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] font-mono py-3 rounded-xl transition-all"
          >
            TERMINATE_SESSION
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-gray-200 dark:border-cyber-blue/30 p-8 rounded-2xl max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 dark:via-cyber-blue to-transparent opacity-50"></div>
        <div className="flex justify-center mb-6 relative">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-cyber-dark border border-blue-500 dark:border-cyber-blue flex items-center justify-center text-blue-500 dark:text-cyber-blue shadow-sm dark:shadow-cyber">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 font-mono text-gray-900 dark:text-white">ROOT_ACCESS</h1>
        <p className="text-gray-500 dark:text-cyber-blue/70 text-center mb-8 font-mono text-sm">Enter credentials to bypass security protocols</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-gray-50 dark:bg-cyber-dark/80 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-500 dark:focus:border-cyber-blue focus:shadow-sm dark:focus:shadow-cyber transition-all text-gray-900 dark:text-white font-mono placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-gray-50 dark:bg-cyber-dark/80 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 dark:focus:border-cyber-blue focus:shadow-sm dark:focus:shadow-cyber transition-all text-gray-900 dark:text-white font-mono placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center font-mono">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-100 dark:bg-cyber-blue/10 hover:bg-blue-200 dark:hover:bg-cyber-blue/20 border border-blue-500 dark:border-cyber-blue text-blue-600 dark:text-cyber-blue font-mono py-3 rounded-xl transition-all hover:shadow-md dark:hover:shadow-cyber flex items-center justify-center gap-2"
          >
            Login <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
