import React from 'react';

const SKILLS = [
  'Reinforcement Learning (SAC, TD3, RLPD, DiffQL)',
  'Physical AI & VLA Models',
  'Action Chunking Transformers (ACT)',
  'Diffusion Policies & Behavior Cloning',
  'MoveIt Pro & Behavior Trees',
  'C++ (C++20/Eigen3)',
  'Python (PyTorch)',
  'ROS2 Humble / Control',
  'MuJoCo & Gazebo Physics',
  'Visual Odometry & Essential Matrix',
  'EKF Sensor Fusion (IMU/GNSS/LiDAR)',
  'AWS & Azure Cloud Migration',
  'CI/CD Pipelines & DevOps',
  'Docker & Linux Systems',
  'C# & PostgreSQL'
];

export default function SkillsMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-brand-accent/5 dark:bg-brand-accent/5 border-y border-brand-border select-none">
      {/* Subtle overlay gradients to fade out edges */}
      <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />
      
      <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
        {/* First track */}
        {SKILLS.map((skill, idx) => (
          <span 
            key={`s1-${idx}`} 
            className="font-mono text-sm md:text-base font-bold text-brand-text-main hover:text-brand-accent transition-colors flex items-center gap-3"
          >
            <span className="h-2 w-2 rounded-full bg-brand-accent inline-block" />
            {skill}
          </span>
        ))}
        {/* Second track for seamless looping */}
        {SKILLS.map((skill, idx) => (
          <span 
            key={`s2-${idx}`} 
            className="font-mono text-sm md:text-base font-bold text-brand-text-main hover:text-brand-accent transition-colors flex items-center gap-3"
          >
            <span className="h-2 w-2 rounded-full bg-brand-accent inline-block" />
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
