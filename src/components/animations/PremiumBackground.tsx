import { motion } from 'framer-motion';

export const PremiumBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 bg-background overflow-hidden">
      {/* Noise Texture */}
      <div className="noise-overlay" />

      {/* Scanline Effect */}
      <div className="scanline-overlay" />

      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Hex Pattern */}
      <div className="absolute inset-0 hex-pattern opacity-30" />

      {/* Animated Glows - Reduced and more subtle */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
          x: [20, -20, 20],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/8 blur-[100px] pointer-events-none"
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
        />
      ))}
    </div>
  );
};
