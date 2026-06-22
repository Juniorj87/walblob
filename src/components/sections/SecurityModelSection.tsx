import { motion } from 'framer-motion';
import { Lock, Layers, Key, ShieldCheck, Terminal, KeyRound } from 'lucide-react';

const SECURITY_POINTS = [
  {
    title: "Seal Threshold Encryption",
    desc: "5-of-N threshold encryption via Mysten Seal. Keys are split across multiple key servers.",
    icon: KeyRound,
    cmd: "./seal --threshold=5 --network=sui-mainnet",
  },
  {
    title: "On-Chain Access Control",
    desc: "BlobRegistry smart contract on Sui Mainnet controls who can decrypt each blob.",
    icon: Lock,
    cmd: "./register --contract=blob_registry --mainnet",
  },
  {
    title: "Walrus Decentralized Storage",
    desc: "Encrypted blobs stored as quilts across 97+ storage nodes with erasure coding.",
    icon: Layers,
    cmd: "./store --network=walrus --epochs=26",
  },
  {
    title: "Session Key Recovery",
    desc: "Decrypt with your Sui wallet + on-chain seal_approve. No private keys in browser.",
    icon: Key,
    cmd: "./recover --session-key --seal-approve",
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
                <p className="pl-2">Mysten Seal + Walrus Network</p>
                <p className="pl-2">Live on Sui Mainnet.</p>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-2">
            {['Seal protocol live on Mainnet', 'Threshold encryption (5-of-N)', 'On-chain BlobRegistry access control'].map((text, i) => (
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
                  Seal Protocol Verified
                </h5>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Seal contract deployed on Sui Mainnet. BlobRegistry active.
                  Storage via Walrus Network (97 nodes, 1000 shards).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
