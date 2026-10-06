import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Database } from 'lucide-react';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onScrollToForm: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onScrollToForm,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 group">
          <a href="/" className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors uppercase">
            Gigalink Lan Center
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            aria-label="Acceso privado administración"
            className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-mono hover:border-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            title="Acceso administración (+18)"
          >
            +18
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <a href="#amanecidas" className="hover:text-emerald-400 transition-colors">
            Amanecidas
          </a>
          <a href="#horarios" className="hover:text-emerald-400 transition-colors">
            Horarios
          </a>
          <a href="#requisitos" className="hover:text-emerald-400 transition-colors">
            Requisitos Carnet
          </a>
          <a href="#equipamiento" className="hover:text-emerald-400 transition-colors">
            Specs & PCs
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2 text-neutral-400 hover:text-emerald-400 bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
            title={isMuted ? 'Sonido silenciado' : 'Sonido activado'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onScrollToForm}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold tracking-wide uppercase text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verificar +18</span>
          </button>
        </div>
      </div>
    </header>
  );
};
