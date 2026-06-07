import { motion } from 'framer-motion';
import { Lock, Layers, Key, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SECURITY_POINTS = [
  {
    title: "Client-Side Sealing",
    desc: "AES-256 GCM encryption happens in your browser. Your raw files and keys never touch our servers.",
    icon: Lock,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Decentralized Sharding",
    desc: "Data is fragmented and distributed across the global Walrus network for 100% censorship resistance.",
    icon: Layers,
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    title: "Integrity Verification",
    desc: "SHA-256 hashes are embedded in encrypted metadata to prevent tampering and ensure data authenticity.",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    title: "Zero-Knowledge Recovery",
    desc: "Only the holder of the private key can reconstruct the blob. WalBlob has zero access to your data.",
    icon: Key,
    color: "text-white",
    bg: "bg-white/10"
  }
];

export const SecurityModelSection = () => {
  return (
    <section className="scroll-mt-48">
      <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-start">
        <div className="space-y-16">
          <div className="text-left space-y-6">
            <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase text-white leading-tight">
              Security <br />
              <span className="text-primary">First.</span> <br />
              Always.
            </h2>
            <p className="text-text-muted text-base md:text-lg font-medium max-w-xl leading-relaxed">
              WalBlob isn't just a storage interface—it's a cryptographic fortress. 
              We've combined industry-standard encryption with the next generation 
              of decentralized storage.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            {['No registration required', 'Military-grade encryption', 'Permanent storage options'].map((text, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-white/80 backdrop-blur-md">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> {text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative space-y-6">
          {SECURITY_POINTS.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative"
            >
              <div className={cn(
                "flex items-center gap-8 p-8 rounded-[32px] border transition-all duration-700 backdrop-blur-3xl bg-white/5 border-white/10 group-hover:bg-white/[0.08] group-hover:border-white/20"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform duration-500 group-hover:scale-110",
                  item.bg, item.color
                )}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2 text-left">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white tracking-widest group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-text-muted text-sm font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>
                </div>
              </div>
              {i < SECURITY_POINTS.length - 1 && (
                <div className="flex justify-center h-6">
                  <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Verification Badge */}
          <div className="mt-8 p-8 rounded-[32px] bg-emerald-400/5 border border-emerald-400/10 text-left relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 space-y-3">
              <h5 className="text-emerald-400 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" /> V2.2 Protocol Verified
              </h5>
              <p className="text-text-muted text-sm font-medium leading-relaxed opacity-80">
                Full support for SHA-256 integrity checks and metadata-aware retrieval. 
                Storage provided by the Walrus Testnet (Shandong).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
