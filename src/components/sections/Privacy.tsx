import { Shield, EyeOff, Lock, UserCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PremiumBackground } from '../animations/PremiumBackground';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';

export default function Privacy() {
  return (
    <div className="relative min-h-screen bg-background text-white font-sans selection:bg-primary/30">
      <PremiumBackground />
      <Header />

      <section className="relative pt-32 md:pt-48 pb-40 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-20 space-y-8">
            <a href="/" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-white transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </a>
            
            <h1 className="text-4xl md:text-8xl font-display font-bold tracking-tighter leading-[1] text-white">
              Privacy <br />
              <span className="text-gradient-premium">Manifesto</span>
            </h1>
            
            <p className="text-text-dim text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              WalBlob is architected on the principle of absolute statelessness. 
              Trust the mathematics, not the infrastructure.
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  icon: EyeOff, 
                  title: "Zero Tracking", 
                  desc: "No cookies. No IP logging. No analytics. We maintain zero databases for user metadata.",
                  color: "text-secondary" 
                },
                { 
                  icon: UserCheck, 
                  title: "Stateless Frontend", 
                  desc: "Files and keys exist only in your browser's session memory. Closing the tab purges all traces.",
                  color: "text-success" 
                },
                { 
                  icon: Shield, 
                  title: "Encrypted Identity", 
                  desc: "Your Sui wallet address is your only identifier. We never link it to real-world identities.",
                  color: "text-primary" 
                },
                { 
                  icon: Lock, 
                  title: "Your Keys, Your Data", 
                  desc: "Decryption keys never leave your device. Loss of a key means permanent loss of data access.",
                  color: "text-accent" 
                }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-[40px] glass-effect border border-white/5 hover:bg-white/[0.02] transition-all group space-y-8">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-display font-bold text-white tracking-tight">{item.title}</h4>
                    <p className="text-text-muted text-base leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-12 md:p-16 rounded-[48px] bg-white/[0.01] border border-white/5 space-y-8 relative overflow-hidden">
               <h3 className="text-2xl font-display font-bold text-white flex items-center gap-4 relative z-10">
                 <Lock className="w-6 h-6 text-primary" /> Self-Sovereign Compliance
               </h3>
               <p className="text-text-muted text-lg leading-relaxed font-medium relative z-10">
                  By utilizing the decentralized Walrus protocol, you exercise your fundamental right to data ownership. 
                  Stored blobs are immutable for the chosen retention period. As a stateless gateway, 
                  WalBlob does not process, store, or transmit personal data to centralized entities.
               </p>
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
            </div>
          </div>

          <div className="mt-24 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/10 italic">"Cryptography is the ultimate barrier against surveillance."</p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
