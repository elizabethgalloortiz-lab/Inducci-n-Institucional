import { useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';

interface VideoManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VIDEO_MANUAL_SRC = '/assets/aistudio/2026__17_18_3f66debe.mp4';

export function VideoManualModal({ isOpen, onClose }: VideoManualModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!isOpen && videoEl) {
      videoEl.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.paused) {
      void videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  const handleRestart = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.currentTime = 0;
    void videoEl.play();
  };

  const handleToggleMute = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
    setIsMuted(videoEl.muted);
  };

  const handleCycleSpeed = () => {
    const videoEl = videoRef.current;
    const nextRate: 1 | 1.25 | 1.5 =
      playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (videoEl) {
      videoEl.playbackRate = nextRate;
    }
  };

  const handleFullscreen = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.requestFullscreen) {
      void videoEl.requestFullscreen();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-manual-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#2C8200] dark:text-emerald-400">
              Guía audiovisual interactiva
            </p>
            <h2
              id="video-manual-title"
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate"
            >
              Video Manual de la Plataforma · Ruta Inducción SENA
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar video manual"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar</span>
          </button>
        </div>

        <div className="bg-slate-950 aspect-video w-full flex items-center justify-center">
          {videoError ? (
            <div className="p-6 text-center space-y-2 text-slate-300 text-sm">
              <p className="font-semibold text-white">No se pudo cargar el video manual.</p>
              <p className="text-xs text-slate-400">
                Verifica que el archivo multimedia esté disponible e intenta nuevamente.
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={VIDEO_MANUAL_SRC}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onVolumeChange={() => {
                if (videoRef.current) setIsMuted(videoRef.current.muted);
              }}
              onError={() => setVideoError(true)}
              className="w-full h-full object-contain"
            >
              Tu navegador no soporta la reproducción de video HTML5.
            </video>
          )}
        </div>

        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              disabled={videoError}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pausar' : 'Reproducir'}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={videoError}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              disabled={videoError}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#39A900]" />
              )}
              {isMuted ? 'Activar sonido' : 'Silenciar'}
            </button>

            <button
              type="button"
              onClick={handleCycleSpeed}
              disabled={videoError}
              className="px-2.5 py-1.5 text-xs font-mono font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {playbackRate}x
            </button>

            <button
              type="button"
              onClick={handleFullscreen}
              disabled={videoError}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pantalla completa</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Presiona ESC o haz clic fuera para cerrar
          </span>
        </div>
      </div>
    </div>
  );
}
