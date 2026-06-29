import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Film, BookOpen, Heart, ArrowLeft, 
  Coffee, Music, Book, Info, PenTool, Sparkles, Scale, Globe,
  Menu, X, Headphones, MessageSquare, Compass, Quote,
  ChevronLeft, ChevronRight, Send, Trash2, Cpu
} from 'lucide-react';

interface PersonalUniverseProps {
  onToggleUniverse: () => void;
  currentTheme: 'light' | 'dark';
  onChangeTheme: (theme: 'light' | 'dark') => void;
}

interface Note {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  colorClass: string;
  textColor: string;
  rotation: string;
  category: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

// Polaroid Card Component matching EXACT specification
interface PolaroidCardProps {
  imgUrl: string;
  caption: string;
  subcaption?: string;
  rotationClass?: string;
  tapeColorClass?: string;
  cardBgClass?: string;
}

function PolaroidCard({ 
  imgUrl, 
  caption, 
  subcaption, 
  rotationClass = "rotate-1",
  tapeColorClass = "bg-[#FEF9E7]/60 dark:bg-amber-500/20 border-amber-300/35",
  cardBgClass = "bg-[#FAF8F5] dark:bg-[#1C1917]"
}: PolaroidCardProps) {
  return (
    <div className={`relative inline-block p-4 pb-8 ${cardBgClass} text-[#2D2A26] dark:text-[#EAE6DF] border-2 border-[#2D2A26] dark:border-[#524B44] transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 group ${rotationClass} shadow-[8px_8px_0px_#2D2A26] dark:shadow-[8px_8px_0px_rgba(0,0,0,0.6)]`}>
      {/* Hand-drawn Scotch Tape Effect: Semi-transparent CSS pseudo-element styled tape at top center */}
      <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-6 ${tapeColorClass} backdrop-blur-[0.5px] border-l border-r border-dashed border-[#2D2A26]/15 rotate-[-2deg] shadow-sm pointer-events-none`} />
      
      {/* Image container */}
      <div className="w-full aspect-[4/3] overflow-hidden border border-[#E6E1D8] dark:border-[#3E3832] bg-[#EAE6D8] dark:bg-[#2A2521]">
        <img 
          src={imgUrl} 
          alt={caption} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
        />
      </div>
      
      {/* Handwritten Caption in Caveat (font-sketch) */}
      <div className="mt-4 text-center">
        <p className="font-sketch text-2xl font-bold tracking-tight text-[#2D2A26] dark:text-[#EAE6DF] leading-none">
          {caption}
        </p>
        {subcaption && (
          <p className="text-[10px] font-mono mt-1 text-[#2D2A26]/50 dark:text-[#EAE6DF]/50 tracking-widest uppercase">
            {subcaption}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PersonalUniverse({ 
  onToggleUniverse, 
  currentTheme, 
  onChangeTheme 
}: PersonalUniverseProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Track Active Note in the interactive blog notebook desk
  const [activeNoteId, setActiveNoteId] = useState<string>('feminism');
  
  // Comments state for each note (stored in localStorage)
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Sticky notes data
  const notesList: Note[] = [
    {
      id: "feminism",
      title: "Feminism from a Male Perspective ⚖️",
      category: "SOCIETY",
      excerpt: "Why true gender equity is an urgent imperative for men, dismantle toxic metrics...",
      content: "Feminism is not simply a struggle for women; it is a profound human project that liberates men as well. Growing up, society bombards men with archaic metrics of value: emotional stoicism, dominance, and a refusal of vulnerability. True feminism dismantles these toxic paradigms. Supporting equal rights, wage equity, and fair social representation isn't just about 'helping' women—it is about restoring our collective human balance.\n\nAs someone deeply invested in scientific and social progress, I see that a world built on equitable foundations is the only world capable of navigating future planetary challenges. Equality is a mathematical and moral imperative.",
      colorClass: "bg-[#FEF9E7] dark:bg-[#2A2619] border-[#EADBB6] dark:border-[#4E4733]",
      textColor: "text-[#4A3E1B] dark:text-[#F3E7C4]",
      rotation: "-rotate-1"
    },
    {
      id: "perfect-day",
      title: "What constitutes a perfect day? ☕",
      category: "PHILOSOPHY",
      excerpt: "Crisp Bavarian morning air, slow coffee brew, and heavy books under a golden canopy...",
      content: "A perfect day starts in absolute, unbroken silence. Waking up early at 5:30 AM in Deggendorf when the fog still blankets the Danube. Brewing a slow, careful V60 pour-over coffee using freshly ground Ethiopian beans, watching the bloom expand. Sitting by a large window with two thick hardbacks: one on philosophy, another on human history.\n\nSpending the afternoon in a long, rhythmic hike through the Bavarian forest trails as the canopy filters the light into gold. Coming home, making a hot, humble meal, and sketching some notes or code outlines by hand under a warm desk lamp. No digital notifications, no algorithm fatigue—just pure, high-fidelity presence.",
      colorClass: "bg-[#EBFaf2] dark:bg-[#1A281E] border-[#C8E8D5] dark:border-[#304739]",
      textColor: "text-[#1C4027] dark:text-[#C5ECD4]",
      rotation: "rotate-1"
    },
    {
      id: "why-sketch",
      title: "The Split Personality 🎭",
      category: "METACOGNITION",
      excerpt: "Engineering without philosophy is hollow; balancing cold mechanics with a soft heart...",
      content: "This 'dual universe' represents a necessary psychological release. By day, my brain operates in a world of absolute, unyielding mathematical rigor—ROS2 trajectories, LiDAR sensors, and optimized C++ calculations. But science tells us how things work; it doesn't tell us why they matter.\n\nThe 'Sketchbook' is where I process life, literature, and art. It reminds me that technology is just a tool to amplify human experience. If our tools are engineered beautifully but lack a soft, empathetic human soul behind them, they become empty noise.",
      colorClass: "bg-[#FDEDEC] dark:bg-[#2E1B1B] border-[#F5C4C4] dark:border-[#523333]",
      textColor: "text-[#5D2525] dark:text-[#F4C1C1]",
      rotation: "-rotate-2"
    },
    {
      id: "human-rights",
      title: "Human Rights & Open Systems 🌐",
      category: "SOCIETY",
      excerpt: "Advocating for democratic technologies that prevent systemic biases...",
      content: "Technological systems are not neutral; they carry the values of those who build them. If advanced robotics and AI are deployed solely to expand corporate margins, they risk widening the global inequality gap.\n\nI believe deeply in open-source systems (like ROS/ROS2 and Linux) because they democratize knowledge, allowing a student in any part of the world to build on the same baseline. True human rights mean access to resources, access to dignity, and preventing algorithmic biases from dictating the physical security of human bodies.",
      colorClass: "bg-[#EBF5FB] dark:bg-[#18232D] border-[#C4DEF6] dark:border-[#2C3F4F]",
      textColor: "text-[#1E3E5B] dark:text-[#BFDAF1]",
      rotation: "rotate-2"
    }
  ];

  // Load comments from localStorage
  useEffect(() => {
    const loadedComments: Record<string, Comment[]> = {};
    notesList.forEach(note => {
      const saved = localStorage.getItem(`sketch-comments-${note.id}`);
      if (saved) {
        try {
          loadedComments[note.id] = JSON.parse(saved);
        } catch (e) {
          loadedComments[note.id] = [];
        }
      } else {
        loadedComments[note.id] = [];
      }
    });
    setComments(loadedComments);
  }, []);

  // Set up sticky scroll detect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Switch to next/prev notes
  const activeNoteIndex = notesList.findIndex(n => n.id === activeNoteId);
  const handlePrevNote = () => {
    const prevIndex = (activeNoteIndex - 1 + notesList.length) % notesList.length;
    setActiveNoteId(notesList[prevIndex].id);
  };
  const handleNextNote = () => {
    const nextIndex = (activeNoteIndex + 1) % notesList.length;
    setActiveNoteId(notesList[nextIndex].id);
  };

  // Add Comment Handler (Secure Local persistence)
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: newCommentAuthor.trim(),
      text: newCommentText.trim(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updatedComments = {
      ...comments,
      [activeNoteId]: [newComment, ...(comments[activeNoteId] || [])]
    };

    setComments(updatedComments);
    localStorage.setItem(`sketch-comments-${activeNoteId}`, JSON.stringify(updatedComments[activeNoteId]));
    
    // reset form fields
    setNewCommentAuthor('');
    setNewCommentText('');
  };

  const handleClearComments = () => {
    const updatedComments = {
      ...comments,
      [activeNoteId]: []
    };
    setComments(updatedComments);
    localStorage.removeItem(`sketch-comments-${activeNoteId}`);
  };

  const currentNote = notesList[activeNoteIndex] || notesList[0];

  return (
    <div className={`min-h-screen ${currentTheme === 'light' ? 'sketchbook-paper-light' : 'sketchbook-paper-dark'} text-[#2D2A26] dark:text-[#EAE6DF] transition-colors duration-300 font-sans relative selection:bg-rose-500 selection:text-white dark:selection:bg-violet-600 dark:selection:text-white overflow-x-hidden`}>
      
      {/* Hand-drawn cross-hatching textures over the digital paper - brings living physical desk depth */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${currentTheme === 'light' ? 'cross-hatch-overlay' : 'cross-hatch-overlay-dark'} opacity-[0.35] dark:opacity-[0.22]`} />

      {/* Excalidraw-like Dot Grid Background - Colorful in light and neon-glowing in dark */}
      <div className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: currentTheme === 'light' 
            ? 'radial-gradient(#D8A8D8 1.2px, transparent 1.2px)' 
            : 'radial-gradient(#8F3BF0 0.4px, transparent 0.4px)',
          backgroundSize: '28px 28px',
          opacity: currentTheme === 'light' ? 0.12 : 0.25
        }} 
      />

      {/* --- TOP HEADER NAVIGATION --- */}
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
          >
            <div className="h-8 w-8 rounded-lg border-2 border-[#2D2A26] dark:border-[#524B44] flex items-center justify-center bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
              <PenTool className="w-4 h-4 text-rose-500 rotate-[-10deg] group-hover:rotate-0 transition-transform" />
            </div>
            <div>
              <span className="font-sketch text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 block group-hover:text-violet-500 transition-colors">
                Abhishek's Sketchbook 🎨
              </span>
              <span className="block text-[8px] font-mono uppercase tracking-widest text-current/50">
                Stage_02 // Personal Sketch Universe
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links matching professional layout structure */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-5 bg-[#FFFDF2] dark:bg-[#141226] border-2 border-[#2D2A26] dark:border-[#524B44] rounded-full px-5 py-1 shadow-sm">
              <button 
                onClick={() => handleScrollTo('cinema-section')} 
                className="text-[11px] font-sketch font-bold text-current/80 hover:text-rose-500 tracking-wide transition-colors cursor-pointer"
              >
                Cinema Notes
              </button>
              <button 
                onClick={() => handleScrollTo('library-section')} 
                className="text-[11px] font-sketch font-bold text-current/80 hover:text-emerald-500 tracking-wide transition-colors cursor-pointer"
              >
                The Library
              </button>
              <button 
                onClick={() => handleScrollTo('music-section')} 
                className="text-[11px] font-sketch font-bold text-current/80 hover:text-violet-500 tracking-wide transition-colors cursor-pointer"
              >
                Audio & Music
              </button>
              <button 
                onClick={() => handleScrollTo('thoughts-section')} 
                className="text-[11px] font-sketch font-bold text-rose-600 dark:text-rose-400 hover:text-rose-500 tracking-wide transition-colors cursor-pointer"
              >
                Deep Thoughts
              </button>
            </div>

            {/* Hand-drawn Theme Switcher Button */}
            <button
              onClick={() => onChangeTheme(currentTheme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-full border-2 border-[#2D2A26] dark:border-[#524B44] bg-[#FFFDF2] dark:bg-[#141226] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-400 text-current/80 transition-all cursor-pointer shadow-sm"
              title="Switch Theme"
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
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleScrollTo('cinema-section')}
                  className="text-left font-sketch text-lg py-2 px-3 hover:bg-current/5 rounded"
                >
                  🎬 Cinema Notes
                </button>
                <button
                  onClick={() => handleScrollTo('library-section')}
                  className="text-left font-sketch text-lg py-2 px-3 hover:bg-current/5 rounded"
                >
                  📚 The Library
                </button>
                <button
                  onClick={() => handleScrollTo('music-section')}
                  className="text-left font-sketch text-lg py-2 px-3 hover:bg-current/5 rounded"
                >
                  🎧 Audio & Music
                </button>
                <button
                  onClick={() => handleScrollTo('thoughts-section')}
                  className="text-left font-sketch text-lg py-2 px-3 hover:bg-current/5 rounded"
                >
                  💡 Deep Thoughts
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO / WELCOME SECTION --- */}
      <header className="relative pt-32 pb-16 md:pt-40 md:pb-24 z-10 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-dashed border-[#2D2A26]/20 dark:border-[#524B44]/40 rounded-full bg-[#FAF8F2] dark:bg-[#1E1B18] text-xs font-mono">
            <Coffee className="w-3.5 h-3.5 text-brand-accent animate-bounce" />
            VITE_PORTAL: PERSONAL_SPACE.sh
          </div>
          <h1 className="font-sketch text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-[#2D2A26] dark:text-[#EAE6DF]">
            Welcome to my Sketchbook 📖
          </h1>
          <p className="font-sketch text-xl md:text-2xl text-current/70 max-w-xl mx-auto">
            A quiet analog space where I process films, literature, music, and deep social inquiries away from the rigid codes of robotics engineering.
          </p>
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT (STACKED SCROLLABLE) --- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-32 pb-32 relative z-10">
        
        {/* SECTION 1: CINEMA NOTES */}
        <section id="cinema-section" className="scroll-mt-24">
          <div className="p-8 sm:p-10 sketch-border-thick border-[#2D2A26] dark:border-rose-950/50 rounded-3xl bg-gradient-to-br from-[#FFF8F3] via-[#FFEBE9] to-[#FFFDF9] dark:from-[#211219] dark:via-[#190C1A] dark:to-[#100711] shadow-[8px_8px_0px_rgba(244,63,94,0.22)] dark:shadow-[8px_8px_0px_rgba(0,0,0,0.4)] relative overflow-hidden">
            {/* Scrapbook Tape decoration */}
            <div className="absolute top-0 left-8 w-24 h-5 bg-rose-400/30 dark:bg-rose-500/25 rotate-[-4deg] border-l border-r border-dashed border-[#2D2A26]/10" />
            
            <div className="border-b-2 border-dashed border-[#2D2A26]/15 dark:border-[#524B44]/25 pb-4 mb-10">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs uppercase tracking-widest">
                <Film className="w-3.5 h-3.5 animate-pulse" />
                <span className="highlight-amber px-2.5 py-0.5 text-[#2D2A26] dark:text-amber-100 font-bold">[SECTION_01] CINEMA_NOTES.md</span>
              </div>
              <h2 className="font-sketch text-4xl font-extrabold mt-2 text-amber-950 dark:text-amber-100">
                Cinematic Polaroids 🎬
              </h2>
              <p className="text-sm text-current/70 font-mono mt-1">
                A physical study wall tracking visual scale, emotional range, and adaptation horizons.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
              <PolaroidCard 
                imgUrl="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop" 
                caption="Interstellar" 
                subcaption="Peak VFX."
                rotationClass="-rotate-3"
                tapeColorClass="bg-red-400/80 dark:bg-red-500/30 border-red-400/40"
                cardBgClass="bg-[#FFFDF4] dark:bg-[#1E1915] border-red-300 dark:border-red-900/40 shadow-[6px_6px_0px_rgba(239,68,68,0.3)] dark:shadow-[6px_6px_0px_rgba(0,0,0,0.5)]"
              />
              <PolaroidCard 
                imgUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop" 
                caption="Project Hail Mary" 
                subcaption="Awaiting the adaptation."
                rotationClass="rotate-2"
                tapeColorClass="bg-teal-400/80 dark:bg-teal-500/30 border-teal-400/40"
                cardBgClass="bg-[#F2FAF0] dark:bg-[#111A13] border-teal-300 dark:border-teal-900/40 shadow-[6px_6px_0px_rgba(20,184,166,0.3)] dark:shadow-[6px_6px_0px_rgba(0,0,0,0.5)]"
              />
              <PolaroidCard 
                imgUrl="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop" 
                caption="The Pursuit of Happyness" 
                subcaption="Always gets me."
                rotationClass="-rotate-1"
                tapeColorClass="bg-amber-400/80 dark:bg-amber-500/30 border-amber-400/40"
                cardBgClass="bg-[#FFFDF0] dark:bg-[#211E11] border-amber-300 dark:border-amber-900/40 shadow-[6px_6px_0px_rgba(245,158,11,0.3)] dark:shadow-[6px_6px_0px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </section>


        {/* SECTION 2: THE LIBRARY */}
        <section id="library-section" className="scroll-mt-24">
          <div className="p-8 sm:p-10 sketch-border-thick border-[#2D2A26] dark:border-emerald-950/50 rounded-3xl bg-gradient-to-br from-[#F5FAF4] via-[#E6F4E2] to-[#FAFDF9] dark:from-[#0B150F] dark:via-[#070F0A] dark:to-[#080B09] shadow-[8px_8px_0px_rgba(16,185,129,0.22)] dark:shadow-[8px_8px_0px_rgba(0,0,0,0.4)] relative overflow-hidden">
            {/* Scrapbook Tape decoration */}
            <div className="absolute top-0 right-12 w-28 h-5 bg-emerald-400/30 dark:bg-emerald-500/20 rotate-[2deg] border-l border-r border-dashed border-[#2D2A26]/10" />

            <div className="border-b-2 border-dashed border-[#2D2A26]/15 dark:border-[#524B44]/25 pb-4 mb-10">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5 animate-pulse" />
                <span className="highlight-mint px-2.5 py-0.5 text-[#2D2A26] dark:text-emerald-100 font-bold">[SECTION_02] READING_LIST.txt</span>
              </div>
              <h2 className="font-sketch text-4xl font-extrabold mt-2 text-emerald-950 dark:text-emerald-100">
                The Reading Desk 📚
              </h2>
              <p className="text-sm text-current/70 font-mono mt-1">
                Literary guides pushing human cognition, systemic insights, and philosophical integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* 1984 */}
              <div className="flex flex-col md:flex-row gap-6 items-center p-6 border-2 border-emerald-300 dark:border-emerald-900 rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#F8F5EE] dark:from-[#111612] dark:to-[#0E120F] shadow-[6px_6px_0px_rgba(16,185,129,0.25)] dark:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] relative">
                <div className="w-36 shrink-0">
                  <PolaroidCard 
                    imgUrl="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop" 
                    caption="1984" 
                    subcaption="George Orwell"
                    rotationClass="-rotate-2"
                    tapeColorClass="bg-red-400/80 dark:bg-red-500/30 border-red-400/40"
                    cardBgClass="bg-[#FFFDF4] dark:bg-[#1C1814] border-red-300 dark:border-red-950/40"
                  />
                </div>
                <div className="space-y-3">
                  <span className="font-mono text-[9px] bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded border border-red-200 dark:border-red-800/40 font-semibold">
                    SOCIOLOGY_CORE
                  </span>
                  <h4 className="font-sketch text-2xl font-bold leading-none text-emerald-950 dark:text-emerald-50">
                    1984 by George Orwell
                  </h4>
                  <p className="text-sm leading-relaxed text-current/80">
                    <strong>"A manual or a warning?"</strong> Exposes how easily systematic structures can manipulate language to erase collective truth. Reminds us to guard and defend factual logic at all times.
                  </p>
                </div>
              </div>

              {/* Nietzsche */}
              <div className="flex flex-col md:flex-row gap-6 items-center p-6 border-2 border-emerald-300 dark:border-[#425C3E] rounded-2xl bg-gradient-to-br from-[#FFFDF9] to-[#F8F5EE] dark:from-[#111612] dark:to-[#0E120F] shadow-[6px_6px_0px_rgba(16,185,129,0.25)] dark:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] relative">
                <div className="w-36 shrink-0">
                  <PolaroidCard 
                    imgUrl="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop" 
                    caption="Nietzsche" 
                    subcaption="Beyond Good & Evil"
                    rotationClass="rotate-2"
                    tapeColorClass="bg-indigo-400/80 dark:bg-indigo-500/30 border-indigo-400/40"
                    cardBgClass="bg-[#FFFDF4] dark:bg-[#14141E] border-indigo-300 dark:border-indigo-950/40"
                  />
                </div>
                <div className="space-y-3">
                  <span className="font-mono text-[9px] bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/40 font-semibold">
                    PHILOSOPHY_CORE
                  </span>
                  <h4 className="font-sketch text-2xl font-bold leading-none text-emerald-950 dark:text-emerald-50">
                    Beyond Good and Evil
                  </h4>
                  <p className="text-sm leading-relaxed text-current/80">
                    <strong>"Deep dive."</strong> A complete and ruthless re-evaluation of social dogmas. It challenges us to look beyond simplistic binary ethics and craft authentic individual values.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 3: AUDIO & MUSIC */}
        <section id="music-section" className="scroll-mt-24">
          <div className="p-8 sm:p-10 sketch-border-thick border-[#2D2A26] dark:border-violet-950/60 rounded-3xl bg-gradient-to-br from-[#F6F5FF] via-[#EBE8FF] to-[#FAF9FF] dark:from-[#0E0F20] dark:via-[#1B0F2A] dark:to-[#0F0E17] shadow-[8px_8px_0px_rgba(139,92,246,0.22)] dark:shadow-[8px_8px_0px_rgba(0,0,0,0.4)] hover-rock-glitch transition-all duration-300 relative overflow-hidden">
            {/* Scrapbook Tape decoration */}
            <div className="absolute top-0 left-16 w-20 h-5 bg-violet-400/30 dark:bg-violet-500/20 rotate-[-1deg] border-l border-r border-dashed border-[#2D2A26]/10" />

            <div className="border-b-2 border-dashed border-[#2D2A26]/15 dark:border-[#524B44]/25 pb-4 mb-10">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400 font-mono text-xs uppercase tracking-widest">
                <Headphones className="w-3.5 h-3.5 animate-bounce" />
                <span className="bg-[#EF4444] text-[#FFFDF2] dark:bg-rose-600 dark:text-white border-2 border-[#2D2A26] px-2.5 py-0.5 rotate-[-1.5deg] font-bold inline-block shadow-[3px_3px_0px_#2D2A26] select-none transition-transform hover:scale-105">[SECTION_03] SONIC_SPECTRA.log</span>
              </div>
              <h2 className="font-sketch text-4xl font-extrabold mt-3 text-violet-950 dark:text-violet-100">
                Audio & Sonic Spaces 🎧
              </h2>
              <p className="text-sm text-current/70 font-mono mt-1">
                Focused acoustic layers providing rocket fuel during engineering cycles in the lab.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* LP */}
              <div className="p-6 border-2 border-orange-300 dark:border-orange-950/60 rounded-2xl bg-gradient-to-br from-[#FFFDFB] to-[#FDF4EB] dark:from-[#110D18] dark:to-[#0D0A13] shadow-[6px_6px_0px_rgba(249,115,22,0.2)] dark:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-40 shrink-0">
                  <PolaroidCard 
                    imgUrl="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop" 
                    caption="Linkin Park" 
                    subcaption="The raw energy."
                    rotationClass="-rotate-2"
                    tapeColorClass="bg-orange-400/80 dark:bg-orange-500/30 border-orange-400/40"
                    cardBgClass="bg-[#FFFDF4] dark:bg-[#1C1814]"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-sketch text-3xl font-extrabold text-orange-600 dark:text-orange-400">Linkin Park</h4>
                  <p className="text-sm leading-relaxed text-current/80">
                    The raw emotional grit paired with massive industrial rock beats. Provides immense, focused momentum when debugging complex ROS trajectories or writing long structural loops.
                  </p>
                  
                  {/* Playful Dancing Audio Bar Visualizer */}
                  <div className="flex items-end gap-1 h-8 mt-4 opacity-80">
                    {[30, 80, 45, 95, 60, 75, 40, 85, 50, 90].map((h, index) => (
                      <div 
                        key={index} 
                        className="w-1 rounded-t-sm bg-orange-500 dark:bg-orange-400"
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Coldplay */}
              <div className="p-6 border-2 border-sky-300 dark:border-sky-950/60 rounded-2xl bg-gradient-to-br from-[#FFFDFB] to-[#F0F7FF] dark:from-[#0D111C] dark:to-[#090C14] shadow-[6px_6px_0px_rgba(14,165,233,0.2)] dark:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-6">
                <div className="w-40 shrink-0">
                  <PolaroidCard 
                    imgUrl="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop" 
                    caption="Coldplay" 
                    subcaption="Cinematic soundscapes."
                    rotationClass="rotate-1"
                    tapeColorClass="bg-sky-400/80 dark:bg-sky-500/30 border-sky-400/40"
                    cardBgClass="bg-[#FFFDF4] dark:bg-[#1C1814]"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-sketch text-3xl font-extrabold text-sky-600 dark:text-sky-400">Coldplay</h4>
                  <p className="text-sm leading-relaxed text-current/80">
                    Vast, soaring orchestral structures and beautiful harmonic spaces. Triggers reflective mental focus, expanding thoughts beyond Earth towards stellar design patterns.
                  </p>
                  
                  {/* Playful Dancing Audio Bar Visualizer */}
                  <div className="flex items-end gap-1 h-8 mt-4 opacity-80">
                    {[50, 30, 85, 40, 75, 60, 95, 45, 80, 30].map((h, index) => (
                      <div 
                        key={index} 
                        className="w-1 rounded-t-sm bg-sky-500 dark:bg-sky-400"
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 4: DEEP THOUGHTS (INTERACTIVE NOTEBOOK BLOG WITH COMMENTS) */}
        <section id="thoughts-section" className="scroll-mt-24">
          <div className="border-b-2 border-dashed border-[#2D2A26]/15 dark:border-amber-950/40 pb-4 mb-8">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-xs uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span className="highlight-pink px-2.5 py-0.5 text-[#2D2A26] dark:text-rose-100 font-bold">[SECTION_04] DEEP_HUMAN_PARAMETERS.log</span>
            </div>
            <h2 className="font-sketch text-4xl font-extrabold mt-2 text-amber-950 dark:text-amber-100">
              Deep Thoughts & Essays 📝
            </h2>
            <p className="text-sm text-current/70 font-mono mt-1">
              Philosophical inquiries, social frameworks, and personal release notes.
            </p>
          </div>

          {/* Interactive Notebook Desk */}
          <div className="p-6 sm:p-10 sketch-border-thick border-[#2D2A26] dark:border-amber-950/50 rounded-3xl bg-gradient-to-br from-[#FFFDF2] via-[#FFF5E6] to-[#FAF8F2] dark:from-[#1E1915] dark:via-[#120F0D] dark:to-[#171310] shadow-[8px_8px_0px_rgba(245,158,11,0.22)] dark:shadow-[8px_8px_0px_rgba(0,0,0,0.4)] relative overflow-hidden">
            
            {/* Notebook Ring Binder visual at top with colorful hand-painted pastel binder rings */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#2D2A26]/10 border-b border-dashed border-[#2D2A26]/20 flex justify-around px-12">
              {[
                '#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', 
                '#EF4444', '#F97316', '#F59E0B', '#10B981'
              ].map((color, i) => (
                <div 
                  key={i} 
                  className="w-3 h-6 -mt-3 rounded-full border-2 border-[#2D2A26] shadow-sm shrink-0 transition-transform hover:scale-120 duration-200" 
                  style={{ backgroundColor: color }} 
                />
              ))}
            </div>

            <div className="pt-6 space-y-8">
              
              {/* Controller Bar: Dropdown + Next/Prev buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b-2 border-[#2D2A26]/10 dark:border-[#EAE6DF]/10 pb-6">
                
                {/* Topic selector Dropdown */}
                <div className="flex flex-col space-y-1 flex-1 max-w-md">
                  <label htmlFor="topic-dropdown" className="font-mono text-[9px] uppercase tracking-widest opacity-50">
                    SELECT_TOPIC_STREAM:
                  </label>
                  <div className="relative">
                    <select
                      id="topic-dropdown"
                      value={activeNoteId}
                      onChange={(e) => setActiveNoteId(e.target.value)}
                      className="w-full font-sketch text-xl font-bold bg-[#FAF8F2] dark:bg-[#1E1B18] text-[#2D2A26] dark:text-[#EAE6DF] border-2 border-[#2D2A26] dark:border-[#524B44] rounded-xl px-4 py-2.5 outline-none cursor-pointer focus:border-brand-accent transition-colors shadow-sm"
                    >
                      {notesList.map((note) => (
                        <option key={note.id} value={note.id}>
                          {note.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prev & Next Quick Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 select-none">
                  <button
                    onClick={handlePrevNote}
                    className="flex items-center gap-1 font-sketch font-bold text-sm px-4 py-2.5 border-2 border-[#2D2A26] dark:border-[#524B44] rounded-xl hover:bg-current/5 transition-all cursor-pointer shadow-[3px_3px_0px_#2D2A26] dark:shadow-[3px_3px_0px_rgba(0,0,0,0.4)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    title="Previous Essay"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev Thought
                  </button>
                  <button
                    onClick={handleNextNote}
                    className="flex items-center gap-1 font-sketch font-bold text-sm px-4 py-2.5 border-2 border-[#2D2A26] dark:border-[#524B44] rounded-xl hover:bg-current/5 transition-all cursor-pointer shadow-[3px_3px_0px_#2D2A26] dark:shadow-[3px_3px_0px_rgba(0,0,0,0.4)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    title="Next Essay"
                  >
                    Next Thought
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* ACTIVE ESSAY WRITING PAD */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNote.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-2 py-0.5 rounded tracking-widest uppercase">
                      SYS_LOG // CATEGORY: {currentNote.category}
                    </span>
                    <span className="text-[10px] font-mono text-current/40">
                      ID: {currentNote.id.toUpperCase()}_NODE.txt
                    </span>
                  </div>

                  <h3 className="font-sketch text-4xl font-extrabold text-[#2D2A26] dark:text-white leading-tight">
                    {currentNote.title}
                  </h3>

                  {/* Lined Notebook Paper styling */}
                  <div className="p-6 sm:p-8 border-2 border-[#2D2A26]/10 dark:border-[#524B44]/20 rounded-2xl bg-[#FDFCF9] dark:bg-[#151311] relative shadow-inner">
                    <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-400/20 dark:bg-red-400/10" /> {/* Margins vertical line */}
                    
                    <p className="font-sans text-base leading-relaxed text-justify whitespace-pre-wrap pl-6 text-[#3E3A35] dark:text-[#E2DDD5]">
                      {currentNote.content}
                    </p>
                  </div>

                </motion.div>
              </AnimatePresence>

              {/* --- LOCAL COMMENTS ENGINE (100% SECURE, PERSISTENT, OFFLINE) --- */}
              <div className="border-t-2 border-dashed border-[#2D2A26]/10 dark:border-[#524B44]/20 pt-10 mt-10 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="font-sketch text-2xl font-extrabold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-brand-accent" />
                      Local Guest Notes ✍️
                    </h4>
                    <p className="text-xs text-current/50 font-mono">
                      Write a comment in my local sketchbook! Stored private & secure inside your local browser storage.
                    </p>
                  </div>
                  
                  {comments[activeNoteId] && comments[activeNoteId].length > 0 && (
                    <button
                      onClick={handleClearComments}
                      className="font-mono text-[10px] text-red-500 hover:text-red-600 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                      title="Delete comments from LocalStorage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      CLEAR_LOCAL_DATA
                    </button>
                  )}
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handleAddComment} className="p-5 border-2 border-dashed border-[#2D2A26]/20 dark:border-[#524B44]/30 rounded-2xl space-y-4 bg-current/[0.01]">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1 flex flex-col space-y-1">
                      <label htmlFor="nickname" className="font-mono text-[9px] uppercase tracking-wider text-current/60">
                        NICKNAME / ANONYMOUS
                      </label>
                      <input
                        id="nickname"
                        type="text"
                        placeholder="Your pen name..."
                        required
                        value={newCommentAuthor}
                        onChange={(e) => setNewCommentAuthor(e.target.value)}
                        className="font-sketch text-lg bg-[#FAF8F2] dark:bg-[#1E1B18] text-[#2D2A26] dark:text-[#EAE6DF] border-2 border-[#2D2A26] dark:border-[#524B44] rounded-xl px-4 py-2 outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-col space-y-1">
                      <label htmlFor="comment-text" className="font-mono text-[9px] uppercase tracking-wider text-current/60">
                        YOUR OBSERVATION
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="comment-text"
                          type="text"
                          placeholder="Leave your observations on this note..."
                          required
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-1 font-sketch text-lg bg-[#FAF8F2] dark:bg-[#1E1B18] text-[#2D2A26] dark:text-[#EAE6DF] border-2 border-[#2D2A26] dark:border-[#524B44] rounded-xl px-4 py-2 outline-none focus:border-brand-accent transition-colors"
                        />
                        <button
                          type="submit"
                          className="px-5 bg-brand-accent hover:bg-brand-accent/90 text-white dark:text-black font-sketch font-bold text-lg border-2 border-[#2D2A26] dark:border-transparent rounded-xl transition-all shadow-[2px_2px_0px_#2D2A26] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Send className="w-4 h-4" />
                          Ink
                        </button>
                      </div>
                    </div>
                  </div>

                </form>

                {/* Render List of Comments */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  <AnimatePresence initial={false}>
                    {comments[activeNoteId] && comments[activeNoteId].length > 0 ? (
                      comments[activeNoteId].map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-4 border-2 border-[#2D2A26]/10 dark:border-[#524B44]/20 rounded-xl bg-[#FDFCF9] dark:bg-[#1E1B18]/30 relative shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-sketch text-lg font-bold text-brand-accent">
                              ✍️ {comment.author}
                            </span>
                            <span className="font-mono text-[9px] text-current/40">
                              {comment.date}
                            </span>
                          </div>
                          <p className="font-sketch text-xl text-current/80 leading-relaxed pl-5 border-l-2 border-brand-accent/30 italic">
                            "{comment.text}"
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-current/30 border-2 border-dashed border-current/10 rounded-2xl font-sketch text-xl">
                        No local notes inked here yet. Be the first to leave an observation! 🖋️
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* --- FOOTER CREDITS --- */}
      <footer className="py-12 border-t border-dashed border-[#2D2A26]/15 dark:border-[#524B44]/25 text-center relative z-10 select-none">
        <div className="max-w-6xl mx-auto px-4 font-mono text-[10px] text-current/40 space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <Coffee className="w-3 h-3 text-brand-accent" />
            <span>DRIP COFFEE CORE & HAND-DRAWN PARADIGMS</span>
          </div>
          <div>ABHISHEK NANNURI © 2026 // ALL COGNITIVE METRICS INTEGRATED</div>
          <div>LAT: 48.8353° N // DEGGENDORF_DE</div>
        </div>
      </footer>

    </div>
  );
}
