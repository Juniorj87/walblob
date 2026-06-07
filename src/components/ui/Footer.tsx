import { Database, Globe, Mail, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#020617] py-32 border-t border-white/5 px-6 relative z-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-32 text-left">
          <div className="col-span-1 md:col-span-2 space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <Database className="w-7 h-7 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold tracking-tight text-white">WalBlob</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1">Sovereign Data Storage</span>
              </div>
            </div>
            <p className="text-text-dim text-lg font-medium max-w-sm leading-relaxed opacity-70">
              Defining the next standard of decentralized privacy. 
              Zero-knowledge architecture powered by the Walrus protocol.
            </p>
            <div className="flex items-center gap-6">
               {[
                 { icon: ExternalLink, href: 'https://x.com/Soulpureaux' },
                 { icon: ExternalLink, href: 'https://github.com/Juniorj87/walblob' },
                 { icon: Mail, href: '#' }
               ].map((social, i) => (
                 <a key={i} href={social.href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-dim hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                    <social.icon className="w-5 h-5" />
                 </a>
               ))}
            </div>
          </div>
          
          <div className="space-y-10">
            <h6 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20">Platform</h6>
            <ul className="space-y-6">
              {[
                { name: 'Technical Docs', href: '/docs' },
                { name: 'Blob Explorer', href: '/retrieve' },
                { name: 'Network Status', href: '/status' },
                { name: 'Source Control', href: 'https://github.com/Juniorj87/walblob' }
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm font-bold text-text-muted hover:text-primary transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <h6 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20">Infrastructure</h6>
            <div className="space-y-8">
              <div className="space-y-3">
                 <p className="text-sm font-bold text-white tracking-wide">Walrus Testnet (Shandong)</p>
                 <p className="text-xs text-text-dim leading-relaxed">
                   High-performance decentralized sharding provided by Mysten Labs.
                 </p>
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-[0.2em] backdrop-blur-xl">
                v3.0.0-STABLE
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-white/5">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em]">© 2026 WALBLOB PROTOCOL · NO RIGHTS RESERVED</p>
            <p className="text-[9px] font-bold text-white/5 uppercase tracking-[0.2em]">Crafted for the decentralized era</p>
          </div>
          <div className="flex items-center gap-6 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] bg-white/[0.02] px-8 py-3.5 rounded-full border border-white/5 backdrop-blur-3xl shadow-xl">
            <Globe className="w-4 h-4 text-primary" /> Global Distributed Infrastructure
          </div>
        </div>
      </div>
      
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/5 blur-[160px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />
    </footer>
  );
};
