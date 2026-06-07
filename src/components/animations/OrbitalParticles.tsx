import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

interface Particle {
  id: number;
  initialOpacity: number;
  initialX: string;
  initialY: string;
  initialScale: number;
  duration: number;
  delay: number;
}

// Generate static random values once outside to satisfy React 19 purity rules
const STATIC_PARTICLES: Particle[] = [...Array(20)].map((_, i) => ({
  id: i,
  initialOpacity: Math.random() * 0.5,
  initialX: Math.random() * 100 + "%",
  initialY: Math.random() * 100 + "%",
  initialScale: Math.random() * 1 + 0.5,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 10
}));

export const OrbitalParticles = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 200 };
  const lightX = useSpring(mouseX, springConfig);
  const lightY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050816]">
      {/* Interactive Light Follower */}
      <motion.div
        style={{
          left: lightX,
          top: lightY,
        }}
        className="absolute w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 z-10 opacity-60"
      />

      {/* Main Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 blur-[120px] rounded-full opacity-50"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/10 blur-[140px] rounded-full opacity-40"
      />

      {/* Small Particles */}
      {STATIC_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: p.initialOpacity,
            x: p.initialX,
            y: p.initialY,
            scale: p.initialScale
          }}
          animate={{
            y: ["-10%", "110%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay
          }}
          className="absolute w-px h-px bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      ))}

      {/* Depth Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050816]/50 to-[#050816]" />
    </div>
  );
};
