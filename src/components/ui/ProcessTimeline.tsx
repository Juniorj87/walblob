import { motion } from 'framer-motion';
import { FileUp, Lock, CloudUpload, Key, ShieldCheck } from 'lucide-react';

const STEPS = [
  { title: "Select File", desc: "Pick any file to encrypt", icon: FileUp },
  { title: "Encrypt In Browser", desc: "AES-256 local sealing", icon: Lock },
  { title: "Upload To Walrus", desc: "Decentralized storage", icon: CloudUpload },
  { title: "Receive ID + Key", desc: "Save recovery details", icon: Key },
  { title: "Recover Anytime", desc: "Private instant access", icon: ShieldCheck }
];

export const ProcessTimeline = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto py-12">
      {/* Connecting Line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-12 hidden md:block" />
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
        {STEPS.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#030712] border border-white/5 flex items-center justify-center text-primary shadow-2xl group-hover:border-primary/20 transition-colors">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                {i + 1}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white tracking-widest">{step.title}</h4>
              <p className="text-[11px] text-text-dim font-medium uppercase tracking-widest opacity-60">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
