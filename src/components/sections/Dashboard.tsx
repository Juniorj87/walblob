import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, UploadCloud,
  Loader2, ShieldCheck,
  FileText,
  Download, QrCode as QrIcon, Trash2, Plus, Info, ArrowRight
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { useWalrus } from '../../hooks/useWalrus';
import { encryptFile } from '../../utils/encryption';
import { historyService } from '../../utils/history';
import { UploadHistory } from './UploadHistory';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Header } from '../ui/Header';
import { PremiumBackground } from '../animations/PremiumBackground';
import { RecoveryBlock } from './RecoveryBlock';
import { RecoveryGuide } from './RecoveryGuide';
import { Explorer } from './Explorer';
import { CopyButton } from '../ui/CopyButton';
import { FilePreview } from '../ui/FilePreview';
import { calculateHash } from '../../utils/hash';
import { useNetwork } from '../../context/NetworkContext';
import { UploadAnalyticsCard } from '../ui/UploadAnalyticsCard';
import { ShowcaseCard } from '../ui/ShowcaseCard';
import { FeatureGrid } from '../ui/FeatureGrid';
import { ProcessTimeline } from '../ui/ProcessTimeline';
import { VisualSecurityModel } from './VisualSecurityModel';
import { ProductFeatureCards } from './ProductFeatureCards';
import { FAQSection } from './FAQSection';
import { Footer } from '../ui/Footer';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RETENTION_OPTIONS = [
  { label: '14 Days', days: 14 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
  { label: '180 Days', days: 180 },
];

interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'encrypting' | 'uploading' | 'success' | 'error';
  progress: number;
  result?: { blobId: string; key: string; url: string };
  analytics?: {
    size: string;
    time: string;
    speed: string;
    network: string;
  };
  error?: string;
}

const SectionTitle = ({ children, subtitle, align = "center", badge }: { children: React.ReactNode, subtitle?: string, align?: "center" | "left", badge?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className={cn("mb-16 md:mb-24 space-y-6", align === "center" ? "text-center" : "text-left")}
  >
    {badge && (
      <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]", align === "center" && "mx-auto")}>
        {badge}
      </div>
    )}
    <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tighter text-white leading-[1.1]">
      {children}
    </h2>
    {subtitle && <p className={cn("text-text-muted text-lg md:text-xl font-medium max-w-2xl leading-relaxed", align === "center" && "mx-auto")}>{subtitle}</p>}
  </motion.div>
);

export default function Dashboard() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [retentionDays, setRetentionDays] = useState(30);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadStartTimeRef = useRef<number>(0);
  const appSectionRef = useRef<HTMLDivElement>(null);
  
  const { network } = useNetwork();

  useEffect(() => {
    if (showQR) {
      const url = `${window.location.origin}/retrieve?blob=${showQR}`;
      QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [showQR]);

  const { publishBlob, stats } = useWalrus();

  const updateItem = useCallback((id: string, updates: Partial<UploadQueueItem>) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processQueue = useCallback(async () => {
    const pending = queue.find(item => item.status === 'pending');
    if (!pending) return;

    updateItem(pending.id, { status: 'encrypting' });

    try {
      const { encryptedBlob, key } = await encryptFile(pending.file, true);
      updateItem(pending.id, { status: 'uploading' });
      uploadStartTimeRef.current = Date.now();
      const encryptedFile = new File([encryptedBlob], pending.file.name, { type: pending.file.type });
      const epochs = Math.max(1, Math.ceil(retentionDays / 30));
      const result = await publishBlob(encryptedFile, epochs);

      if (result) {
        const finalResult = { ...result, key };
        const duration = (Date.now() - uploadStartTimeRef.current) / 1000;
        updateItem(pending.id, { 
          status: 'success', 
          result: finalResult, 
          progress: 100,
          analytics: {
            size: formatSize(pending.file.size),
            time: duration > 60 ? `${(duration / 60).toFixed(1)}m` : `${duration.toFixed(1)}s`,
            speed: stats?.speed || 'Fast',
            network: network.toUpperCase()
          }
        });
        historyService.save({
          blobId: result.blobId,
          name: pending.file.name,
          size: pending.file.size,
          uploadedAt: Date.now(),
          url: result.url
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed';
      updateItem(pending.id, { status: 'error', error: errorMessage });
    }
  }, [queue, publishBlob, retentionDays, updateItem, stats, network]);

  useEffect(() => {
    const active = queue.some(item => item.status === 'encrypting' || item.status === 'uploading');
    if (!active) {
       const timer = setTimeout(() => {
          processQueue();
       }, 0);
       return () => clearTimeout(timer);
    }
  }, [queue, processQueue]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setSelectedFiles(Array.from(files));
  };

  const confirmAndUpload = () => {
    if (!selectedFiles) return;
    const newItems: UploadQueueItem[] = selectedFiles.map(f => ({
      id: Math.random().toString(36).slice(2, 11),
      file: f,
      status: 'pending',
      progress: 0
    }));
    setQueue(prev => [...prev, ...newItems]);
    setSelectedFiles(null);
  };

  const downloadRecoveryPackage = async (item: UploadQueueItem) => {
    if (!item.result) return;
    const fileHash = await calculateHash(item.file);
    const nowTimestamp = new Date().getTime();
    const pkg = {
      blobId: item.result.blobId,
      key: item.result.key,
      metadata: {
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
        uploadedAt: nowTimestamp,
        hash: fileHash
      },
      version: '3.0.0'
    };
    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.file.name}.walblob`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToApp = () => {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 text-white font-sans">
      <PremiumBackground />
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* LEFT COLUMN: MESSAGING */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10 text-left relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl">
              <Lock className="w-3.5 h-3.5" /> Secure. Private. Decentralized.
            </div>

            <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter leading-[0.95] text-white">
              Secure zero-knowledge <br />
              <span className="text-gradient-premium">encrypted</span> file storage <br />
              powered by <span className="text-gradient-premium">Walrus</span>
            </h1>

            <p className="text-text-muted text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Encrypt your files locally before upload. Only you control the encryption key. 
              Store, recover and share data through Walrus without exposing your content.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button 
                onClick={scrollToApp}
                className="px-10 py-5 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group"
              >
                Launch App <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: SHOWCASE CARD */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <ShowcaseCard />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 space-y-40 md:space-y-64 pb-40 relative z-10">
        
        {/* FEATURES SECTION */}
        <section>
          <FeatureGrid />
        </section>

        {/* HOW IT WORKS SECTION */}
        <section>
          <SectionTitle 
            badge="The Process"
            subtitle="Understand the end-to-end journey of your encrypted data, from local selection to decentralized storage."
          >
            How It Works
          </SectionTitle>
          <ProcessTimeline />
        </section>

        {/* FUNCTIONAL APP SECTION (UPLOAD ZONE) */}
        <section ref={appSectionRef} id="app" className="scroll-mt-32">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[48px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative bg-[#020617]/80 backdrop-blur-[60px] rounded-[44px] border border-white/10 shadow-2xl overflow-hidden">
               <div className="p-4 md:p-8">
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    className={cn(
                      "relative group/drop cursor-pointer rounded-[36px] transition-all duration-700",
                      queue.length === 0 && !selectedFiles ? "h-[450px] md:h-[550px] flex flex-col items-center justify-center" : "p-8",
                      "bg-white/[0.02] border-2 border-dashed",
                      isDragging ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                    )}
                  >
                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                    
                    {queue.length === 0 && !selectedFiles ? (
                      <div onClick={() => fileInputRef.current?.click()} className="relative z-10 flex flex-col items-center gap-10 text-center w-full max-w-xl px-6">
                        <div className="relative">
                          <motion.div 
                            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                            className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center shadow-2xl group-hover/drop:border-primary/40 transition-all duration-500"
                          >
                             <UploadCloud className={cn("w-10 h-10 md:w-14 md:h-14 transition-all duration-500", isDragging ? "text-primary" : "text-white/20 group-hover/drop:text-primary")} />
                          </motion.div>
                        </div>
                        <div className="space-y-4">
                           <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
                             <span className="text-primary">Drag & Drop</span> to Seal
                           </h2>
                           <p className="text-text-muted text-base font-medium opacity-60">Professional encrypted batch upload (v3.0)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        {selectedFiles && (
                           <div className="space-y-10">
                              <div className="flex justify-between items-center px-4">
                                 <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Selection Preview</h3>
                                 <button onClick={() => setSelectedFiles(null)} className="text-[10px] font-bold uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-colors">Cancel</button>
                              </div>
                              <div className="space-y-4">
                                 {selectedFiles.map((file, i) => (
                                    <FilePreview key={i} file={file} />
                                 ))}
                              </div>

                              <div className="bg-white/[0.03] rounded-3xl border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-10">
                                 <div className="space-y-6 text-left w-full md:w-auto">
                                    <div className="flex items-center gap-3">
                                       <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Storage Duration</label>
                                       <Info className="w-3.5 h-3.5 text-white/20 cursor-help" />
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                       {RETENTION_OPTIONS.map((opt) => (
                                          <button
                                             key={opt.days}
                                             onClick={() => setRetentionDays(opt.days)}
                                             className={cn(
                                                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                                retentionDays === opt.days 
                                                   ? "bg-primary text-white shadow-[0_0_20px_rgba(79,124,255,0.3)]" 
                                                   : "bg-white/5 text-white/40 border border-white/5 hover:border-white/10"
                                             )}
                                          >
                                             {opt.label}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <button 
                                    onClick={confirmAndUpload}
                                    className="w-full md:w-auto px-12 py-6 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4"
                                 >
                                    <Lock className="w-5 h-5" /> Confirm & Seal
                                 </button>
                              </div>
                           </div>
                        )}

                        {queue.length > 0 && (
                           <div className="space-y-8 pt-10 border-t border-white/5">
                              <div className="flex justify-between items-center px-4">
                                 <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Upload Queue</h3>
                                 <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" /> Add More
                                 </button>
                              </div>
                              
                              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                 <AnimatePresence mode="popLayout">
                                    {queue.map((item) => (
                                    <motion.div 
                                       key={item.id}
                                       initial={{ opacity: 0, x: -10 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       exit={{ opacity: 0, scale: 0.95 }}
                                       className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 flex flex-col gap-6 group/item"
                                    >
                                       <div className="flex items-center justify-between gap-4">
                                          <div className="flex items-center gap-5 min-w-0">
                                             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                                                {item.status === 'success' ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <FileText className="w-6 h-6 text-white/20" />}
                                             </div>
                                             <div className="min-w-0">
                                                <p className="text-sm font-bold text-white truncate max-w-[250px]">{item.file.name}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{formatSize(item.file.size)} · {item.status}</p>
                                             </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-4">
                                             {(item.status === 'encrypting' || item.status === 'uploading') && (
                                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                             )}
                                             {item.status === 'success' && (
                                                <div className="flex items-center gap-2">
                                                   <button onClick={() => downloadRecoveryPackage(item)} className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-all" title="Download .walblob package">
                                                      <Download className="w-5 h-5" />
                                                   </button>
                                                   <button onClick={() => setShowQR(item.result?.blobId || null)} className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all">
                                                      <QrIcon className="w-5 h-5" />
                                                   </button>
                                                </div>
                                             )}
                                             <button 
                                                onClick={() => setQueue(prev => prev.filter(i => i.id !== item.id))}
                                                className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover/item:opacity-100"
                                             >
                                                <Trash2 className="w-5 h-5" />
                                             </button>
                                          </div>
                                       </div>

                                       {item.status === 'uploading' && stats && (
                                          <div className="space-y-3 px-2">
                                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${stats.percentage}%` }} className="h-full bg-primary shadow-[0_0_15px_rgba(79,124,255,0.5)]" />
                                             </div>
                                             <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/30">
                                                <span>{stats.speed}</span>
                                                <span>{stats.remaining} left</span>
                                             </div>
                                          </div>
                                       )}

                                       {item.status === 'success' && item.analytics && (
                                          <UploadAnalyticsCard 
                                             size={item.analytics.size}
                                             time={item.analytics.time}
                                             speed={item.analytics.speed}
                                             network={item.analytics.network}
                                             className="mt-2"
                                          />
                                       )}

                                       {item.result && (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 pt-6 border-t border-white/5">
                                             <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center group/sub">
                                                <p className="text-[10px] font-mono text-white/30 truncate pr-4">{item.result.blobId}</p>
                                                <CopyButton text={item.result.blobId} className="bg-white/5 border-none p-2 rounded-lg" />
                                             </div>
                                             <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center group/sub">
                                                <p className="text-[10px] font-mono text-white/30 truncate pr-4">{item.result.key}</p>
                                                <CopyButton text={item.result.key} className="bg-white/5 border-none p-2 rounded-lg" />
                                             </div>
                                          </div>
                                       )}
                                    </motion.div>
                                    ))}
                                 </AnimatePresence>
                              </div>

                              <div className="pt-8 border-t border-white/5 flex justify-between items-center px-4">
                                 <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-3">
                                    <Shield className="w-4 h-4" /> AES-256 GCM SEALED
                                 </div>
                                 <button 
                                    onClick={() => setQueue([])}
                                    className="text-[10px] font-bold uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-colors"
                                 >
                                    Clear Queue
                                 </button>
                              </div>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* SECURITY MODEL SECTION */}
        <VisualSecurityModel />

        {/* PRODUCT FEATURES SECTION */}
        <section>
          <SectionTitle 
            badge="Product Features"
            subtitle="Powerful tools designed to give you complete control over your decentralized data assets."
          >
            The Platform
          </SectionTitle>
          <ProductFeatureCards />
        </section>

        {/* EXPLORER PREVIEW SECTION */}
        <section>
          <SectionTitle 
            badge="Blob Explorer"
            subtitle="Inspect blob availability and status across the global Walrus network in real-time."
          >
            Network Explorer
          </SectionTitle>
          <Explorer />
        </section>

        {/* LOCAL HISTORY SECTION */}
        <section>
          <SectionTitle 
            badge="Vault History"
            subtitle="Access your recent upload metadata locally. No data is stored on our servers."
          >
            Local History
          </SectionTitle>
          <UploadHistory />
        </section>

        {/* RECOVERY SECTION */}
        <section>
          <SectionTitle 
            badge="Data Recovery"
            subtitle="Reconstruct your original files using your decryption key and Blob ID."
          >
            Secure Retrieval
          </SectionTitle>
          <RecoveryBlock />
          <div className="mt-20">
            <RecoveryGuide />
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq">
          <SectionTitle 
            badge="Security FAQ"
            subtitle="Common questions regarding our zero-knowledge architecture and Walrus storage."
          >
            Questions & Answers
          </SectionTitle>
          <FAQSection />
        </section>

      </main>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQR(null)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-[#030712] rounded-[48px] border border-white/10 p-12 md:p-16 max-w-sm w-full text-center space-y-10">
               <h4 className="text-2xl font-display font-bold text-white tracking-tight">Mobile Recovery</h4>
               <div className="bg-white p-6 rounded-[32px] inline-block shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  {qrDataUrl && <img src={qrDataUrl} alt="Recovery QR" className="w-[180px] h-[180px]" />}
               </div>
               <p className="text-text-muted text-sm leading-relaxed font-medium">Scan to open the recovery screen on your mobile device. Keys are entered manually for maximum security.</p>
               <button onClick={() => setShowQR(null)} className="w-full bg-white/5 border border-white/10 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Close Window</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
