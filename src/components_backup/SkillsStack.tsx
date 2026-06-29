import React, { useState, useEffect, useRef } from 'react';
import { SkillItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, Filter, Code2, Layers, Binary, ShieldAlert, Cpu as HardwareIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const SKILLS_DATA: SkillItem[] = [
  // perception-slam
  {
    name: 'ROS / ROS2 (Humble/Foxy)',
    level: 100, // not shown, keeps type compatibility
    category: 'perception-slam',
    iconName: 'Cpu',
    description: 'Expertise in modular node composition, publish/subscribe message pipelines, tf2 coordinate transforms, custom action servers, and launch orchestration.'
  },
  {
    name: 'Nav2 & Path Planning',
    level: 100,
    category: 'perception-slam',
    iconName: 'Terminal',
    description: 'Configuring custom costmaps, path planning optimizations (A*, Dijkstra), behavior tree task logic, recovery execution, and goal checker pipelines.'
  },
  {
    name: 'SLAM & State Estimation',
    level: 100,
    category: 'perception-slam',
    iconName: 'Filter',
    description: 'Configuring Cartographer, Slam Toolbox, RTAB-Map, and sensor fusion filters (EKF/UKF) combining wheel encoders, IMU, and 2D/3D LiDAR scans.'
  },
  {
    name: 'Computer Vision & PCL',
    level: 100,
    category: 'perception-slam',
    iconName: 'Code2',
    description: 'Real-time video and spatial point cloud processing, including thresholding, voxel grid downsampling, segmentation, and camera-to-LiDAR calibration.'
  },
  // controls-kinematics
  {
    name: 'Controls (PID / MPC / LQR)',
    level: 100,
    category: 'controls-kinematics',
    iconName: 'Layers',
    description: 'Design of closed-loop feedback controllers, state-space representations, trajectory tracking control, and physical constraint optimization.'
  },
  {
    name: 'Robot Kinematics',
    level: 100,
    category: 'controls-kinematics',
    iconName: 'Binary',
    description: 'Analytical and numerical Forward/Inverse Kinematics (IK), Jacobian calculations, singularity mitigation, and smooth trajectory spline interpolation.'
  },
  {
    name: 'Digital Filtering & Signal Processing',
    level: 100,
    category: 'controls-kinematics',
    iconName: 'Filter',
    description: 'Implementation of low-pass filters, moving averages, complementary filters, and discrete-time Kalman filtering directly on microcontrollers.'
  },
  // software-infra
  {
    name: 'Simulation (Gazebo / Webots / Isaac Sim)',
    level: 100,
    category: 'software-infra',
    iconName: 'Cpu',
    description: 'Building representative URDF/SDF models, defining inertia tensors, mocking sensor noises, and running robust Software-In-The-Loop (SIL) tests.'
  },
  {
    name: 'Docker & Embed Deployment',
    level: 100,
    category: 'software-infra',
    iconName: 'Terminal',
    description: 'Multi-stage Docker files for containerized ROS workspaces, cross-compilation for ARM target boards, and modular docker-compose deployments.'
  },
  {
    name: 'Embedded Systems & CAN Bus',
    level: 100,
    category: 'software-infra',
    iconName: 'Binary',
    description: 'Firmware design for STM32 and ESP32 chips, implementing low-level drivers (SPI, I2C, UART), and communication via CAN bus / SocketCAN.'
  },
  // languages
  {
    name: 'Modern C++ (17 / 20)',
    level: 100,
    category: 'languages',
    iconName: 'Code2',
    description: 'Memory-safe smart pointers, multi-threaded task coordination with mutexes/future-promises, and writing high-performance algorithm libraries.'
  },
  {
    name: 'Python (NumPy / SciPy / PyTorch)',
    level: 100,
    category: 'languages',
    iconName: 'Code2',
    description: 'Scientific computing, trajectory optimization simulations, diagnostic and telemetry scripting, and real-time deep learning model inference.'
  }
];

const MARQUEE_SKILLS = [
  'ROS2 Humble', 'Modern C++ (17/20)', 'Python', 'SLAM & Mapping', 'Navigation2', 
  'Gazebo Simulation', 'Docker Containers', 'Linux / RTOS', 'Kalman Filtering', 
  'Sensor Fusion', 'OpenCV', 'LiDAR obstacle avoidance', 'Path Planning', 
  'PID/MPC Controls', 'STM32 / ESP32', 'CAN Bus Protocol', 'Isaac Sim', 
  'PyTorch Neural Networks', 'Git Workflows', 'URDF Modeling', 'Coordinate Transforms (TF2)'
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 text-brand-accent" />,
  Terminal: <Terminal className="w-5 h-5 text-brand-accent" />,
  Filter: <Filter className="w-5 h-5 text-brand-accent" />,
  Code2: <Code2 className="w-5 h-5 text-brand-accent" />,
  Layers: <Layers className="w-5 h-5 text-brand-accent" />,
  Binary: <Binary className="w-5 h-5 text-brand-accent" />
};

export default function SkillsStack() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed] = useState(0.4); // Elegant, slow automatic looping scroll
  const scrollPosRef = useRef<number>(0);
  const targetScrollRef = useRef<number | null>(null);

  // Smooth frame-by-frame automatic scroll and manual ease-out step transitions
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Synchronize initial position
    scrollPosRef.current = container.scrollLeft;

    let animationFrameId: number;

    const scroll = () => {
      if (!container) return;

      const halfWidth = container.scrollWidth / 2;

      // 1. Process movement
      if (targetScrollRef.current !== null) {
        // Animate towards manual target with ease-out interpolation
        const diff = targetScrollRef.current - scrollPosRef.current;
        if (Math.abs(diff) > 0.5) {
          scrollPosRef.current += diff * 0.12; // Easing speed coefficient
          container.scrollLeft = Math.round(scrollPosRef.current);
        } else {
          // Snap precisely to target and end animation
          scrollPosRef.current = targetScrollRef.current;
          container.scrollLeft = Math.round(scrollPosRef.current);
          targetScrollRef.current = null;
        }
      } else if (!isPaused) {
        // Normal automatic slow crawling
        scrollPosRef.current += scrollSpeed;
        container.scrollLeft = Math.round(scrollPosRef.current);
      } else {
        // Sync tracker with user touch-drags or natural browser updates
        scrollPosRef.current = container.scrollLeft;
      }

      // 2. Continuous seamless looping at halfWidth bounds
      if (halfWidth > 0) {
        if (scrollPosRef.current >= halfWidth) {
          scrollPosRef.current -= halfWidth;
          if (targetScrollRef.current !== null) {
            targetScrollRef.current -= halfWidth;
          }
          container.scrollLeft = Math.round(scrollPosRef.current);
        } else if (scrollPosRef.current < 0) {
          scrollPosRef.current += halfWidth;
          if (targetScrollRef.current !== null) {
            targetScrollRef.current += halfWidth;
          }
          container.scrollLeft = Math.round(scrollPosRef.current);
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, scrollSpeed]);

  const handleScrollStep = (direction: 'forward' | 'backward') => {
    const container = scrollRef.current;
    if (!container) return;

    const stepSize = 180; // Gentle, elegant step to nudge backward/forward
    const basePosition = targetScrollRef.current !== null 
      ? targetScrollRef.current 
      : scrollPosRef.current;

    targetScrollRef.current = direction === 'forward' 
      ? basePosition + stepSize 
      : basePosition - stepSize;
  };

  const categories = [
    { id: 'all', label: 'All Fields' },
    { id: 'perception-slam', label: 'Perception & SLAM' },
    { id: 'controls-kinematics', label: 'Controls & Kinematics' },
    { id: 'software-infra', label: 'Infrastructure & Embed' },
    { id: 'languages', label: 'Languages' }
  ];

  const filteredSkills = selectedCategory === 'all' 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter(skill => skill.category === selectedCategory);

  return (
    <div className="space-y-10 py-2">
      {/* Horizontal Continuous Scrolling Marquee with interactive step control */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full flex items-center group/marquee border-y border-brand-border py-4 bg-brand-card/20 select-none"
      >
        
        {/* Glow gradients left/right (behind buttons) */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />
        
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScrollStep('backward')}
          className="absolute left-4 z-20 p-2 rounded-full border border-brand-border bg-brand-card/90 text-brand-text-muted hover:text-brand-accent hover:border-brand-accent/50 hover:scale-105 active:scale-95 shadow-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
          aria-label="Scroll Backward"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
 
        {/* Right Arrow Button */}
        <button
          onClick={() => handleScrollStep('forward')}
          className="absolute right-4 z-20 p-2 rounded-full border border-brand-border bg-brand-card/90 text-brand-text-muted hover:text-brand-accent hover:border-brand-accent/50 hover:scale-105 active:scale-95 shadow-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
          aria-label="Scroll Forward"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
 
        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="w-full overflow-x-auto whitespace-nowrap flex items-center gap-12 py-1 scroll-smooth no-scrollbar scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Loop twice to make it seamless */}
          {[...MARQUEE_SKILLS, ...MARQUEE_SKILLS].map((skill, index) => (
            <div 
              key={`${skill}-${index}`} 
              className="flex items-center gap-2.5 font-mono text-xs font-semibold tracking-wider text-brand-text-main flex-shrink-0"
            >
              <div className="h-2 w-2 rounded-full bg-brand-accent" />
              <span>{skill.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Category togglers with refined pills */}
        <div className="flex flex-wrap gap-2 justify-center py-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              id={`skills-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-brand-accent text-white dark:text-black border-brand-accent font-semibold shadow-md shadow-brand-accent/15'
                  : 'bg-brand-card/40 text-brand-text-muted border-brand-border hover:border-brand-accent/50 hover:text-brand-text-main'
              }`}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dynamic Competency Grid without Percentages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="skills-grid">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map(skill => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-brand-card border border-brand-border hover:border-brand-accent/45 p-5 rounded-2xl flex flex-col justify-between group transition-all duration-300 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="p-2.5 rounded-xl bg-brand-accent/5 border border-brand-accent/15 group-hover:border-brand-accent group-hover:bg-brand-accent/10 transition-all">
                      {ICON_MAP[skill.iconName] || <Cpu className="w-5 h-5 text-brand-accent" />}
                    </div>
                    <h4 className="font-display text-sm font-bold text-brand-text-main group-hover:text-brand-accent transition-colors">
                      {skill.name}
                    </h4>
                  </div>
                  <p className="text-xs text-brand-text-muted font-sans leading-relaxed transition-colors">
                    {skill.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
