import { motion } from 'framer-motion';
import { Package, Search, History } from 'lucide-react';

const PRODUCT_FEATURES = [
  {
    title: "Recovery Packages",
    desc: "Download portable recovery packages containing Blob ID and recovery information.",
    icon: Package,
    color: "text-primary"
  },
  {
    title: "Blob Explorer",
    desc: "Inspect blob availability and status without decrypting files.",
    icon: Search,
    color: "text-accent"
  },
  {
    title: "Local Vault History",
    desc: "Manage recent uploads locally without storing sensitive keys.",
    icon: History,
    color: "text-secondary"
  }
];

export const ProductFeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {PRODUCT_FEATURES.map((f, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.8 }}
          className="p-10 md:p-14 glass-v3 inner-glow rounded-[48px] premium-shadow group hover:bg-white/[0.04] transition-all duration-700 relative overflow-hidden flex flex-col items-start"
        >
          <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-10 border border-white/5 ${f.color} group-hover:scale-110 group-hover:border-white/10 transition-all duration-500`}>
            <f.icon className="w-8 h-8" />
          </div>
          <div className="space-y-4 flex-1">
            <h4 className="text-2xl font-display font-bold text-white tracking-tight">{f.title}</h4>
            <p className="text-text-dim text-lg font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-500">{f.desc}</p>
          </div>
          
          {/* Subtle Accent Glow */}
          <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] rounded-full translate-x-24 -translate-y-24 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-current pointer-events-none`} />
          
          {/* Visual Light Sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
};
