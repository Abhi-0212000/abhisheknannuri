export interface TimelineItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  status: 'active' | 'completed' | 'upcoming';
  description: string;
  bullets: string[];
  tags: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'autonomous-navigation' | 'manipulation' | 'simulation' | 'systems';
  description: string;
  tech: string[];
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
  blueprintSvgPath?: string; // Optional custom sketch reference
  status: 'Deployed' | 'Production' | 'Research' | 'Simulation';
}

export interface SkillItem {
  name: string;
  level: number; // 0 to 100
  category: 'perception-slam' | 'controls-kinematics' | 'software-infra' | 'languages';
  iconName: string;
  description: string;
}
