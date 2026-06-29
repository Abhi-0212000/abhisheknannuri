import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { parseMarkdown } from '../../common/markdown';

// Eager load timeline markdown
import rawTimeline from '../../content/professional/timeline.md?raw';

interface TimelineItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  status: 'active' | 'completed';
  description: string;
  bullets: string[];
  tags: string[];
}

const { frontmatter } = parseMarkdown(rawTimeline);
const TIMELINE_DATA: TimelineItem[] = Array.isArray(frontmatter.timeline) ? frontmatter.timeline : [];

export default function TimelineTree() {
  const [expandedId, setExpandedId] = useState<string | null>(TIMELINE_DATA[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div id="experience-timeline" className="relative max-w-4xl mx-auto py-8 px-2">
      {/* Schematic Layout Blueprint Line on side */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-brand-border -translate-x-1/2 hidden md:block" />
      <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-brand-border md:hidden" />

      <div className="space-y-12">
        {TIMELINE_DATA.map((item, index) => {
          const isExpanded = expandedId === item.id;
          const isEven = index % 2 === 0;
          const isActive = item.status === 'active';

          return (
            <div 
              key={item.id} 
              className={`relative flex flex-col md:flex-row items-stretch md:justify-between w-full ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Bullet Anchor */}
              <div 
                className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 z-20 cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <div className={`h-4 w-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'bg-brand-bg border-brand-accent shadow-lg shadow-brand-accent/20 ring-4 ring-brand-accent/20 scale-125' 
                    : isExpanded
                      ? 'bg-brand-accent border-brand-accent scale-110'
                      : 'bg-brand-card border-brand-border hover:border-brand-accent'
                }`}>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-ping" />}
                </div>
              </div>

              {/* Connecting Tree Branch Line (Figma Style) */}
              <div className={`hidden md:block absolute top-8 w-1/2 h-[2px] bg-brand-border z-10 ${
                isEven ? 'left-0 origin-right' : 'right-0 origin-left'
              }`} />

              {/* Card Container block */}
              <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${
                isEven ? 'md:text-left' : 'md:text-left'
              }`}>
                <motion.div
                  layout="position"
                  onClick={() => toggleExpand(item.id)}
                  className={`cursor-pointer rounded-2xl border p-5 md:p-6 transition-all duration-300 relative overflow-hidden group shadow-sm ${
                    isExpanded 
                      ? 'bg-brand-card border-brand-accent/30 shadow-md shadow-brand-accent/5' 
                      : 'bg-brand-card/40 border-brand-border hover:border-brand-accent/50 hover:bg-brand-card/75'
                  }`}
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/0 via-brand-accent/0 to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Card top details */}
                  <div className="flex justify-between items-start gap-2 relative z-10">
                    <div>
                      <span className="text-xs font-mono text-brand-accent tracking-wider font-semibold uppercase">
                        {item.period}
                      </span>
                      <h4 className="font-display text-sm md:text-base font-bold text-brand-text-main mt-1 group-hover:text-brand-accent transition-colors">
                        {item.role}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brand-text-muted mt-1.5 font-sans">
                        <span className="font-semibold text-brand-text-main/80">{item.organization}</span>
                        <span className="text-brand-border">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-text-muted" />
                          {item.location}
                        </span>
                      </div>
                    </div>
                    
                    <button className="text-brand-text-muted group-hover:text-brand-accent transition-colors p-1 bg-brand-bg/60 border border-brand-border rounded mt-0.5 cursor-pointer">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* High level short description */}
                  <p className="text-xs text-brand-text-muted mt-3 font-sans leading-relaxed relative z-10">
                    {item.description}
                  </p>

                  {/* Expandable detailed bullets & tags */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden relative z-10"
                      >
                        <div className="mt-4 pt-4 border-t border-brand-border space-y-2.5">
                          {Array.isArray(item.bullets) && item.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 text-xs text-brand-text-muted leading-relaxed font-sans">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tech tags used in the role */}
                        <div className="flex flex-wrap gap-1.5 mt-5 pt-3 border-t border-brand-border">
                          {Array.isArray(item.tags) && item.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="text-[9.5px] font-mono bg-brand-bg border border-brand-border text-brand-text-muted px-2 py-0.5 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Empty placeholder spacer for desktop alignment */}
              <div className="hidden md:block w-[45%]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
