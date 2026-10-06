import React from 'react';
import { Cpu, Wifi, Shield, Coffee, Zap, Monitor, Gamepad2, Info } from 'lucide-react';
import lanCenterImg from '../assets/images/gaming_lan_center_night_1791231219044.jpg';

export const EventInfoSection: React.FC = () => {
  return (
    <section className="py-16 border-t border-neutral-800 bg-neutral-950/60" id="equipamiento">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Infraestructura Gamer de Alta Gama</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-wide">
            Todo lo que necesitas para tu Amanecida
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            En Gigalink LAN Center Games cuidamos cada detalle para que disfrutes de 10 horas ininterrumpidas de puro vicio competitivo con tu squad.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white">
              PCs Gamer & Monitores 240Hz
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Equipos de última generación con procesadores Ryzen / Intel Core i7, tarjetas gráficas RTX, teclados mecánicos, audífonos con cancelación de ruido y sillas ergonómicas pro.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white">
              Conexión Cableada (+120 Mbps)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Nuestra conexión es 100% cableada y tiene un ancho de banda de más de 120 Mbps. Conexión estable con ping ultrabajo optimizado para servidores de Dota 2, CS2, Valorant y LoL sin caídas de red.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white">
              Snacks, Bebidas y Cafetería
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Bebidas energizantes, café caliente, piqueos, hamburguesas y combos especiales de amanecida para recargar energía a cualquier hora.
            </p>
          </div>
        </div>

        {/* Ambient image & Rules */}
        <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[320px]">
            <img
              src={lanCenterImg}
              alt="Sala de Gigalink LAN Center"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-sm border border-neutral-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                <span>Horario Nocturno Oficial</span>
              </div>
              <p className="text-sm font-bold text-white">
                De 22:00 hrs a 08:00 hrs del día siguiente
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 space-y-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Shield className="w-4 h-4" />
              <span>Reglas de Convivencia y Seguridad</span>
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-white">
              Normas de las Amanecidas Gamer
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
              <li className="flex items-start gap-2.5">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 font-bold text-xs">
                  01
                </span>
                <span>
                  <strong>Carnet de Identidad obligatorio:</strong> Todo asistente debe presentar su documento físico original en recepción antes de ingresar.
                </span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="p-1 rounded bg-rose-500/20 text-rose-400 shrink-0 font-bold text-xs">
                  02 ⭐
                </span>
                <div className="space-y-0.5">
                  <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
                    Norma Más Importante
                  </span>
                  <p className="text-rose-100 font-semibold">
                    No se permite el ingreso de personas en estado de ebriedad ni el consumo o ingreso de bebidas alcohólicas, cliente que incumpla esta norma será retirado sin derecho a devolución, nos reservamos el derecho de admisión.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 font-bold text-xs">
                  03
                </span>
                <span>
                  <strong>Cuidado del equipamiento:</strong> No golpear teclados, mouses ni monitores. El respeto a los periféricos asegura que todos jueguen en óptimas condiciones.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 font-bold text-xs">
                  04
                </span>
                <span>
                  <strong>Puertas aseguradas a partir de medianoche:</strong> Por tranquilidad y resguardo de todos los clientes, el ingreso y salida se controla de manera estricta durante la madrugada.
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-400">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>¿Dudas sobre reservas grupales? En el grupo de WhatsApp podrás coordinar con los administradores en turno.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
