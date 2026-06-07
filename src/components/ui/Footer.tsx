import { Database, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-background py-32 border-t border-white/5 px-6 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-32 mb-32 text-left">
          <div className="col-span-1 md:col-span-2 space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-center">
                <Database className="w-7 h-7 text-black mx-auto" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold tracking-tight text-white">WalBlob</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Zero-Knowledge Storage</span>
              </div>
            </div>
            <p className="text-text-dim text-lg font-medium max-w-sm leading-relaxed">
              Transforming decentralized storage into a seamless enterprise experience. 
              Built for speed, security, and absolute privacy.
            </p>
          </div>
          
          <div className="space-y-10">
            <h6 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Ecosystem</h6>
            <ul className="space-y-6 text-sm font-bold text-text-muted">
              <li><a href="/docs" className="hover:text-white transition-all">Documentation</a></li>
              <li><a href="/retrieve" className="hover:text-white transition-all">Explorer</a></li>
              <li><a href="https://github.com/Juniorj87/walblob" target="_blank" rel="noreferrer" className="hover:text-white transition-all">GitHub</a></li>
              <li><a href="/status" className="hover:text-white transition-all">Status</a></li>
            </ul>
          </div>

          <div className="space-y-10">
            <h6 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Protocol</h6>
            <div className="space-y-8">
              <p className="text-sm font-bold text-text-muted">Built on Sui + Walrus</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-primary uppercase tracking-widest">
                v3.0-Stable
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-white/5">
          <p className="text-xs font-bold text-white/10 uppercase tracking-widest">© 2026 WALBLOB · ALL RIGHTS RESERVED</p>
          <div className="flex items-center gap-6 text-white/20 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5">
            <Globe className="w-4 h-4" /> Global Distributed Infrastructure
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
    </footer>
  );
};
