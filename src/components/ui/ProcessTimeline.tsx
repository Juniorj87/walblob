import { motion } from 'framer-motion';
import { FileUp, Lock, CloudUpload, Key, ShieldCheck } from 'lucide-react';

const STEPS = [
  { title: "Select File", desc: "Select any data to seal", icon: FileUp },
  { title: "Local Encryption", desc: "AES-256 local sealing", icon: Lock },
  { title: "Network Upload", desc: "Decentralized storage", icon: CloudUpload },
  { title: "Save Identity", desc: "Store Blob ID + Key", icon: Key },
  { title: "Instant Access", desc: "Zero-knowledge retrieval", icon: ShieldCheck }
];

export const ProcessTimeline = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-6">
      {/* Dynamic Connecting Line */}
      <div className="absolute top-[88px] left-[10%] right-[10%] h-[1px] bg-white/[0.05] hidden lg:block overflow-hidden">
         <motion.div 
           initial={{ x: '-100%' }}
           animate={{ x: '100%' }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           className="w-[50%] h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"
         />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
        {STEPS.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-8 group"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-[28px] bg-[#030712] border border-white/5 flex items-center justify-center text-text-muted shadow-2xl group-hover:border-primary/30 group-hover:text-primary transition-all duration-700 glass-v3 inner-glow">
                <step.icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/30 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                0{i + 1}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[13px] font-display font-bold uppercase tracking-[0.2em] text-white tracking-widest">{step.title}</h4>
              <p className="text-[12px] text-text-dim font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-500">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
