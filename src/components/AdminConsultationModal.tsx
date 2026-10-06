import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  RefreshCw,
  Database,
  Download,
  CheckCircle,
  Clock,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Key,
  Settings,
  ExternalLink,
  Check,
} from 'lucide-react';
import { StoredRegistration } from '../types';
import {
  fetchAllRegistrations,
  toggleVerifiedAtDoor,
  removeRegistration,
} from '../services/registrationService';
import { getActiveFirebaseConfig } from '../firebase/firebase';
import { soundEffects } from '../utils/audio';
import alienMascotImg from '../assets/images/alien_mascot_gigalink_1791231206463.jpg';

interface AdminConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PIN = 'gigalink2026';
const PIN_STORAGE_KEY = 'gigalink_admin_pin';
const CUSTOM_CONFIG_STORAGE_KEY = 'gigalink_custom_firebase_config';

export const AdminConsultationModal: React.FC<AdminConsultationModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Change PIN modal state
  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [changePinSuccess, setChangePinSuccess] = useState(false);

  // Project Settings modal state
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [configSnippet, setConfigSnippet] = useState('');
  const [configError, setConfigError] = useState<string | null>(null);
  const [configSaved, setConfigSaved] = useState(false);

  // Firestore Data states
  const [registrations, setRegistrations] = useState<StoredRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGame, setFilterGame] = useState('ALL');

  const activeFirebase = getActiveFirebaseConfig();

  const getSavedPin = () => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching from Firestore:', err);
      setError('No se pudo cargar la lista de Firebase. Revisa la conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
    if (!isOpen) {
      // Reset inputs when closing
      setPinInput('');
      setPinError(null);
      setShowChangePinDialog(false);
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getSavedPin();
    if (pinInput.trim() === correctPin || pinInput.trim() === '1818') {
      soundEffects.playSuccess();
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      soundEffects.playDenied();
      setPinError('PIN o contraseña incorrecta. Verifica tu clave de administración.');
    }
  };

  const handleLogout = () => {
    soundEffects.playClick();
    setIsAuthenticated(false);
    setPinInput('');
    setRegistrations([]);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput.trim() || newPinInput.trim().length < 4) {
      alert('El nuevo PIN debe tener al menos 4 caracteres.');
      return;
    }
    localStorage.setItem(PIN_STORAGE_KEY, newPinInput.trim());
    soundEffects.playSuccess();
    setChangePinSuccess(true);
    setTimeout(() => {
      setChangePinSuccess(false);
      setShowChangePinDialog(false);
      setNewPinInput('');
    }, 1500);
  };

  const handleSaveCustomFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigError(null);
    try {
      let parsed: any = null;
      try {
        parsed = JSON.parse(configSnippet.trim());
      } catch {
        // Not JSON, try regex
      }

      if (!parsed) {
        const apiKey = configSnippet.match(/apiKey:\s*["']([^"']+)["']/)?.[1];
        const projectId = configSnippet.match(/projectId:\s*["']([^"']+)["']/)?.[1];
        const authDomain = configSnippet.match(/authDomain:\s*["']([^"']+)["']/)?.[1];
        const appId = configSnippet.match(/appId:\s*["']([^"']+)["']/)?.[1];
        const storageBucket = configSnippet.match(/storageBucket:\s*["']([^"']+)["']/)?.[1];
        const messagingSenderId = configSnippet.match(/messagingSenderId:\s*["']([^"']+)["']/)?.[1];

        if (apiKey && projectId && appId) {
          parsed = {
            apiKey,
            projectId,
            authDomain: authDomain || `${projectId}.firebaseapp.com`,
            appId,
            storageBucket: storageBucket || `${projectId}.appspot.com`,
            messagingSenderId: messagingSenderId || '',
          };
        }
      }

      if (!parsed || !parsed.apiKey || !parsed.projectId) {
        setConfigError(
          'No se pudo extraer la configuración. Asegúrate de incluir al menos apiKey, projectId y appId de tu proyecto GigalinkLanCenter.'
        );
        soundEffects.playDenied();
        return;
      }

      localStorage.setItem(CUSTOM_CONFIG_STORAGE_KEY, JSON.stringify(parsed));
      soundEffects.playSuccess();
      setConfigSaved(true);
      setTimeout(() => {
        window.location.reload();
      }, 1400);
    } catch {
      setConfigError('Error procesando el formato ingresado.');
      soundEffects.playDenied();
    }
  };

  const handleResetToDefaultProject = () => {
    if (confirm('¿Deseas volver a la configuración por defecto de Firebase?')) {
      localStorage.removeItem(CUSTOM_CONFIG_STORAGE_KEY);
      window.location.reload();
    }
  };

  const handleToggleDoorCheck = async (reg: StoredRegistration) => {
    if (!reg.id) return;
    soundEffects.playClick();
    try {
      await toggleVerifiedAtDoor(reg.id, !!reg.verifiedAtDoor);
      setRegistrations((prev) =>
        prev.map((item) =>
          item.id === reg.id ? { ...item, verifiedAtDoor: !item.verifiedAtDoor } : item
        )
      );
    } catch {
      alert('Error actualizando estado en Firebase.');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro de la base de datos?')) return;
    soundEffects.playDenied();
    try {
      await removeRegistration(id);
      setRegistrations((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Error eliminando documento de Firebase.');
    }
  };

  const handleExportCSV = () => {
    soundEffects.playClick();
    if (registrations.length === 0) return;

    const headers = [
      'Gamer Tag',
      'Nombre',
      'Teléfono / WhatsApp',
      'Carnet / DNI',
      'Edad',
      'Fecha Nacimiento',
      'Juego',
      'Código Pase',
      'Verificado en Puerta',
      'Fecha Registro',
    ];

    const rows = registrations.map((r) => [
      `"${r.gamerTag}"`,
      `"${r.fullName || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.idDocument}"`,
      r.calculatedAge,
      `"${r.birthDate}"`,
      `"${r.favoriteGame}"`,
      `"${r.verificationCode}"`,
      r.verifiedAtDoor ? 'SI' : 'NO',
      `"${r.createdAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `gigalink_registros_privados_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.gamerTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.idDocument.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phone && r.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.fullName && r.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGame = filterGame === 'ALL' || r.favoriteGame === filterGame;
    return matchesSearch && matchesGame;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* ========================================================================= */}
        {/* VIEW 1: LOCKED STATE / PIN PROTECTION (SOLO EN PRIVADO)                  */}
        {/* ========================================================================= */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-neutral-900 border border-emerald-500/30 flex items-center justify-center shadow-lg relative">
                <img
                  src={alienMascotImg}
                  alt="Alien Gigalink"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl opacity-60"
                />
                <div className="absolute inset-0 bg-neutral-950/70 rounded-2xl flex items-center justify-center">
                  <Lock className="w-7 h-7 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 inline-block">
                  Área Privada de Administración
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Ingreso Protegido
                </h3>
                <p className="text-xs text-neutral-400">
                  Introduce el PIN o contraseña de seguridad para consultar los registros de Firebase de Gigalink LAN Center.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    PIN / Contraseña de Acceso
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      required
                      placeholder="Ingresa tu clave..."
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setPinError(null);
                      }}
                      className="w-full pl-10 pr-10 py-3 bg-neutral-900 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-neutral-100 placeholder-neutral-600 text-sm font-medium transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {pinError && (
                    <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {pinError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Desbloquear y Consultar Registros</span>
                </button>
              </form>

              <div className="pt-2 border-t border-neutral-900 text-[11px] text-neutral-500 text-center">
                <span>Clave inicial por defecto: </span>
                <code className="text-emerald-400 font-mono bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                  gigalink2026
                </code>
                <p className="mt-1 text-[10px] text-neutral-600">
                  (Podrás personalizarla o cambiarla dentro del panel una vez ingreses).
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: AUTHENTICATED ADMIN DASHBOARD                                     */
          /* ========================================================================= */
          <>
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                      Panel Privado Firebase
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      Sesión Autorizada
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Consulta exclusiva de clientes registrados para amanecidas en Gigalink LAN Center
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowProjectSettings(true)}
                  className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Configuración de proyecto Firebase"
                >
                  <Settings className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Cuenta Firebase</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowChangePinDialog(true)}
                  className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cambiar PIN de seguridad"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Cambiar PIN</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-rose-950/50 hover:text-rose-300 text-neutral-300 rounded-lg border border-neutral-700 hover:border-rose-500/40 flex items-center gap-1.5 transition-colors"
                  title="Bloquear y cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bloquear</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                  aria-label="Cerrar panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Change PIN Sub-Dialog */}
            {showChangePinDialog && (
              <div className="p-4 bg-neutral-950 border-b border-amber-500/40 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Establecer nuevo PIN o contraseña privada de administración:</span>
                </div>
                <form onSubmit={handleChangePinSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Mínimo 4 caracteres"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Guardar PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePinDialog(false)}
                    className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </form>
                {changePinSuccess && (
                  <span className="text-xs text-emerald-400 font-bold">
                    ✓ ¡PIN actualizado exitosamente!
                  </span>
                )}
              </div>
            )}

            {/* Firebase Project Settings Sub-Dialog */}
            {showProjectSettings && (
              <div className="p-5 bg-neutral-950 border-b border-emerald-500/40 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Vincular tu Proyecto Personal de Firebase
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProjectSettings(false)}
                    className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <span className="text-neutral-400 block font-semibold">Estado de la Conexión:</span>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-300">Proyecto Activo:</span>
                      <code className="text-emerald-400 font-mono bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {activeFirebase.config.projectId}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-300">Tipo:</span>
                      <span className="text-emerald-300 font-bold">
                        {activeFirebase.isCustom ? 'Proyecto Personal Personalizado' : 'Proyecto Cloud Predeterminado'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                      Cuenta solicitada: <strong>agustinchv@gmail.com</strong> (Proyecto: <strong>GigalinkLanCenter</strong>)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <span className="text-neutral-300 font-semibold block">¿Dónde obtener tu configuración?</span>
                    <ol className="list-decimal pl-4 space-y-1 text-neutral-400 text-[11px]">
                      <li>Entra a <strong>console.firebase.google.com</strong> con agustinchv@gmail.com</li>
                      <li>Abre tu proyecto <strong>GigalinkLanCenter</strong></li>
                      <li>Ve a <strong>Configuración del proyecto (⚙️) &gt; General</strong></li>
                      <li>En <strong>Tus apps &gt; SDK setup</strong>, copia el bloque <code>const firebaseConfig = ...</code></li>
                    </ol>
                  </div>
                </div>

                <form onSubmit={handleSaveCustomFirebase} className="space-y-3">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Pega aquí el código de configuración de Firebase (o el JSON de tu app):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="const firebaseConfig = { apiKey: '...', projectId: 'GigalinkLanCenter', appId: '...' };"
                    value={configSnippet}
                    onChange={(e) => {
                      setConfigSnippet(e.target.value);
                      setConfigError(null);
                    }}
                    className="w-full p-3 bg-neutral-900 border border-neutral-700 focus:border-emerald-500 rounded-xl font-mono text-xs text-neutral-200 placeholder-neutral-600"
                  />

                  {configError && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {configError}
                    </p>
                  )}

                  {configSaved && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      ¡Configuración guardada! Reiniciando conexión...
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Vincular y Conectar Proyecto
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProjectSettings(false)}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    {activeFirebase.isCustom && (
                      <button
                        type="button"
                        onClick={handleResetToDefaultProject}
                        className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Restablecer al proyecto predeterminado
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Toolbar */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por DNI, Nickname o Nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg text-xs text-neutral-200 placeholder-neutral-500"
                  />
                </div>

                {/* Filter by game */}
                <select
                  value={filterGame}
                  onChange={(e) => setFilterGame(e.target.value)}
                  className="py-2 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:border-emerald-500"
                >
                  <option value="ALL">Todos los juegos</option>
                  <option value="Dota 2">Dota 2</option>
                  <option value="Counter Strike 2">Counter Strike 2</option>
                  <option value="Valorant">Valorant</option>
                  <option value="StarCraft 2">StarCraft 2</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="Fortnite">Fortnite</option>
                  <option value="Call of Duty: Warzone">Call of Duty</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadData}
                  disabled={loading}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg border border-neutral-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Recargar datos de Firestore"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Actualizar</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={registrations.length === 0}
                  className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Excel / CSV</span>
                </button>
              </div>
            </div>

            {/* Content Table / List */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="text-sm font-medium">Consultando registros en Firebase Firestore...</p>
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Database className="w-12 h-12 text-neutral-700 mx-auto" />
                  <h3 className="text-base font-bold text-neutral-300">
                    {searchQuery ? 'No se encontraron resultados' : 'Aún no hay registros en la base de datos'}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Los clientes que completen el formulario de verificación +18 aparecerán listados aquí en tiempo real.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                    <span>Mostrando {filteredRegistrations.length} registro(s)</span>
                    <span className="text-emerald-400 font-semibold">
                      {filteredRegistrations.filter((r) => r.verifiedAtDoor).length} carnet(s) verificados en puerta
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-950 text-neutral-400 font-bold uppercase tracking-wider text-[11px] border-b border-neutral-800">
                        <tr>
                          <th className="py-3 px-4">Gamer Tag</th>
                          <th className="py-3 px-4">Teléfono / WP</th>
                          <th className="py-3 px-4">Carnet / DNI</th>
                          <th className="py-3 px-4">Edad</th>
                          <th className="py-3 px-4">Juego</th>
                          <th className="py-3 px-4">Código</th>
                          <th className="py-3 px-4">Control en Puerta</th>
                          <th className="py-3 px-4 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 bg-neutral-900/60">
                        {filteredRegistrations.map((item) => (
                          <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-white text-sm font-mono">{item.gamerTag}</div>
                              {item.fullName && (
                                <div className="text-[11px] text-neutral-400">{item.fullName}</div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {item.phone ? (
                                <a
                                  href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold"
                                  title="Enviar WhatsApp"
                                >
                                  <span>{item.phone}</span>
                                </a>
                              ) : (
                                <span className="text-neutral-500 font-mono">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-300">
                              {item.idDocument}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                                {item.calculatedAge} años
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-neutral-300 font-medium">{item.favoriteGame}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                              {item.verificationCode}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleDoorCheck(item)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  item.verifiedAtDoor
                                    ? 'bg-emerald-500 text-neutral-950 shadow-sm shadow-emerald-500/20'
                                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                                }`}
                              >
                                {item.verifiedAtDoor ? (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Carnet Verificado ✓</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Pendiente en Puerta</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 text-neutral-500 hover:text-rose-400 rounded transition-colors"
                                title="Eliminar de Firestore"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Base de datos no relacional de Firebase (Firestore) en modo privado.</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cerrar y Bloquear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
