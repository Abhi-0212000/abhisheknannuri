import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Github } from 'lucide-react';
import { parseMarkdown } from '../../common/markdown';

// Eagerly load all project markdown files as raw strings
const modules = import.meta.glob('../../content/professional/projects/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;

interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  tech: string[];
  githubUrl: string;
  body: string;
}

const PROJECTS_DATA: Project[] = Object.entries(modules).map(([path, mod]) => {
  const rawString = typeof mod === 'string' ? mod : mod.default || '';
  const { frontmatter, content } = parseMarkdown(rawString);
  return {
    id: frontmatter.id || path.split('/').pop()?.replace('.md', '') || '',
    title: frontmatter.title || 'Untitled Project',
    subtitle: frontmatter.subtitle || '',
    category: frontmatter.category || 'general',
    status: frontmatter.status || 'Simulation',
    tech: Array.isArray(frontmatter.tech) ? frontmatter.tech : [],
    githubUrl: frontmatter.githubUrl || '',
    body: content
  };
});

export default function ProjectsGrid() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'ALL PROJECTS' },
    { id: 'autonomous-navigation', label: 'NAVIGATION' },
    { id: 'manipulation', label: 'MANIPULATION & CONTROL' },
    { id: 'systems', label: 'PERCEPTION & EST.' }
  ];

  const filteredProjects = selectedFilter === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === selectedFilter);

  return (
    <div className="space-y-8">
      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start" id="pro-project-filters">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer border ${
              selectedFilter === filter.id
                ? 'bg-brand-accent text-white dark:text-black border-brand-accent font-semibold shadow-md shadow-brand-accent/15'
                : 'bg-brand-card/40 text-brand-text-muted border-brand-border hover:border-brand-accent/50 hover:text-brand-text-main'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="pro-projects-grid">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="border border-brand-border hover:border-brand-accent/45 rounded-2xl bg-brand-card p-5 md:p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden shadow-sm pro-card-hover"
          >
            {/* Visual grid paper accent on card corners */}
            <div className="absolute top-0 right-0 w-16 h-16 blueprint-grid opacity-10 pointer-events-none" />

            <div>
              {/* Card Title & Status pill */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] font-mono text-brand-text-muted uppercase tracking-widest font-semibold block">
                    {project.category.replace('-', ' ')}
                  </span>
                  <h3 className="font-display text-base font-bold text-brand-text-main mt-1 group-hover:text-brand-accent transition-colors">
                    {project.title}
                  </h3>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                  project.status === 'Production' || project.status === 'Deployed'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : project.status === 'Simulation'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Subheading details */}
              <p className="text-xs text-brand-text-muted mt-2 font-medium font-sans italic">
                {project.subtitle}
              </p>

              {/* Description & bullets rendered via ReactMarkdown */}
              <div className="text-xs text-brand-text-muted mt-3 font-sans leading-relaxed space-y-3">
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => <ul className="mt-4 space-y-2.5 border-l-2 border-brand-accent/30 pl-4 list-none">{children}</ul>,
                    li: ({ children }) => <li className="text-xs text-brand-text-main leading-relaxed font-sans">{children}</li>,
                    strong: ({ children }) => <strong className="text-brand-accent font-mono text-[10.5px] mr-1">{children}</strong>
                  }}
                >
                  {project.body}
                </ReactMarkdown>
              </div>
            </div>

            {/* Tech tags and action buttons */}
            <div className="mt-6 pt-4 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1">
                {project.tech.map(t => (
                  <span
                    key={t}
                    className="text-[9.5px] font-mono bg-brand-bg border border-brand-border text-brand-text-muted px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10.5px] font-mono text-brand-text-muted hover:text-brand-accent transition-colors bg-brand-bg/60 px-3 py-1.5 rounded-lg border border-brand-border self-start sm:self-center hover:border-brand-accent/30 cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5" />
                  SOURCE
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
