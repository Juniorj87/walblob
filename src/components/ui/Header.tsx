import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { ConnectButton } from '@mysten/dapp-kit';

export const Header = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-50 py-6 border-b border-white/5 backdrop-blur-xl bg-black/20 px-6"
    >
      <div className="max-w-[1280px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
             <Database className="w-6 h-6 text-black" />
           </div>
           <span className="text-2xl font-display font-black tracking-tighter uppercase text-white tracking-widest">WalBlob</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          <a href="/retrieve" className="hover:text-white transition-colors relative group">
            Retrieve
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
          </a>
          {['Product', 'Security', 'FAQ'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
           <ConnectButton className="!bg-white !text-black !rounded-full !px-10 !py-3 !font-bold !text-[10px] !uppercase !tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)]" />
        </div>
      </div>
    </motion.nav>
  );
};
