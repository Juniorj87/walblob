import { motion } from 'framer-motion';
import { ConnectButton } from '@mysten/dapp-kit';

const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'Protocol', href: '#how-it-works' },
  { name: 'Security', href: '#security' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Explorer', href: '#explorer' },
];

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 py-3 px-4 md:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <nav className="terminal-window rounded-xl px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
              <span className="text-primary font-mono font-bold text-sm">W</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold tracking-tight text-white">WalBlob</span>
              <span className="text-primary text-xs ml-1 font-mono">v3.0</span>
            </div>
          </a>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-xs font-medium text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
              <div className="w-1.5 h-1.5 rounded-full bg-primary status-pulse" />
              <span className="text-[10px] font-mono text-primary uppercase">Seal Active</span>
            </div>

            {/* Wallet Connect */}
            <ConnectButton
              className="!bg-primary !text-black !rounded-lg !px-4 !py-2 !font-bold !text-xs !uppercase !tracking-wider transition-all hover:scale-105 active:scale-95 btn-terminal"
            />
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
