import { motion } from 'framer-motion';
import { Lock, Layers, Key, ShieldCheck, Terminal } from 'lucide-react';

const SECURITY_POINTS = [
  {
    title: "Client-Side Sealing",
    desc: "AES-256 GCM encryption in your browser. Raw files and keys never touch our servers.",
    icon: Lock,
    cmd: "./encrypt --mode=aes256gcm",
  },
  {
    title: "Decentralized Sharding",
    desc: "Data fragmented and distributed across the global Walrus network.",
    icon: Layers,
    cmd: "./distribute --network=walrus",
  },
  {
    title: "Integrity Verification",
    desc: "SHA-256 hashes embedded in encrypted metadata to prevent tampering.",
    icon: ShieldCheck,
    cmd: "./verify --hash=sha256",
  },
  {
    title: "Zero-Knowledge Recovery",
    desc: "Only the private key holder can reconstruct the blob. Zero access for us.",
    icon: Key,
    cmd: "./recover --zero-knowledge",
  },
];

export const SecurityModelSection = () => {
  return (
    <section className="scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Left: Info */}
        <div className="space-y-4">
          {/* Terminal Window */}
          <div className="terminal-window rounded-xl">
            <div className="terminal-header px-4 py-2.5 flex items-center gap-2">
              <div className="terminal-dot bg-secondary/80" />
              <div className="terminal-dot bg-accent/80" />
              <div className="terminal-dot bg-primary/80" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
                <span className="text-primary">$</span>
                <span className="text-accent">cat</span>
                <span>security-overview.md</span>
              </div>
              <div className="pl-4 space-y-2 text-[11px] font-mono text-text-muted">
                <p><span className="text-primary">#</span> WalBlob Security Architecture</p>
                <p className="pl-2">Military-grade encryption meets</p>
                <p className="pl-2">decentralized storage.</p>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-2">
            {['No registration required', 'Military-grade encryption', 'Permanent storage options'].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-mono text-primary"
              >
                <ShieldCheck className="w-4 h-4" />
                {text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Security Points */}
        <div className="space-y-2">
          {SECURITY_POINTS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="terminal-window rounded-lg p-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-display font-bold text-white uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-text-muted pl-11">
                <Terminal className="w-2.5 h-2.5" />
                <span className="text-primary">$</span>
                <span className="text-accent">{item.cmd}</span>
              </div>
            </motion.div>
          ))}

          {/* Verification Badge */}
          <div className="terminal-window rounded-lg p-3 border-l-2 border-l-success">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[10px] font-mono text-success uppercase tracking-wider mb-1">
                  Protocol Verified
                </h5>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Full support for SHA-256 integrity checks and metadata-aware retrieval.
                  Storage provided by the Walrus Network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
