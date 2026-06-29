import React from 'react';
import { Terminal, Cpu, ChevronRight, Binary, BookOpen, Atom, Network } from 'lucide-react';
import ProNav from '../components/ProNav';
import ProjectsGrid from '../components/ProjectsGrid';
import TimelineTree from '../components/TimelineTree';
import SkillsMarquee from '../components/SkillsMarquee';
import ProFooter from '../components/ProFooter';
import { parseMarkdown } from '../../common/markdown';

// Import Pro Universe specific CSS
import '../css/pro.css';

// Eager load hero and publications md content
import rawHero from '../../content/professional/hero.md?raw';
import rawPublications from '../../content/professional/publications.md?raw';

// Parse hero content
const { frontmatter: heroMeta } = parseMarkdown(rawHero);

// Parse publications content
const { frontmatter: pubMeta } = parseMarkdown(rawPublications);
interface Publication {
  title: string;
  venue: string;
  year: string;
  authors: string;
  abstract: string;
  link: string;
}
const publications: Publication[] = Array.isArray(pubMeta.publications) ? pubMeta.publications : [];

const researchInterests = [
  {
    icon: <Atom className="w-5 h-5 text-brand-accent" />,
    title: "Manipulation & Reinforcement Learning",
    desc: "Designing sample-efficient dense reward functions to accelerate the convergence of off-policy RL algorithms (SAC, TD3, RLPD) and Behavior Cloning policies on physical manipulators."
  },
  {
    icon: <Network className="w-5 h-5 text-brand-accent" />,
    title: "Physical AI & VLA Models",
    desc: "Fine-tuning foundational Vision-Language-Action (VLA) models, Action Chunking Transformers (ACT), and Diffusion Policies via Residual RL to solve complex industrial task horizons."
  },
  {
    icon: <Binary className="w-5 h-5 text-brand-accent" />,
    title: "AMR Controls & Planning",
    desc: "Configuring global planners (Lanelet2) and local trajectory tracking controller profiles (Quintic Bézier splines, DWA) inside ROS2 Navigation frameworks for safe last-mile sidewalk traversal."
  }
];

interface ProUniverseProps {
  onToggleUniverse: () => void;
  currentTheme: 'light' | 'dark';
  onChangeTheme: (theme: 'light' | 'dark') => void;
}

export default function ProUniverse({ onToggleUniverse, currentTheme, onChangeTheme }: ProUniverseProps) {
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main font-sans selection:bg-brand-accent selection:text-white dark:selection:text-black transition-colors duration-300 relative overflow-x-hidden">
      {/* Global Blueprint Grid background across all sections */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.06] dark:opacity-[0.14] pointer-events-none z-0" />

      {/* Navigation Header */}
      <ProNav currentTheme={currentTheme} onChangeTheme={onChangeTheme} />

      {/* Hero Section */}
      <header id="about-section" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Biography */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/5 border border-brand-accent/20 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                <span className="font-mono text-[10px] text-brand-accent tracking-wider uppercase font-semibold">
                  {heroMeta.subtitle || 'Robotics Software Engineer'}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-text-main tracking-tight leading-[1.08]">
                  Engineering <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 dark:from-emerald-400 dark:via-emerald-500 dark:to-teal-400">
                    Physical Intelligence
                  </span>
                </h1>
                
                <p className="font-sans text-xs sm:text-sm md:text-base text-brand-text-muted max-w-xl leading-relaxed">
                  Hi, I'm <strong>{heroMeta.name || 'Abhishek Nannuri'}</strong>. {heroMeta.bio}
                </p>
              </div>

              {/* Tag links */}
              <div className="flex flex-wrap gap-2 pt-1" id="pro-hero-tags">
                {['ROS2 Humble', 'Modern C++', 'Python', 'SAC/TD3/RLPD', 'MoveIt Pro', 'Behavior Trees', 'MuJoCo', 'VLA & ACT'].map((t) => (
                  <span 
                    key={t}
                    className="text-[9.5px] font-mono border border-brand-border bg-brand-card text-brand-text-muted px-2.5 py-1 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTA triggers */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('projects-section')}
                  id="pro-hero-cta-projects"
                  className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent/95 text-white dark:text-black font-semibold font-mono px-5 py-3 rounded-xl text-xs transition-all duration-300 shadow-md shadow-brand-accent/15 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  VIEW_PROJECTS.sh
                </button>
                <button
                  onClick={() => scrollToSection('contact-section')}
                  id="pro-hero-cta-contact"
                  className="flex items-center gap-1.5 border border-brand-border hover:border-brand-accent/40 bg-brand-card/40 text-brand-text-muted hover:text-brand-text-main font-mono px-5 py-3 rounded-xl text-xs transition-all duration-300 cursor-pointer"
                >
                  ping_abhishek.py
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: CAD diagram watermark */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative" id="pro-hero-graphic-container">
              <div className="relative w-full max-w-[340px] aspect-square border-2 border-dashed border-brand-border rounded-3xl p-4 flex items-center justify-center bg-brand-card/30">
                <div className="absolute inset-2 border border-brand-border/40 rounded-full animate-[spin_40s_linear_infinite] pointer-events-none" />
                <div className="absolute inset-8 border border-dashed border-brand-accent/10 rounded-full animate-[spin_25s_linear_infinite_reverse] pointer-events-none" />

                <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-brand-text-muted/40 pointer-events-none">
                  <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.3" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.3" />
                  <circle cx="50" cy="50" r="1.5" fill="var(--brand-accent)" />
                  <circle cx="50" cy="15" r="4" fill="none" stroke="var(--brand-accent)" strokeWidth="1" className="animate-pulse" />
                  <circle cx="80" cy="68" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="20" cy="68" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="50" y1="15" x2="80" y2="68" stroke="var(--brand-accent)" strokeWidth="1" />
                  <line x1="50" y1="15" x2="20" y2="68" stroke="currentColor" strokeWidth="0.6" />
                  <line x1="20" y1="68" x2="80" y2="68" stroke="currentColor" strokeWidth="0.6" />
                  <text x="54" y="22" className="text-[3px] font-mono fill-brand-text-muted">SYS_JOINT_01</text>
                  <text x="54" y="27" className="text-[2.5px] font-mono fill-brand-accent">OK: THETA_YAW</text>
                  <text x="54" y="80" className="text-[3px] font-mono fill-brand-text-muted">R_O_S_ACTIVE</text>
                  <text x="54" y="84" className="text-[2.5px] font-mono fill-brand-text-muted">LATENCY: 1.2ms</text>
                </svg>

                <div className="absolute -bottom-2 -left-2 bg-brand-card border border-brand-border text-brand-text-muted px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-md">
                  <Binary className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                  COORD_REF: CARTESIAN_3D
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Sections Wrapper */}
      <main className="relative z-10">

        {/* Section 1: Research Interests */}
        <section id="research-section" className="relative py-20 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 z-10">
          <div className="text-center lg:text-left mb-12" id="pro-research-header">
            <span className="text-brand-accent font-mono text-[10px] tracking-widest font-semibold uppercase block mb-2">
              [STAGE_01] INVESTIGATION FIELDS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text-main tracking-wide">
              Research Interests
            </h2>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-2 max-w-2xl leading-relaxed">
              Explorations focusing on mathematical models, physical controls, and embedded implementations for highly reliable autonomous machines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="pro-research-grid">
            {researchInterests.map((interest, idx) => (
              <div 
                key={idx}
                className="border border-brand-border bg-brand-card p-6 rounded-2xl group hover:border-brand-accent/45 transition-all duration-300 shadow-sm"
              >
                <div className="p-3 w-max rounded-xl bg-brand-accent/5 border border-brand-accent/15 group-hover:border-brand-accent transition-all mb-4">
                  {interest.icon}
                </div>
                <h3 className="font-display text-sm font-bold text-brand-text-main mb-2">
                  {interest.title}
                </h3>
                <p className="text-xs text-brand-text-muted leading-relaxed font-sans">
                  {interest.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Publications */}
        <section id="publications-section" className="relative py-20 md:py-24 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center lg:text-left mb-12" id="pro-publications-header">
              <span className="text-brand-accent font-mono text-[10px] tracking-widest font-semibold uppercase block mb-2">
                [STAGE_02] ACADEMIC CONTRIBUTIONS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text-main tracking-wide">
                Publications & Preprints
              </h2>
              <p className="text-xs sm:text-sm text-brand-text-muted mt-2 max-w-2xl leading-relaxed">
                Reviewed papers presenting innovations in state estimation calibration, discrete filtering, and sidewalk-segmentation based path correction.
              </p>
            </div>

            <div className="space-y-6" id="pro-publications-grid">
              {publications.map((paper, idx) => (
                <div 
                  key={idx}
                  className="border border-brand-border bg-brand-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between group hover:border-brand-accent/35 transition-all duration-300 shadow-sm"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[9px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full border border-brand-accent/20">
                        {paper.year}
                      </span>
                      <span className="text-[10px] font-mono text-brand-text-muted uppercase tracking-wider">
                        {paper.venue}
                      </span>
                    </div>

                    <h3 className="font-display text-sm md:text-base font-bold text-brand-text-main group-hover:text-brand-accent transition-colors">
                      {paper.title}
                    </h3>

                    <div className="text-xs text-brand-text-muted font-sans font-medium">
                      Authors: <span className="text-brand-text-main">{paper.authors}</span>
                    </div>

                    <p className="text-xs text-brand-text-muted font-sans leading-relaxed pt-1">
                      {paper.abstract}
                    </p>
                  </div>

                  <div className="flex items-start md:items-center justify-start md:justify-end">
                    <a 
                      href={paper.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-bg hover:bg-brand-accent hover:text-white dark:hover:text-black border border-brand-border hover:border-brand-accent px-4 py-2 rounded-xl text-xs font-mono font-semibold text-brand-text-muted transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      PUBLISHER_LINK
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Projects */}
        <section id="projects-section" className="relative py-20 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 z-10">
          <div className="text-center lg:text-left mb-12" id="pro-projects-header">
            <span className="text-brand-accent font-mono text-[10px] tracking-widest font-semibold uppercase block mb-2">
              [STAGE_03] SOURCE COMPOSITIONS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text-main tracking-wide">
              Robotics Projects
            </h2>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-2 max-w-2xl leading-relaxed">
              Curated deployments solving physical navigation, computer vision, state estimation, and path optimization tasks.
            </p>
          </div>

          <ProjectsGrid />
        </section>

        {/* Section 4: Experience Timeline */}
        <section id="timeline-section" className="relative py-20 md:py-24 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12" id="pro-timeline-header">
              <span className="text-brand-accent font-mono text-[10px] tracking-widest font-semibold uppercase block mb-2">
                [STAGE_04] HISTORIC TRANSITIONS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text-main tracking-wide">
                Professional Timeline
              </h2>
              <p className="text-xs sm:text-sm text-brand-text-muted mt-2 max-w-xl mx-auto leading-relaxed">
                A structured engineering tree representing key milestones, corporate deployments, and academic leadership. Click roles to expand details.
              </p>
            </div>

            <TimelineTree />
          </div>
        </section>

        {/* Section 5: Technical Expertise Ticker Marquee */}
        <section id="expertise-section" className="relative py-20 md:py-24 z-10 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
            <div className="text-center lg:text-left" id="pro-expertise-header">
              <span className="text-brand-accent font-mono text-[10px] tracking-widest font-semibold uppercase block mb-2">
                [STAGE_05] CORE MATRIX
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text-main tracking-wide">
                Technical Expertise
              </h2>
              <p className="text-xs sm:text-sm text-brand-text-muted mt-2 max-w-2xl leading-relaxed">
                Continuous marquee tracker of active competency fields, programming frameworks, and robotics control orchestrations.
              </p>
            </div>
          </div>

          <SkillsMarquee />
        </section>

      </main>

      <ProFooter />
    </div>
  );
}

