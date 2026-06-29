import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Moon, Sun, Menu, X } from 'lucide-react';
import { useScrollSpy } from '../../hooks/useScrollSpy';

interface PersonalNavProps {
  currentTheme: 'light' | 'dark';
  onChangeTheme: (theme: 'light' | 'dark') => void;
}

export default function PersonalNav({ currentTheme, onChangeTheme }: PersonalNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Cinema Notes', id: 'cinema-section' },
    { label: 'The Library', id: 'library-section' },
    { label: 'Audio & Music', id: 'music-section' },
    { label: 'Deep Thoughts', id: 'thoughts-section' }
  ];

  const activeSectionId = useScrollSpy(navLinks.map(l => l.id));

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#FCF9F0]/95 dark:bg-[#121124]/95 backdrop-blur-md border-b-2 border-rose-200 dark:border-violet-950/40 py-3 shadow-md' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Handwritten Logo signature */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer group"
          id="personal-nav-logo"
        >
          <div className="h-8 w-8 rounded-lg border-2 border-[#2D2A26] dark:border-[#524B44] flex items-center justify-center bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
            <PenTool className="w-4 h-4 text-rose-500 rotate-[-10deg] group-hover:rotate-0 transition-transform" />
          </div>
          <div>
            <span className="font-sketch text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 block group-hover:text-violet-500 transition-colors">
              Abhishek's Sketchbook 🎨
            </span>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-current/50">
              Stage_02 // Personal Sketch Space
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-5 bg-[#FFFDF2] dark:bg-[#141226] border-2 border-[#2D2A26] dark:border-[#524B44] rounded-full px-5 py-1.5 shadow-sm">
            {navLinks.map(link => {
              const isActive = activeSectionId === link.id;
              return (
                <button 
                  key={link.id}
                  id={`personal-nav-link-${link.id}`}
                  onClick={() => handleScrollTo(link.id)} 
                  className={`text-[11px] font-sketch font-bold tracking-wide transition-colors cursor-pointer ${
                    isActive 
                      ? 'text-rose-500 scale-105' 
                      : 'text-current/80 hover:text-rose-500'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Hand-drawn Theme Switcher Button */}
          <button
            onClick={() => onChangeTheme(currentTheme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-full border-2 border-[#2D2A26] dark:border-[#524B44] bg-[#FFFDF2] dark:bg-[#141226] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-400 text-current/80 transition-all cursor-pointer shadow-sm"
            title="Switch Theme"
            id="personal-theme-toggle-desktop"
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => onChangeTheme(currentTheme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded border border-[#2D2A26] dark:border-[#524B44] bg-[#FFFDF2] dark:bg-[#141226] text-current/80"
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 border border-[#2D2A26] dark:border-[#524B44] bg-[#FFFDF2] dark:bg-[#141226] text-current/80 rounded"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#FAF8F2] dark:bg-[#1E1B18] border-b-2 border-[#2D2A26] dark:border-[#524B44] p-4 space-y-2 shadow-lg"
            id="personal-mobile-dropdown"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(link => {
                const isActive = activeSectionId === link.id;
                return (
                  <button
                    key={link.id}
                    id={`personal-mobile-nav-link-${link.id}`}
                    onClick={() => handleScrollTo(link.id)}
                    className={`text-left font-sketch text-lg py-2 px-3 rounded ${
                      isActive ? 'text-rose-500 bg-rose-500/5' : 'hover:bg-current/5'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
