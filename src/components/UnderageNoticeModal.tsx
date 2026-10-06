import React from 'react';
import { AlertTriangle, X, ShieldAlert, ArrowLeft } from 'lucide-react';
import alienMascotImg from '../assets/images/alien_mascot_gigalink_1791231206463.jpg';

interface UnderageNoticeModalProps {
  isOpen: boolean;
  age: number | null;
  onClose: () => void;
}

export const UnderageNoticeModal: React.FC<UnderageNoticeModalProps> = ({
  isOpen,
  age,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-neutral-900 border-2 border-rose-500/50 rounded-2xl shadow-2xl shadow-rose-950/50 text-neutral-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          aria-label="Cerrar aviso"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-rose-400">
              Acceso Restringido
            </h3>
            <p className="text-xs text-neutral-400">Evento nocturno exclusivo para mayores de edad</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
          <img
            src={alienMascotImg}
            alt="Alien Gigalink"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-lg object-cover border border-rose-500/30 shrink-0"
          />
          <p className="text-xs text-neutral-300 leading-relaxed">
            {age !== null
              ? `Has indicado una edad de ${age} años. Por regulaciones legales y municipales, las amanecidas (22:00 a 08:00) son únicamente para mayores de 18 años.`
              : 'Debes tener al menos 18 años cumplidos para acceder al grupo de WhatsApp y a las amanecidas.'}
          </p>
        </div>

        <div className="p-3 mb-5 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-rose-200">
            Recuerda que en la puerta del LAN Center se exigirá el Carnet de Identidad físico obligatorio.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Revisar mi fecha si hubo un error</span>
          </button>
        </div>
      </div>
    </div>
  );
};
