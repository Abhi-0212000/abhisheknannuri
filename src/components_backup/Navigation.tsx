import React, { useState, useEffect } from 'react';
import { Cpu, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  currentTheme: 'light' | 'dark';
  onChangeTheme: (theme: 'light' | 'dark') => void;
}

export default function Navigation({ currentTheme, onChangeTheme }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    onChangeTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'ABOUT', id: 'about-section' },
    { label: 'RESEARCH', id: 'research-section' },
    { label: 'PUBLICATIONS', id: 'publications-section' },
    { label: 'PROJECTS', id: 'projects-section' },
    { label: 'TIMELINE', id: 'timeline-section' },
    { label: 'EXPERTISE', id: 'expertise-section' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-brand-bg/85 backdrop-blur-md border-b border-brand-border py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo / Tech branding */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer group"
          id="nav-logo"
        >
          <div className="h-8 w-8 rounded bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center group-hover:border-brand-accent transition-all">
            <Cpu className="w-4 h-4 text-brand-accent group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <span className="font-display text-sm font-bold text-brand-text-main tracking-wider block transition-colors">
              ABHISHEK NANNURI
            </span>
            <span className="block text-[9.5px] font-mono text-brand-text-muted tracking-widest uppercase transition-colors">
              Robotics Systems Engineer
            </span>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-5 bg-brand-card/40 border border-brand-border rounded-full px-5 py-1.5 transition-colors">
            {navLinks.map(link => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => scrollToSection(link.id)}
                className="text-[10px] font-mono text-brand-text-muted hover:text-brand-accent tracking-widest transition-colors font-medium cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-desktop"
            className="p-2 rounded-full border border-brand-border bg-brand-card/40 text-brand-text-muted hover:text-brand-accent hover:border-brand-accent/40 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => scrollToSection('contact-section')}
            id="nav-ping-btn"
            className="flex items-center gap-1.5 bg-brand-accent/10 hover:bg-brand-accent hover:text-white dark:hover:text-black border border-brand-accent/20 px-4 py-2 rounded-full text-xs font-mono font-semibold text-brand-accent transition-all duration-300 cursor-pointer"
          >
            PING_NODE
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Theme Switcher Button Mobile */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-mobile"
            className="p-1.5 rounded border border-brand-border bg-brand-card text-brand-text-muted hover:text-brand-accent transition-all"
            aria-label="Toggle Theme"
          >
            {currentTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-trigger"
            className="p-1.5 bg-brand-card border border-brand-border text-brand-text-muted hover:text-brand-text-main rounded"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-bg border-b border-brand-border p-4 space-y-3 shadow-xl" id="mobile-dropdown">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                id={`mobile-nav-link-${link.id}`}
                onClick={() => scrollToSection(link.id)}
                className="text-left py-2 px-3 text-xs font-mono text-brand-text-muted hover:text-brand-accent hover:bg-brand-card/40 rounded tracking-wider transition-all"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact-section')}
              id="mobile-nav-ping-btn"
              className="text-center mt-2 py-2 px-3 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded font-mono text-xs font-semibold"
            >
              PING_NODE (CONNECT)
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
