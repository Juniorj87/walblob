import { motion } from 'framer-motion';
import { Shield, Layers, Lock, Upload } from 'lucide-react';

const FEATURES = [
  {
    title: "Zero-Knowledge Security",
    desc: "AES-256 encryption in your browser. Keys never leave your device memory.",
    icon: Shield,
    color: "text-primary"
  },
  {
    title: "Decentralized Storage",
    desc: "Redundant shards distributed across the Walrus Network for maximum availability.",
    icon: Layers,
    color: "text-secondary"
  },
  {
    title: "Client-Side Recovery",
    desc: "Only the sovereign key holder can reconstruct data. Zero backend access.",
    icon: Lock,
    color: "text-accent"
  },
  {
    title: "Batch Upload Support",
    desc: "High-throughput protocol for uploading multiple encrypted blobs simultaneously.",
    icon: Upload,
    color: "text-emerald-400"
  }
];

export const FeatureGrid = () => {
  return (
    <div className="w-full glass-v3 inner-glow rounded-[48px] premium-shadow overflow-hidden border-white/[0.05]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        {FEATURES.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="p-10 md:p-14 space-y-8 group hover:bg-white/[0.03] transition-all duration-700 relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${f.color} border border-white/5 group-hover:scale-110 group-hover:border-white/10 transition-all duration-500`}>
              <f.icon className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-white tracking-widest group-hover:text-primary transition-colors duration-500">{f.title}</h4>
              <p className="text-base text-text-dim leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-500">{f.desc}</p>
            </div>
            
            {/* Visual bottom indicator */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-1000 group-hover:w-full opacity-30" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
