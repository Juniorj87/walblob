import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Video, Copy, Database } from 'lucide-react';

const MOCK_FILES = [
  { name: 'Whitepaper.pdf', size: '2.4 MB', id: 'blob_8f2a...3c1e', icon: FileText },
  { name: 'Architecture.png', size: '15.8 MB', id: 'blob_4d91...9b02', icon: ImageIcon },
  { name: 'Video.mp4', size: '128.1 MB', id: 'blob_e7c5...f4d1', icon: Video },
];

export const ShowcaseCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-[550px] aspect-[550/620] glass-effect rounded-[32px] premium-shadow overflow-hidden flex flex-col group"
    >
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">WalBlob</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Upload History</h3>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">Active Session</div>
        </div>

        <div className="space-y-4">
          {MOCK_FILES.map((file, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 group/row hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover/row:text-primary transition-colors">
                  <file.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{file.name}</p>
                  <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-white/10">{file.id}</span>
                <button className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-white transition-all">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-8 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">Total Files</p>
          <p className="text-3xl font-display font-bold text-white">24</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">Total Size</p>
          <p className="text-3xl font-display font-bold text-white">146.3 <span className="text-sm text-white/20">MB</span></p>
        </div>
      </div>
      
      {/* Decorative Glow Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
    </motion.div>
  );
};
