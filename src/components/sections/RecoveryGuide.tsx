import { motion } from 'framer-motion';
import { 
  UploadCloud, Hash, Key, RotateCcw, 
  ShieldCheck, ArrowRight, Save
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const steps = [
  {
    title: 'Upload File',
    desc: 'Select your data. It is encrypted locally in AES-256 before leaving your device.',
    icon: UploadCloud,
    color: 'primary'
  },
  {
    title: 'Receive ID',
    desc: 'Walrus generates a unique Blob ID. This is your public address for the data.',
    icon: Hash,
    color: 'secondary'
  },
  {
    title: 'Save Key',
    desc: 'Download your .walblob recovery package. This is your ONLY access key.',
    icon: Save,
    color: 'emerald-400'
  },
  {
    title: 'Return Anytime',
    desc: 'Your data is permanent on Walrus. Come back in a day, a year, or a decade.',
    icon: RotateCcw,
    color: 'primary'
  },
  {
    title: 'Enter Credentials',
    desc: 'Import your .walblob package or enter your ID + Key manually.',
    icon: Key,
    color: 'secondary'
  },
  {
    title: 'Recover Original',
    desc: 'The original file is reconstructed in your browser with full metadata.',
    icon: ShieldCheck,
    color: 'emerald-400'
  }
];

export const RecoveryGuide = () => {
  return (
    <section className="scroll-mt-32 md:scroll-mt-48">
      <div className="text-center mb-16 md:mb-24 space-y-4">
        <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase text-white leading-tight">
          How <span className="text-gradient">Recovery</span> Works
        </h2>
        <p className="text-text-muted text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed px-4">
          WalBlob is a zero-knowledge protocol. We do not store your keys. Follow this guide to ensure permanent access to your data.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="flex flex-col items-center text-center space-y-8 p-8 md:p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.05] hover:border-white/10 transition-all duration-700">
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-700 group-hover:scale-110",
                  step.color === 'primary' ? "bg-primary/10 text-primary group-hover:bg-primary/20" : 
                  step.color === 'secondary' ? "bg-secondary/10 text-secondary group-hover:bg-secondary/20" :
                  "bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-400/20"
                )}>
                  <step.icon className="w-8 h-8 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Step 0{i + 1}</span>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white tracking-widest">{step.title}</h3>
                  </div>
                  <p className="text-text-muted text-sm font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{step.desc}</p>
                </div>

                {i < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center pt-4">
                    <ArrowRight className="w-5 h-5 text-white/10 rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[44px] bg-emerald-400/5 border border-emerald-400/10 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h4 className="text-emerald-400 text-xs font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3">
              <ShieldCheck className="w-5 h-5" /> Permanent Security Guarantee
            </h4>
            <p className="text-text-muted text-sm md:text-base font-medium leading-relaxed max-w-3xl mx-auto opacity-80">
              Walrus distributes your data across dozens of independent nodes. Even if WalBlob disappears, your file remains accessible as long as you have your credentials.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
