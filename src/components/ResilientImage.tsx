import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Recurso SENA',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/70 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-200 p-6 text-center ${className}`}
      >
        <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 shadow-xs">
          <BookOpen className="w-5 h-5 text-[#39A900]" />
        </div>
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{fallbackTitle}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
