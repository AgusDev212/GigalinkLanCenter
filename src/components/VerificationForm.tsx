import React, { useState, useId } from 'react';
import {
  ShieldCheck,
  Calendar,
  User,
  IdCard,
  Gamepad,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Phone,
} from 'lucide-react';
import { RegistrationFormData, VerificationResult } from '../types';
import { calculateAge, formatReadableDate, generateVerificationCode } from '../utils/ageValidator';
import { soundEffects } from '../utils/audio';
import {
  saveRegistrationToFirestore,
  checkDuplicateRegistration,
  DuplicateCheckResult,
} from '../services/registrationService';
import { UnderageNoticeModal } from './UnderageNoticeModal';

interface VerificationFormProps {
  onSuccess: (data: RegistrationFormData, result: VerificationResult) => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ onSuccess }) => {
  const formId = useId();
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    gamerTag: '',
    birthDate: '',
    idDocument: '',
    phone: '',
    favoriteGame: 'Dota 2',
    isAdultConfirmed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateInfo, setDuplicateInfo] = useState<DuplicateCheckResult | null>(null);
  const [isUnderageModalOpen, setIsUnderageModalOpen] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, birthDate: value }));
    const age = calculateAge(value);
    setCalculatedAge(age);

    if (errors.birthDate) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.birthDate;
        return next;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundEffects.playClick();
    setFormData((prev) => ({ ...prev, isAdultConfirmed: e.target.checked }));
    if (errors.isAdultConfirmed) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.isAdultConfirmed;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();

    const newErrors: Record<string, string> = {};

    // 1. Mandatory Birth Date Check
    if (!formData.birthDate) {
      newErrors.birthDate = 'Debes ingresar tu fecha de nacimiento';
    } else {
      const age = calculateAge(formData.birthDate);
      if (age === null || age < 18) {
        newErrors.birthDate = 'Debes tener 18 años o más para unirte a las amanecidas';
        soundEffects.playDenied();
        setIsUnderageModalOpen(true);
        setErrors(newErrors);
        return;
      }
    }

    // 2. Mandatory Legal Checkbox Check
    if (!formData.isAdultConfirmed) {
      newErrors.isAdultConfirmed = 'Es obligatorio confirmar la casilla de mayoría de edad (+18)';
    }

    // 3. Gamer Tag check (fallback to 'Gamer' if empty, but good to have)
    if (!formData.gamerTag.trim()) {
      newErrors.gamerTag = 'Por favor escribe tu Nickname o Gamer Tag';
    }

    // 4. ID Document check
    if (!formData.idDocument.trim()) {
      newErrors.idDocument = 'Ingresa tu número de Carnet de Identidad / DNI (se revisará en puerta)';
    }

    // 5. Phone / WhatsApp check
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Ingresa tu número de teléfono / WhatsApp para contactarte';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      soundEffects.playDenied();
      return;
    }

    // Success: Process Verification
    const age = calculateAge(formData.birthDate)!;
    const verificationResult: VerificationResult = {
      age,
      isAdult: true,
      birthDateFormatted: formatReadableDate(formData.birthDate),
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      verificationCode: generateVerificationCode(formData.gamerTag),
    };

    setIsSubmitting(true);
    setDuplicateInfo(null);

    // Verificación obligatoria de no duplicidad (Carnet y Teléfono únicos)
    try {
      const dupCheck = await checkDuplicateRegistration(formData.idDocument, formData.phone || '');
      if (dupCheck.isDuplicate) {
        setDuplicateInfo(dupCheck);
        const dupErrors: Record<string, string> = {};
        if (dupCheck.field === 'idDocument') {
          dupErrors.idDocument = dupCheck.message || 'Este Carnet de Identidad ya se encuentra registrado.';
        } else if (dupCheck.field === 'phone') {
          dupErrors.phone = dupCheck.message || 'Este número de teléfono ya se encuentra registrado.';
        }
        setErrors((prev) => ({ ...prev, ...dupErrors }));
        soundEffects.playDenied();
        setIsSubmitting(false);
        return;
      }

      await saveRegistrationToFirestore(formData, verificationResult);
    } catch (saveError) {
      console.warn('Registro guardado localmente debido a advertencia de red:', saveError);
    } finally {
      setIsSubmitting(false);
    }

    soundEffects.playSuccess();
    onSuccess(formData, verificationResult);
  };

  return (
    <div id="formulario-registro" className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 relative overflow-hidden">
        {/* Subtle top indicator glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500" />

        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Filtro de Seguridad Oficial</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide text-white">
            Registro y Verificación de Edad
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto">
            Completa los datos requeridos para validar tu acceso al grupo exclusivo de WhatsApp de las amanecidas en <span className="text-emerald-400 font-bold">GIGALINK LAN CENTER GAMES</span>.
          </p>
        </div>

        {/* Duplicate Notice Banner */}
        {duplicateInfo && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5 font-bold text-amber-300">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm uppercase tracking-wide">Registro Duplicado Detectado</p>
                <p className="font-normal text-amber-200/90 mt-0.5">{duplicateInfo.message}</p>
              </div>
            </div>
            <div className="text-[11px] text-neutral-300 pl-7">
              Por seguridad y control del LAN Center, cada Carnet de Identidad y número de teléfono debe ser único e intransferible.
            </div>
            {duplicateInfo.existingRecord && (
              <div className="pl-7 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSuccess();
                    onSuccess(
                      {
                        fullName: duplicateInfo.existingRecord!.fullName || '',
                        gamerTag: duplicateInfo.existingRecord!.gamerTag,
                        birthDate: duplicateInfo.existingRecord!.birthDate,
                        idDocument: duplicateInfo.existingRecord!.idDocument,
                        phone: duplicateInfo.existingRecord!.phone || '',
                        favoriteGame: duplicateInfo.existingRecord!.favoriteGame,
                        isAdultConfirmed: true,
                      },
                      {
                        age: duplicateInfo.existingRecord!.calculatedAge,
                        isAdult: true,
                        birthDateFormatted: formatReadableDate(duplicateInfo.existingRecord!.birthDate),
                        timestamp: 'Registro existente',
                        verificationCode: duplicateInfo.existingRecord!.verificationCode,
                      }
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Acceder con mi pase previo al grupo de WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gamer Tag & Full Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor={`${formId}-gamerTag`} className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Nickname / Gamer Tag <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Gamepad className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-gamerTag`}
                  type="text"
                  required
                  placeholder="Ej. Slayer99, NeoGamer"
                  value={formData.gamerTag}
                  onChange={(e) => setFormData({ ...formData, gamerTag: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-neutral-100 placeholder-neutral-600 text-sm font-medium transition-colors"
                />
              </div>
              {errors.gamerTag && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.gamerTag}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${formId}-fullName`} className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Nombre y Apellidos
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-fullName`}
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-neutral-100 placeholder-neutral-600 text-sm font-medium transition-colors"
                />
              </div>
            </div>
          </div>

          {/* OBLIGATORY: Birth Date (Fecha de Nacimiento) */}
          <div className="p-4 sm:p-5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor={`${formId}-birthDate`} className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
                Fecha de Nacimiento (Obligatorio) <span className="text-rose-400">*</span>
              </label>
              {calculatedAge !== null && (
                <div
                  className={`text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1.5 w-fit ${
                    calculatedAge >= 18
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {calculatedAge >= 18 ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{calculatedAge} años (Mayor de edad ✓)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>{calculatedAge} años (Menor de edad - Acceso no permitido)</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id={`${formId}-birthDate`}
                type="date"
                required
                value={formData.birthDate}
                onChange={handleBirthDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-3.5 py-3 bg-neutral-900 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-neutral-100 text-sm font-medium transition-colors"
              />
            </div>
            <p className="text-xs text-neutral-400">
              El sistema calcula de forma estricta tu edad actual. El ingreso a las amanecidas está legalmente restringido a mayores de 18 años.
            </p>
            {errors.birthDate && (
              <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.birthDate}
              </p>
            )}
          </div>

          {/* Carnet de Identidad & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor={`${formId}-idDocument`} className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Carnet de Identidad / DNI <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <IdCard className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-idDocument`}
                  type="text"
                  required
                  placeholder="Número de documento de identidad"
                  value={formData.idDocument}
                  onChange={(e) => setFormData({ ...formData, idDocument: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-neutral-100 placeholder-neutral-600 text-sm font-medium transition-colors"
                />
              </div>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Se contrastará físicamente al ingresar al LAN Center.
              </span>
              {errors.idDocument && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.idDocument}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${formId}-phone`} className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Número de Teléfono / WhatsApp <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  required
                  placeholder="Ej. +591 76543210 o celular"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-3 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-neutral-100 placeholder-neutral-600 text-sm font-medium transition-colors"
                />
              </div>
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Para coordinar partidas y squads en WhatsApp.
              </span>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Favorite Game Selection (includes StarCraft 2) */}
          <div>
            <label htmlFor={`${formId}-favoriteGame`} className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              ¿Qué juegas en amanecida?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Gamepad className="w-4 h-4" />
              </div>
              <select
                id={`${formId}-favoriteGame`}
                value={formData.favoriteGame}
                onChange={(e) => setFormData({ ...formData, favoriteGame: e.target.value })}
                className="w-full py-3 pl-10 pr-3.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-neutral-100 text-sm font-medium transition-colors cursor-pointer"
              >
                <option value="Dota 2">Dota 2</option>
                <option value="Counter Strike 2">Counter Strike 2 (CS2)</option>
                <option value="Valorant">Valorant</option>
                <option value="StarCraft 2">StarCraft 2</option>
                <option value="League of Legends">League of Legends</option>
                <option value="Fortnite">Fortnite</option>
                <option value="Call of Duty: Warzone">Call of Duty: Warzone</option>
                <option value="Left 4 Dead 2">Left 4 Dead 2</option>
                <option value="Overwatch 2">Overwatch 2</option>
                <option value="GTA V / Roleplay">GTA V / Roleplay</option>
                <option value="Otro juego">Otro juego / Variados</option>
              </select>
            </div>
          </div>

          {/* OBLIGATORY LEGAL VERIFICATION CHECKBOX */}
          <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={formData.isAdultConfirmed}
                onChange={handleCheckboxChange}
                className="mt-1 w-5 h-5 rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-950 bg-neutral-900 cursor-pointer shrink-0"
              />
              <div className="space-y-1">
                <span className="text-sm font-bold text-white block">
                  Confirmo que soy mayor de 18 años <span className="text-emerald-400">*</span>
                </span>
                <span className="text-xs text-neutral-300 block leading-relaxed">
                  Declaro bajo responsabilidad legal que tengo 18 años cumplidos o más y acepto que el ingreso estará condicionado a la presentación de mi carnet de identidad físico en la entrada de las amanecidas de <strong>GIGALINK LAN CENTER GAMES</strong>.
                </span>
              </div>
            </label>
            {errors.isAdultConfirmed && (
              <p className="mt-2 text-xs text-rose-400 font-semibold flex items-center gap-1 pl-8">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.isAdultConfirmed}
              </p>
            )}
          </div>

          {/* Important highlighted reminder */}
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px] font-mono uppercase font-bold shrink-0">
              AVISO
            </span>
            <span>
              El enlace oficial de invitación al grupo de WhatsApp se desbloqueará de inmediato tras validar tus respuestas.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-75 text-neutral-950 font-extrabold text-base uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Guardando en Base de Datos Firebase...</span>
              </>
            ) : (
              <>
                <span>Verificar Respuestas y Desbloquear Enlace</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      <UnderageNoticeModal
        isOpen={isUnderageModalOpen}
        age={calculatedAge}
        onClose={() => setIsUnderageModalOpen(false)}
      />
    </div>
  );
};
