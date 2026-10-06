import React from 'react';
import { Moon, Sun, ShieldAlert, Users, Gamepad2, ArrowDown } from 'lucide-react';
import alienMascotImg from '../assets/images/alien_mascot_gigalink_1791231206463.jpg';
import lanCenterImg from '../assets/images/gaming_lan_center_night_1791231219044.jpg';

interface HeroBannerProps {
  onScrollToForm: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToForm }) => {
  return (
    <section id="amanecidas" className="relative overflow-hidden pt-8 pb-14 border-b border-neutral-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src={lanCenterImg}
          alt="Ambiente nocturno LAN Center"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/85 to-neutral-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Schedule Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Gamepad2 className="w-3.5 h-3.5" />
                GIGALINK LAN CENTER GAMES
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono tracking-wider">
                EXCLUSIVO +18
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-none text-white">
                AMANECIDAS <br />
                <span className="text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.3)]">
                  DE JUEGO
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 font-medium max-w-xl">
                Nos juntamos a jugar toda la noche y hasta la mañana. Únete a la crew oficial para coordinar partidas, torneos y amanecidas.
              </p>
            </div>

            {/* Schedule Cards echoing the user's flyer */}
            <div className="grid grid-cols-2 gap-4 max-w-lg" id="horarios">
              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Desde</div>
                  <div className="text-xl font-bold font-mono text-white">22:00 p.m.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Hasta</div>
                  <div className="text-xl font-bold font-mono text-white">08:00 a.m.</div>
                </div>
              </div>
            </div>

            {/* Crucial ID Notice Banner */}
            <div
              id="requisitos"
              className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-neutral-900/90 to-amber-950/40 border border-amber-500/40 shadow-lg shadow-amber-950/30"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-extrabold tracking-wide uppercase text-amber-300">
                    Aviso Obligatorio de Seguridad:
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-200 font-semibold leading-relaxed">
                    LA ENTRADA A LAS AMANECIDAS GAMER SERÁ CONTROLADA CON EL CARNET DE IDENTIDAD.
                  </p>
                  <p className="text-xs text-neutral-400">
                    Sin excepción: se exige documento físico o digital oficial en recepción para ingresar al local en horario nocturno.
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onScrollToForm}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-base uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-98"
              >
                <span>Completar Verificación y Obtener Link</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Comunidad activa en WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Right Column: Alien Mascot & Visual Badge */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Mascot Card container */}
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/50 p-2">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-950">
                  <img
                    src={alienMascotImg}
                    alt="Mascota Alien de Gigalink LAN Center"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-70" />
                  
                  {/* Floating Tag */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold font-display">
                        Mascota Oficial Gigalink
                      </div>
                      <div className="text-sm font-bold text-white">Alien Gamer Crew</div>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LAN +18
                    </span>
                  </div>
                </div>

                <div className="p-3 text-center text-xs text-neutral-400 font-medium">
                  ¡El guardián de las amanecidas! Verifica tu mayoría de edad para sumarte a la partida.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
