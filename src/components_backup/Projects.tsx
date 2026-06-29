import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { Github } from 'lucide-react';

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'NaviRover Outdoor SLAM UGV',
    subtitle: 'Rugged Autonomous Ground Vehicle Navigation Stack',
    category: 'autonomous-navigation',
    description: 'Developed a full localization, mapping, and planning navigation stack for a customized 4WD Rover navigating hostile off-road terrains.',
    tech: ['C++', 'ROS2 Humble', 'Slam Toolbox', 'Nav2', 'RTK-GPS', 'EKF'],
    highlights: [
      'Configured dual-antenna RTK-GPS fused with micro-electromechanical IMU, achieving centimeter-level localization stability.',
      'Created custom Nav2 recovery behaviors to handle deep soil slippage and dynamic traction loss.',
      'Implemented real-time grid-mapping cost layers mapping 3D lidar point clouds to 2D occupancy costmaps.'
    ],
    githubUrl: 'https://github.com/Abhi-0212000/navirover-slam-ugv',
    status: 'Production'
  },
  {
    id: 'proj-2',
    title: 'KinArm 6-DOF Manipulator Stack',
    subtitle: 'Closed-loop Joint Trajectory & Inverse Kinematics Controller',
    category: 'manipulation',
    description: 'Designed a modular kinematics solver and path generator for industrial collaborative arms, incorporating gravity compensation.',
    tech: ['C++20', 'Eigen3', 'ROS2 Control', 'MoveIt2', 'CANopen'],
    highlights: [
      'Programmed analytical IK solver with closed-form solution reducing compute times from 4.2ms to <0.12ms.',
      'Implemented joint-level PID loops with feed-forward gravity compensation torque estimates.',
      'Designed safety watchdog tracking current limits and collision boundary models to protect hardware.'
    ],
    githubUrl: 'https://github.com/Abhi-0212000/kinarm-6dof-control',
    status: 'Research'
  },
  {
    id: 'proj-3',
    title: 'IsaacFactory Digital Twin',
    subtitle: 'High-Fidelity Automated Warehouse Co-Simulation',
    category: 'simulation',
    description: 'Modeled and simulated a complete factory automation workflow with multi-robot cooperation inside Nvidia Isaac Sim and Gazebo.',
    tech: ['Python', 'Nvidia Isaac Sim', 'USD', 'ROS2 Navigation', 'Docker'],
    highlights: [
      'Built asset importing pipeline transforming CAD designs to high-fidelity USD models with correct material physics.',
      'Configured ROS2 joint torque controller plugin mimicking physical motor latency and gearbox backlash.',
      'Simulated fleet traffic controller directing 5 concurrent robots around narrow loading docks.'
    ],
    githubUrl: 'https://github.com/Abhi-0212000/isaac-factory-twin',
    status: 'Simulation'
  },
  {
    id: 'proj-4',
    title: 'CudaSLAM Spatial State Estimator',
    subtitle: 'Real-time CUDA-Accelerated Visual-Inertial Odometry',
    category: 'systems',
    description: 'Engineered a highly optimized GPU-parallelized feature tracker and visual odometry pipeline for low-power edge computers.',
    tech: ['C++', 'CUDA C', 'OpenCV', 'Nvidia Jetson Orin', 'Stereo Camera'],
    highlights: [
      'Ported Lucas-Kanade optical flow feature tracking to CUDA, processing 1000+ points at 90 FPS on Jetson Orin.',
      'Integrated real-time keypoint extraction with landmark optimization solving Schur complements on GPU cores.',
      'Reduced overall localization drift from 1.8% to <0.42% of total traversed path.'
    ],
    githubUrl: 'https://github.com/Abhi-0212000/cuda-slam-estimator',
    status: 'Deployed'
  }
];

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'ALL PROJECTS' },
    { id: 'autonomous-navigation', label: 'NAVIGATION' },
    { id: 'manipulation', label: 'MANIPULATION' },
    { id: 'simulation', label: 'SIMULATION & TWIN' },
    { id: 'systems', label: 'PERCEPTION SYSTEMS' }
  ];

  const filteredProjects = selectedFilter === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === selectedFilter);

  return (
    <div className="space-y-8">
      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start" id="project-filters">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="projects-grid">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="border border-brand-border hover:border-brand-accent/45 rounded-2xl bg-brand-card p-5 md:p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden shadow-sm"
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

              {/* description */}
              <p className="text-xs text-brand-text-muted mt-3 font-sans leading-relaxed">
                {project.description}
              </p>

              {/* Bulleted Highlights (CAD layout style) */}
              <div className="mt-4 space-y-2.5 border-l-2 border-brand-accent/30 pl-4">
                {project.highlights.map((hl, idx) => (
                  <div key={idx} className="text-xs text-brand-text-main leading-relaxed font-sans">
                    <strong className="text-brand-accent font-mono text-[10px] mr-1.5">[{idx + 1}]</strong>
                    {hl}
                  </div>
                ))}
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
