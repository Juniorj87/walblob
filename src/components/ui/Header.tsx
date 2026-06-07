import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { ConnectButton } from '@mysten/dapp-kit';
import { useNetwork } from '../../context/NetworkContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Header = () => {
  const { network, setNetwork } = useNetwork();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-50 py-5 border-b border-white/5 backdrop-blur-xl bg-[#020617]/50 px-6"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center gap-3 group cursor-pointer">
           <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
             <Database className="w-5 h-5 text-black" />
           </div>
           <span className="text-xl font-display font-bold tracking-tight text-white">WalBlob</span>
        </a>
        
        <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-text-dim">
          <a href="/retrieve" className="hover:text-white transition-colors">
            Retrieve
          </a>
          <a href="#explorer" className="hover:text-white transition-colors">
            Explorer
          </a>
          {['Features', 'Security', 'FAQ'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
           {/* Subtle Network Switcher */}
           <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5">
              <button 
                onClick={() => setNetwork('testnet')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                  network === 'testnet' ? "bg-white/10 text-white" : "text-text-dim hover:text-white"
                )}
              >
                Testnet
              </button>
              <button 
                onClick={() => setNetwork('mainnet')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                  network === 'mainnet' ? "bg-emerald-500/20 text-emerald-400" : "text-text-dim hover:text-white"
                )}
              >
                Mainnet
              </button>
           </div>

           <ConnectButton className="!bg-white !text-black !rounded-full !px-8 !py-2.5 !font-bold !text-[11px] !uppercase !tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]" />
        </div>
      </div>
    </motion.nav>
  );
};
