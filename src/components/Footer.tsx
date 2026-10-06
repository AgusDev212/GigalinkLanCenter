import React from 'react';
import { Gamepad2, ShieldAlert, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-400" />
            <span className="font-display text-lg font-extrabold uppercase tracking-wider text-white">
              GIGALINK LAN CENTER GAMES
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <a href="#amanecidas" className="hover:text-emerald-400 transition-colors">
              Amanecidas
            </a>
            <a href="#horarios" className="hover:text-emerald-400 transition-colors">
              Horario 22:00 a 08:00
            </a>
            <a href="#requisitos" className="hover:text-emerald-400 transition-colors">
              Control de Carnet
            </a>
            <a href="#equipamiento" className="hover:text-emerald-400 transition-colors">
              Conexión +120 Mbps
            </a>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-neutral-500 hover:text-neutral-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Acceso privado para personal del LAN Center"
              >
                <Lock className="w-3 h-3 text-neutral-500" />
                <span>Acceso Interno</span>
              </button>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} GIGALINK LAN CENTER GAMES. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5 text-amber-500/80 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Entrada a amanecidas controlada estrictamente con Carnet de Identidad (+18).</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
