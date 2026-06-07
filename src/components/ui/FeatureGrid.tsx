import { motion } from 'framer-motion';
import { Shield, Layers, Lock, Upload } from 'lucide-react';

const FEATURES = [
  {
    title: "Zero-Knowledge Security",
    desc: "AES-256 encryption. Keys never leave your device.",
    icon: Shield,
    color: "text-primary"
  },
  {
    title: "Decentralized Storage",
    desc: "Stored across the Walrus network.",
    icon: Layers,
    color: "text-secondary"
  },
  {
    title: "Client-Side Recovery",
    desc: "Only the owner can decrypt files.",
    icon: Lock,
    color: "text-accent"
  },
  {
    title: "Batch Upload Support",
    desc: "Upload multiple encrypted files simultaneously.",
    icon: Upload,
    color: "text-emerald-400"
  }
];

export const FeatureGrid = () => {
  return (
    <div className="w-full glass-effect rounded-[40px] premium-shadow overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
        {FEATURES.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 md:p-12 space-y-6 group hover:bg-white/[0.02] transition-colors"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform duration-500`}>
              <f.icon className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white tracking-widest">{f.title}</h4>
              <p className="text-sm text-text-dim leading-relaxed font-medium">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
