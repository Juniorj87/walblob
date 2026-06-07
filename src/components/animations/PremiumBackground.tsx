import { motion } from 'framer-motion';

export const PremiumBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 bg-[#020617] overflow-hidden">
      {/* Noise Texture */}
      <div className="noise-overlay" />

      {/* Mesh Layer */}
      <div className="absolute inset-0 mesh-bg-v3 opacity-60" />
      
      {/* Animated Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [-50, 50, -50],
          y: [-20, 20, -20]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-[#4F7CFF]/15 blur-[160px] pointer-events-none"
      />
      
      <motion.div 
        animate={{ 
          scale: [1.3, 1, 1.3],
          opacity: [0.3, 0.5, 0.3],
          x: [50, -50, 50],
          y: [20, -20, 20]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#8B5CF6]/10 blur-[140px] pointer-events-none"
      />

      <motion.div 
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[40%] bg-[#00D4FF]/5 blur-[120px] pointer-events-none rotate-12"
      />
    </div>
  );
};
