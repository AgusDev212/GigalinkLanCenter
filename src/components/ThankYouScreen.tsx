import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  QrCode,
  Sparkles,
  Download,
  RotateCcw,
  Clock,
  IdCard,
  MessageSquare,
  Database
} from 'lucide-react';
import { RegistrationFormData, VerificationResult } from '../types';
import { generateQrDataUrl } from '../utils/qr';
import { soundEffects } from '../utils/audio';
import alienMascotImg from '../assets/images/alien_mascot_gigalink_1791231206463.jpg';

interface ThankYouScreenProps {
  formData: RegistrationFormData;
  verification: VerificationResult;
  onReset: () => void;
}

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/L02j3Lgn66KIGIimfGZJzc?mode=gi_t';

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({
  formData,
  verification,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQrExpanded, setShowQrExpanded] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#10b981', '#059669', '#38bdf8', '#f59e0b'],
      });
    } catch {
      // Ignore if blocked
    }

    // Generate QR code for the WhatsApp link
    generateQrDataUrl(WHATSAPP_GROUP_LINK).then((url) => {
      setQrDataUrl(url);
    });
  }, []);

  const handleCopy = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(WHATSAPP_GROUP_LINK).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-neutral-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="relative shrink-0">
              <img
                src={alienMascotImg}
                alt="Alien Mascot Gigalink"
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg shadow-emerald-500/30"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-neutral-950 rounded-full shadow">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verificación Completada</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-wide">
                ¡Gracias por registrarte,{' '}
                <span className="text-emerald-400">{formData.gamerTag}</span>!
              </h1>
              <p className="text-sm sm:text-base text-neutral-300">
                Tu mayoría de edad ({verification.age} años) ha sido validada. Ya puedes unirte al grupo oficial de WhatsApp de las amanecidas de <strong>GIGALINK LAN CENTER GAMES</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CRITICAL USER REQUIREMENT: VERY PROMINENT HIGHLIGHTED NOTE */}
        {/* "LA ENTRADA A LAS AMANECIDAS GAMER SERÁ CONTROLADA CON EL CARNET DE IDENTIDAD." */}
        {/* ========================================================================= */}
        <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 border-2 border-amber-500 shadow-2xl shadow-amber-950/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-pulse" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500 text-neutral-950 shrink-0 shadow-lg shadow-amber-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-500 text-neutral-950 text-xs font-black uppercase tracking-wider font-mono">
                  AVISO OBLIGATORIO Y REGLA DE ORO
                </span>
                <span className="text-xs font-bold text-amber-300">
                  Control Estricto en Puerta
                </span>
              </div>

              {/* Exact prominent text requested by user */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-amber-500/50">
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] leading-snug">
                  LA ENTRADA A LAS AMANECIDAS GAMER SERÁ CONTROLADA CON EL CARNET DE IDENTIDAD.
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                Aunque estés dentro del grupo de WhatsApp, <strong>es indispensable presentar tu Carnet de Identidad físico original o DNI</strong> al llegar a Gigalink LAN Center. Sin carnet válido no se permitirá el ingreso al evento nocturno bajo ninguna circunstancia.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Group Invitation CTA Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>Comunidad Oficial WhatsApp</span>
              </div>
              <h3 className="font-display text-2xl font-extrabold uppercase text-white">
                Enlace Oficial de Invitación
              </h3>
              <p className="text-sm text-neutral-300 max-w-md">
                Únete ahora para enterarte de los cupos disponibles de cada noche, torneos relámpago, promociones y squads de Dota 2, CS2 y Valorant.
              </p>
            </div>

            {/* Direct Link Action */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <a
                href={WHATSAPP_GROUP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEffects.playClick()}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-base uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-98"
              >
                <span>Unirme al Grupo de WhatsApp</span>
                <ExternalLink className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">¡Enlace Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Enlace de WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code and Quick Scan Section */}
          <div className="pt-6 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-neutral-950 rounded-xl border border-neutral-800">
              {qrDataUrl ? (
                <div className="space-y-2 text-center">
                  <div className="p-2.5 bg-white rounded-xl shadow-md inline-block">
                    <img
                      src={qrDataUrl}
                      alt="Código QR para WhatsApp de Amanecidas"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-neutral-400 flex items-center justify-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Escanea con tu cámara o WhatsApp</span>
                  </p>
                </div>
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-neutral-500">
                  Generando QR...
                </div>
              )}
            </div>

            <div className="md:col-span-8 space-y-3">
              <h4 className="font-display text-lg font-bold uppercase text-white">
                ¿Estás en tu computadora?
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Apunta la cámara de tu teléfono al código QR de la izquierda para abrir el chat de WhatsApp automáticamente en tu móvil y unirte al instante.
              </p>
              <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800 font-mono text-xs text-emerald-400 truncate select-all">
                {WHATSAPP_GROUP_LINK}
              </div>
            </div>
          </div>
        </div>

        {/* Digital Verification Pass / Comprobante de Registro */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Comprobante Digital de Verificación
              </div>
              <div className="text-lg font-bold font-display text-white">
                Pase de Registro: {verification.verificationCode}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block uppercase font-bold tracking-wider">Gamer Tag</span>
              <span className="font-bold text-white text-sm font-mono truncate block">{formData.gamerTag}</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block uppercase font-bold tracking-wider">Carnet / DNI</span>
              <span className="font-bold text-white text-sm font-mono truncate block">{formData.idDocument}</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block uppercase font-bold tracking-wider">Teléfono / WP</span>
              <span className="font-bold text-emerald-300 text-sm font-mono truncate block">{formData.phone || 'N/A'}</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block uppercase font-bold tracking-wider">Edad (+18)</span>
              <span className="font-bold text-emerald-400 text-sm font-mono">
                {verification.age} años ✓
              </span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-500 block uppercase font-bold tracking-wider">Juego</span>
              <span className="font-bold text-neutral-200 text-sm truncate block">{formData.favoriteGame}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              Horario de amanecida: 22:00 a 08:00 hrs.
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Database className="w-3.5 h-3.5" />
                Guardado en Firebase
              </span>
              <span className="text-neutral-600 hidden sm:inline">·</span>
              <span className="font-mono text-neutral-500">
                {verification.birthDateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Reset / New Registration Button */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onReset();
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Registrar a otro jugador o volver a verificar</span>
          </button>
        </div>
      </div>
    </section>
  );
};
