import { motion } from 'framer-motion';
import { Lock, File, Share2, ArrowLeft, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PremiumBackground } from '../animations/PremiumBackground';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Docs() {
  return (
    <div className="relative min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      <PremiumBackground />
      <Header />

      <section className="relative pt-32 md:pt-48 pb-40 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl"
        >
          <div className="mb-20 space-y-8">
            <a href="/" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-white transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </a>
            
            <h1 className="text-4xl md:text-8xl font-display font-bold tracking-tighter leading-[1] text-white">
              Technical <br />
              <span className="text-gradient-premium">Architecture</span>
            </h1>
            
            <p className="text-text-dim text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
              Exploring the stateless client-side encryption and decentralized sharding protocol that powers WalBlob.
            </p>
          </div>

          <div className="space-y-40">
            {/* STEP 1: Encryption */}
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Lock className="text-primary w-7 h-7" />
                </div>
                <h3 className="text-3xl font-display font-bold text-white tracking-tight">1. Local Sealing</h3>
                <p className="text-text-muted text-lg leading-relaxed font-medium">
                  Before transmission, files are encrypted in your browser's RAM using <strong>AES-256-GCM</strong>. 
                  Every upload generates a unique 12-byte cryptographically secure IV.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-sm font-bold text-white/60 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> No raw data on network
                   </div>
                   <div className="flex items-center gap-4 text-sm font-bold text-white/60 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Private non-custodial keys
                   </div>
                </div>
              </div>
              <div className="bg-black/60 rounded-[40px] p-10 border border-white/5 font-mono text-[12px] text-primary/70 shadow-2xl backdrop-blur-xl relative group">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex gap-2 mb-8 relative z-10">
                   <div className="w-3 h-3 rounded-full bg-red-500/30" />
                   <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                </div>
                <div className="space-y-4 relative z-10">
                  <p className="text-white/20">// Web Crypto API</p>
                  <p>const key = await crypto.subtle.generateKey(<br />&nbsp;&nbsp;{'{'} name: 'AES-GCM', length: 256 {'}'}, true, ['encrypt']<br />);</p>
                  <p className="pt-4 text-white/20">// Secure Fragmenting...</p>
                  <p>const cipher = await crypto.subtle.encrypt(<br />&nbsp;&nbsp;{'{'} name: 'AES-GCM', iv {'}'}, key, buffer<br />);</p>
                </div>
              </div>
            </div>

            {/* PROTOCOL VISUAL */}
            <div className="py-20 text-center space-y-12">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Data Lifecycle Flow</h3>
              <div className="p-12 md:p-20 rounded-[48px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
                 <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-2xl">Client Browser</div>
                    <div className="h-16 w-px bg-gradient-to-b from-primary to-transparent" />
                    <div className="px-10 py-5 bg-primary/10 border border-primary/20 rounded-2xl text-primary font-bold uppercase tracking-widest text-xs shadow-[0_0_40px_rgba(79,124,255,0.2)] animate-pulse">Walrus Publisher</div>
                    <div className="h-16 w-px bg-gradient-to-b from-secondary to-transparent" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="py-5 bg-black/40 border border-white/5 rounded-2xl text-[10px] font-bold text-white/20 uppercase tracking-widest">Shard Node 0{i}</div>
                       ))}
                    </div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] pointer-events-none" />
              </div>
            </div>

            {/* STEP 2: Walrus */}
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="order-2 md:order-1 relative group">
                 <div className="absolute inset-0 bg-secondary/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-[48px] flex items-center justify-center p-20 relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:bg-white/[0.04]">
                    <File className="w-full h-full text-secondary/40" />
                    </div>
                    </div>
                    <div className="space-y-8">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20">
                    <File className="text-secondary w-7 h-7" />
                    </div>
                <h3 className="text-3xl font-display font-bold text-white tracking-tight">2. Redundant Sharding</h3>
                <p className="text-text-muted text-lg leading-relaxed font-medium">
                  Walrus fragments your encrypted blob into redundant shards. 
                  Even if multiple storage nodes go offline, the file remains 100% reconstructible. 
                  One-time SUI payment guarantees retention.
                </p>
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-secondary/5 border border-secondary/10 w-fit">
                   <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Erasure Coding Protocol</span>
                </div>
              </div>
            </div>

            {/* STEP 3: Retrieval */}
            <div className="py-20 text-center space-y-16">
              <div className="space-y-8 max-w-3xl mx-auto">
                 <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
                   <Share2 className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter">Zero-Knowledge Recovery</h3>
                 <p className="text-lg md:text-xl text-text-dim leading-relaxed font-medium">
                   Retrieval is performed via content-addressable <strong>Blob IDs</strong>. 
                   The network serves opaque shards—only the AES key holder can reconstruct the data.
                 </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { title: 'Global CDN', icon: Globe, color: 'text-primary' },
                   { title: 'Permanent Shards', icon: ShieldCheck, color: 'text-emerald-400' },
                   { title: 'Stateless Links', icon: Share2, color: 'text-secondary' }
                 ].map((item, i) => (
                   <div key={i} className="p-10 rounded-[40px] glass-effect border border-white/5 text-center hover:bg-white/[0.03] transition-all group">
                      <item.icon className={cn("w-10 h-10 mx-auto mb-8 transition-transform duration-500 group-hover:scale-110", item.color)} />
                      <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/60 group-hover:text-white">{item.title}</div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="mt-40 flex justify-center">
            <a href="/" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-white transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
