import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Sparkles } from 'lucide-react';
import ProUniverse from './professional/pages/ProUniverse';
import PersonalUniverse from './personal/pages/PersonalUniverse';

export default function App() {
  const [universe, setUniverse] = useState<'professional' | 'personal'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('universe');
      if (stored === 'professional' || stored === 'personal') return stored;
    }
    return 'professional';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const storedUniverse = localStorage.getItem('universe') || 'professional';
      const storedTheme = localStorage.getItem(`theme-${storedUniverse}`);
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;

      const storedGeneral = localStorage.getItem('theme');
      if (storedGeneral === 'light' || storedGeneral === 'dark') return storedGeneral;
      
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Switch universe state and default themes
  useEffect(() => {
    localStorage.setItem('universe', universe);
    const storedTheme = localStorage.getItem(`theme-${universe}`);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    } else {
      // Default: personal space to light, professional space to dark
      setTheme(universe === 'personal' ? 'light' : 'dark');
    }
  }, [universe]);

  // Set document level class name for dark/light themes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    localStorage.setItem(`theme-${universe}`, theme);
  }, [theme, universe]);

  return (
    <>
      <AnimatePresence mode="wait">
        {universe === 'personal' ? (
          <motion.div
            key="personal-universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="min-h-screen personal-universe"
          >
            <PersonalUniverse 
              onToggleUniverse={() => setUniverse('professional')} 
              currentTheme={theme} 
              onChangeTheme={setTheme} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="professional-universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="min-h-screen pro-universe"
          >
            <ProUniverse 
              onToggleUniverse={() => setUniverse('personal')} 
              currentTheme={theme} 
              onChangeTheme={setTheme} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Root-Level Unified Floating Switcher Button */}
      <div className="fixed bottom-6 right-6 z-[999] pointer-events-auto select-none">
        {universe === 'professional' ? (
          <button
            onClick={() => setUniverse('personal')}
            className="flex items-center gap-2 bg-[#FEF9E7] hover:bg-[#FAF0D0] text-[#2D2A26] border-2 border-[#2D2A26] font-sketch text-lg sm:text-xl font-bold px-6 py-3 rounded-full shadow-[6px_6px_0px_#2D2A26] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#2D2A26] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-250 cursor-pointer"
            title="Switch to Personal Sketchbook Space"
          >
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            Go to Personal Space 🎨
          </button>
        ) : (
          <button
            onClick={() => setUniverse('professional')}
            className="flex items-center gap-2 bg-[#0C1510]/95 hover:bg-[#111F17] text-[#10B981] font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-xl border-2 border-[#10B981]/50 hover:border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Switch back to Professional Space"
          >
            <Cpu className="w-4 h-4 text-[#10B981] animate-spin-slow" />
            <span>[SYSTEM_RESTORE] BACK_TO_ROBOTS 🤖</span>
          </button>
        )}
      </div>
    </>
  );
}
