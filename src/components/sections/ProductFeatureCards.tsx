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
    color: "text-secondary"
  },
  {
    title: "Local Vault History",
    desc: "Manage recent uploads locally without storing sensitive keys.",
    icon: History,
    color: "text-accent"
  }
];

export const ProductFeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {PRODUCT_FEATURES.map((f, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-10 md:p-12 glass-effect rounded-[40px] premium-shadow group hover:bg-white/[0.03] transition-all duration-700 relative overflow-hidden"
        >
          <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 ${f.color} group-hover:scale-110 transition-all duration-500`}>
            <f.icon className="w-7 h-7" />
          </div>
          <h4 className="text-xl font-display font-bold text-white mb-6 tracking-tight">{f.title}</h4>
          <p className="text-text-muted text-base font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{f.desc}</p>
          
          {/* Subtle Accent Glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full translate-x-16 -translate-y-16 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 bg-current`} />
        </motion.div>
      ))}
    </div>
  );
};
