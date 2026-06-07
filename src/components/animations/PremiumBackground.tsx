import { motion } from 'framer-motion';

export const PremiumBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden">
      {/* Mesh Wave Effect */}
      <div className="absolute inset-0 mesh-wave opacity-40" />
      
      {/* Animated Radial Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#4F7CFF]/20 blur-[120px]"
      />
      
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -80, 0],
          y: [0, 100, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/10 blur-[100px]"
      />

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
    </div>
  );
};
