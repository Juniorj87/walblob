import { motion } from 'framer-motion';
import { 
  FileText, Image, Video, Music, 
  Archive, File, FileDigit, Calendar,
  Package
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FilePreviewProps {
  file: File;
  onClear?: () => void;
  className?: string;
}

const ICON_MAP = {
  image: Image,
  video: Video,
  audio: Music,
  pdf: FileText,
  archive: Archive,
  doc: FileText,
  code: FileDigit,
  default: File
};

const FileTypeIcon = ({ type, className }: { type: string; className?: string }) => {
  if (type.startsWith('image/')) return <ICON_MAP.image className={className} />;
  if (type.startsWith('video/')) return <ICON_MAP.video className={className} />;
  if (type.startsWith('audio/')) return <ICON_MAP.audio className={className} />;
  if (type.includes('pdf')) return <ICON_MAP.pdf className={className} />;
  if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar') || type.includes('compressed')) return <ICON_MAP.archive className={className} />;
  if (type.includes('word') || type.includes('document') || type.includes('text/plain')) return <ICON_MAP.doc className={className} />;
  if (type.includes('json') || type.includes('javascript') || type.includes('typescript')) return <ICON_MAP.code className={className} />;
  return <ICON_MAP.default className={className} />;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(timestamp));
};

export const FilePreview = ({ file, className }: FilePreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-left relative overflow-hidden group/preview shadow-xl",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full translate-x-16 -translate-y-16 pointer-events-none" />
      
      <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-[28px] border border-white/5 flex items-center justify-center shrink-0 relative group-hover/preview:border-primary/20 transition-all duration-700">
        <FileTypeIcon type={file.type} className="w-10 h-10 md:w-12 md:h-12 text-primary" />
      </div>

      <div className="flex-1 space-y-6 w-full relative z-10">
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-2 truncate max-w-[280px] md:max-w-md">
            {file.name}
          </h3>
          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-text-dim">
            <span className="flex items-center gap-2"><Package className="w-3.5 h-3.5 opacity-50" /> {formatSize(file.size)}</span>
            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 opacity-50" /> {formatDate(file.lastModified)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
            {file.type || 'RAW BLOB'}
          </div>
          <div className="px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Ready to Seal
          </div>
        </div>
      </div>
    </motion.div>
  );
};
