import { motion } from 'framer-motion';
import { ConnectButton } from '@mysten/dapp-kit';
import { useNetwork } from '../../context/NetworkContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Security', href: '#security' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Explorer', href: '#explorer' },
];

export const Header = () => {
  const { network, setNetwork } = useNetwork();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-50 py-4 px-6"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="glass-v3 inner-glow rounded-full px-6 md:px-8 py-3 flex items-center justify-between backdrop-blur-3xl border-white/[0.05]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img 
              src="/walblob-logo.png?v=1" 
              alt="WalBlob Logo" 
              className="h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-500" 
            />
            <span className="text-xl font-display font-bold tracking-tight text-white">WalBlob</span>
          </a>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-[13px] font-medium text-text-muted hover:text-white transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5">
              <button 
                onClick={() => setNetwork('testnet')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                  network === 'testnet' ? "bg-white/10 text-white" : "text-text-muted hover:text-white"
                )}
              >
                Testnet
              </button>
              <button 
                onClick={() => setNetwork('mainnet')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                  network === 'mainnet' ? "bg-primary/20 text-primary" : "text-text-muted hover:text-white"
                )}
              >
                Mainnet
              </button>
            </div>

            <ConnectButton className="!bg-white !text-black !rounded-full !px-6 !py-2.5 !font-bold !text-[11px] !uppercase !tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)] btn-lift" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
