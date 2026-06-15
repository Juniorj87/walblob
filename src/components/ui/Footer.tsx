import { Terminal, Code2, MessageCircle, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-background-alt py-16 border-t border-border-subtle px-4 md:px-6 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-primary font-mono font-bold text-lg">W</span>
              </div>
              <div>
                <span className="text-xl font-display font-bold tracking-tight text-white">WalBlob</span>
                <span className="text-primary text-xs ml-1 font-mono">v3.0</span>
              </div>
            </div>
            <p className="text-text-muted text-sm font-medium max-w-xs leading-relaxed">
              Zero-knowledge encrypted storage powered by Walrus. Your data, your keys, your control.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: MessageCircle, href: 'https://x.com/Soulpureaux', label: 'Twitter' },
                { icon: Code2, href: 'https://github.com/Juniorj87/walblob', label: 'GitHub' },
                { icon: Mail, href: '#', label: 'Contact' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-background border border-border-subtle flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h6 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">Platform</h6>
            <ul className="space-y-3">
              {[
                { name: 'Documentation', href: '/docs' },
                { name: 'Blob Explorer', href: '/retrieve' },
                { name: 'Network Status', href: '/status' },
                { name: 'GitHub Repo', href: 'https://github.com/Juniorj87/walblob' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Network Info */}
          <div className="space-y-4">
            <h6 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">Network</h6>
            <div className="space-y-4">
              <div className="terminal-window rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary status-pulse" />
                  <span className="text-[10px] font-mono text-primary uppercase">Mainnet Active</span>
                </div>
                <p className="text-[11px] text-text-muted font-mono">
                  Walrus Protocol v3.0
                </p>
              </div>
              <div className="text-[10px] text-text-muted font-mono space-y-1">
                <p>Shard Count: Distributed</p>
                <p>Consensus: Proof of Stake</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
            <Terminal className="w-3 h-3" />
            <span>2026 WALBLOB PROTOCOL</span>
            <span className="text-primary">·</span>
            <span>OPEN SOURCE</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
            <span>Zero-Knowledge Architecture</span>
            <span className="text-primary">|</span>
            <span>AES-256 GCM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
