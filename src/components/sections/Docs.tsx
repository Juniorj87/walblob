import { motion } from 'framer-motion';
import { Lock, Database, Share2, ArrowLeft, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/[0.03] backdrop-blur-[32px] rounded-[32px] p-8 md:p-12 border border-white/5 shadow-2xl ${className}`}>
    {children}
  </div>
);

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans relative overflow-x-hidden pt-20 pb-40">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a href="/" className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-[0.2em]">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </a>

          <header className="mb-24">
            <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase mb-8 leading-[0.85]">
              Technical <br />
              <span className="text-[#00D1FF]">Architecture</span>
            </h1>
            <p className="text-xl text-[#94A3B8] font-medium italic leading-relaxed max-w-2xl">
              WalBlob protocol: How we secure your data through stateless client-side encryption and Walrus decentralized storage.
            </p>
          </header>

          <section className="space-y-32">
            {/* STEP 1: Encryption */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-14 h-14 bg-[#00D1FF]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#00D1FF]/20">
                  <Lock className="text-[#00D1FF] w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">1. Local Sealing</h3>
                <p className="text-[#94A3B8] leading-relaxed mb-6">
                  Before transmission, files are encrypted in your browser's RAM using <strong>AES-256-GCM</strong>. 
                  We generate a unique 12-byte IV (Initialization Vector) for every upload.
                </p>
                <ul className="space-y-3 text-sm font-bold text-white/60">
                   <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00FFA3]" /> No raw data on network</li>
                   <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00FFA3]" /> Private decryption keys</li>
                </ul>
              </div>
              <div className="bg-black/60 rounded-[32px] p-8 border border-white/5 font-mono text-[11px] text-[#00D1FF]/60 shadow-2xl">
                <div className="flex gap-2 mb-6">
                   <div className="w-2 h-2 rounded-full bg-red-500/50" />
                   <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <p className="text-white/20 mb-2">// Web Crypto API</p>
                <p>const key = await crypto.subtle.generateKey(<br />&nbsp;&nbsp;{'{'} name: 'AES-GCM', length: 256 {'}'}, true, ['encrypt']<br />);</p>
                <p className="mt-4 text-white/20 mb-2">// Locally Encrypting...</p>
                <p>const cipher = await crypto.subtle.encrypt(<br />&nbsp;&nbsp;{'{'} name: 'AES-GCM', iv {'}'}, key, fileBuffer<br />);</p>
              </div>
            </div>

            {/* PROTOCOL VISUAL */}
            <div className="py-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-center text-white/20">Infrastructure Flow</h3>
              <GlassCard className="bg-black/20 text-center">
                 <div className="flex flex-col items-center gap-6">
                    <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-xs">Client Browser</div>
                    <div className="h-12 w-px bg-gradient-to-b from-[#00D1FF] to-transparent" />
                    <div className="px-8 py-4 bg-[#00D1FF]/10 border border-[#00D1FF]/20 rounded-2xl text-[#00D1FF] font-black uppercase tracking-widest text-xs animate-pulse">Walrus Publisher</div>
                    <div className="h-12 w-px bg-gradient-to-b from-[#7B61FF] to-transparent" />
                    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                       {[1,2,3].map(i => (
                         <div key={i} className="py-4 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-bold text-white/30 uppercase tracking-widest">Shard Node {i}</div>
                       ))}
                    </div>
                 </div>
              </GlassCard>
            </div>

            {/* STEP 2: Walrus */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative group">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover/opacity-100 transition-opacity duration-1000" />
                 <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-[48px] flex items-center justify-center p-20 relative z-10 transition-transform duration-700 group-hover:scale-105">
                    <Database className="w-full h-full text-[#7B61FF]/40" />
                 </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="w-14 h-14 bg-[#7B61FF]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#7B61FF]/20">
                  <Database className="text-[#7B61FF] w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">2. Erasure Coding</h3>
                <p className="text-[#94A3B8] leading-relaxed text-lg font-medium">
                  The Walrus protocol shreds your encrypted blob into redundant shards. 
                  Even if multiple storage nodes go offline, the file remains 100% reconstructible. 
                  You pay a one-time fee in <strong>SUI</strong> for the desired retention period.
                </p>
              </div>
            </div>

            {/* STEP 3: Retrieval */}
            <div className="pt-20">
              <div className="text-center mb-16">
                 <div className="w-14 h-14 bg-[#00FFA3]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#00FFA3]/20">
                   <Share2 className="text-[#00FFA3] w-7 h-7" />
                 </div>
                 <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">3. Anonymous Retrieval</h3>
                 <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
                   Files are retrieved via content-addressable <strong>Blob IDs</strong>. 
                   Since the data is encrypted, the network only serves opaque shards. 
                   Only the holder of the AES key can reconstruct and view the original data.
                 </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { title: 'Decentralized CDN', icon: Globe, color: 'text-[#00D1FF]' },
                   { title: 'Permanent Availability', icon: ShieldCheck, color: 'text-[#00FFA3]' },
                   { title: 'Stateless Links', icon: Share2, color: 'text-[#7B61FF]' }
                 ].map((item, i) => (
                   <GlassCard key={i} className="p-8 text-center hover:bg-white/[0.05] transition-all">
                      <item.icon className={`w-8 h-8 mx-auto mb-6 ${item.color}`} />
                      <div className="text-[11px] font-black uppercase tracking-[0.2em]">{item.title}</div>
                   </GlassCard>
                 ))}
              </div>
            </div>
          </section>

          <footer className="mt-48 pt-12 border-t border-white/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">WalBlob Technical Spec v1.02 • Sui Foundation</p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}

// Fixed feature card with LucideIcon type and CheckCircle2 with proper props
function FeatureCardFix({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-8 rounded-3xl group hover:bg-white/10 transition-all duration-500">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h4 className="text-white font-bold text-lg mb-3 tracking-tight">{title}</h4>
      <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// Silence unused warning for Fix component as it's a reference for correct typing
export { FeatureCardFix };
