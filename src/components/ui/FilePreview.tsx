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
        "terminal-window rounded-lg p-4 flex items-center gap-4 group/preview",
        className
      )}
    >
      {/* File Icon */}
      <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover/preview:border-primary/40 transition-all">
        <FileTypeIcon type={file.type} className="w-5 h-5 text-primary" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-display font-bold text-white truncate">
          {file.name}
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted mt-1">
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(file.lastModified)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="px-2 py-1 rounded text-[9px] font-mono text-text-muted bg-background border border-border-subtle uppercase">
          {file.type || 'RAW'}
        </span>
        <span className="px-2 py-1 rounded text-[9px] font-mono text-success bg-success/10 border border-success/20 uppercase">
          Ready
        </span>
      </div>
    </motion.div>
  );
};
