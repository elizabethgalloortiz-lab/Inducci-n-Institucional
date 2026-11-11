import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  KeyRound,
  Lock,
  PlayCircle,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  COHORTS,
  computeApprenticeStatus,
  getApprenticeModulePercent,
  INDUCTION_MODULES,
  INSTRUCTOR_GENERIC_CREDENTIALS,
  LEAD_INSTRUCTOR,
  QUIZZES,
  SENA_IMAGES,
} from '../data/senaData';
import { ApprenticeRecord } from '../types/sena';
import { ResilientImage } from './ResilientImage';

interface LandingPageProps {
  apprentices: ApprenticeRecord[];
  selectedApprenticeId: string;
  onEnterAsApprentice: (apprenticeId: string) => void;
  onEnterAsInstructor: () => void;
  onRegisterApprentice: (newApprentice: Omit<ApprenticeRecord, 'id'>) => string;
  onOpenVideoManual: () => void;
}

const APPRENTICE_INTERESTS = [
  'Normativa y Reglamento (Acuerdo 009 de 2024)',
  'Identidad, Símbolos e Imagen SENA',
  'Etapa Productiva y Emprendimiento',
  'Bienestar, Convivencia y Vocería',
  'Plataformas SOFÍA Plus y Zajuna',
];

type ApprenticeAccessStep = 'choose-role' | 'fill-profile' | 'saved-ready' | 'existing-profile';

export function LandingPage({
  apprentices,
  selectedApprenticeId,
  onEnterAsApprentice,
  onEnterAsInstructor,
  onRegisterApprentice,
  onOpenVideoManual,
}: LandingPageProps) {
  const [apprenticeStep, setApprenticeStep] = useState<ApprenticeAccessStep>('choose-role');
  const [chosenApprenticeId, setChosenApprenticeId] = useState<string>(
    selectedApprenticeId || apprentices[0]?.id || '',
  );
  const [fichaFilter, setFichaFilter] = useState<string>('all');

  const [regName, setRegName] = useState('');
  const [regDoc, setRegDoc] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFicha, setRegFicha] = useState('');
  const [regInterest, setRegInterest] = useState('');
  const [regGoal, setRegGoal] = useState('');
  const [regError, setRegError] = useState('');
  const [savedApprenticeId, setSavedApprenticeId] = useState<string | null>(null);

  const [instructorStep, setInstructorStep] = useState<'overview' | 'auth'>('overview');
  const [instUsername, setInstUsername] = useState('');
  const [instPassword, setInstPassword] = useState('');
  const [showInstPassword, setShowInstPassword] = useState(false);
  const [instError, setInstError] = useState('');

  const resetProfileForm = () => {
    setRegName('');
    setRegDoc('');
    setRegEmail('');
    setRegFicha('');
    setRegInterest('');
    setRegGoal('');
    setRegError('');
  };

  const resetInstructorForm = () => {
    setInstUsername('');
    setInstPassword('');
    setShowInstPassword(false);
    setInstError('');
  };

  const filteredApprentices = useMemo(() => {
    if (fichaFilter === 'all') return apprentices;
    return apprentices.filter((a) => a.fichaId === fichaFilter);
  }, [apprentices, fichaFilter]);

  const activeChoice =
    filteredApprentices.find((a) => a.id === chosenApprenticeId) ??
    filteredApprentices[0] ??
    apprentices[0];

  const newlySavedApprentice = useMemo(
    () => apprentices.find((a) => a.id === savedApprenticeId) ?? null,
    [apprentices, savedApprenticeId],
  );

  const instructorStats = useMemo(() => {
    const priorityCount = apprentices.filter(
      (a) => computeApprenticeStatus(a) === 'prioritario',
    ).length;
    const completedCount = apprentices.filter(
      (a) => computeApprenticeStatus(a) === 'completado',
    ).length;
    const unsignedCount = apprentices.filter((a) => !a.regulationSigned).length;
    return { priorityCount, completedCount, unsignedCount };
  }, [apprentices]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (regName.trim().length < 4) {
      setRegError('Ingresa tu nombre completo (mínimo 4 caracteres).');
      return;
    }
    if (!/^\d{6,12}$/.test(regDoc.trim())) {
      setRegError('Ingresa un número de documento válido (6 a 12 dígitos sin puntos ni espacios).');
      return;
    }
    if (regEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setRegError('El formato del correo institucional no es válido.');
      return;
    }
    if (!regFicha) {
      setRegError('Selecciona la ficha y programa de formación al que perteneces.');
      return;
    }
    if (!regInterest) {
      setRegError('Selecciona tu eje de interés principal.');
      return;
    }
    setRegError('');
    const createdId = onRegisterApprentice({
      fullName: regName.trim(),
      documentId: regDoc.trim(),
      email:
        regEmail.trim() ||
        `${regName.trim().toLowerCase().replace(/\s+/g, '.')}@soy.sena.edu.co`,
      fichaId: regFicha,
      interestArea: regInterest,
      learningGoal: regGoal.trim() || undefined,
      completedModuleIds: [],
      quizAttempts: {},
      inductionAttendance: [true, false, false, false, false],
      regulationSigned: false,
      observations: [],
      lastActivity: new Date().toISOString().slice(0, 10),
    });
    resetProfileForm();
    setSavedApprenticeId(createdId);
    setChosenApprenticeId(createdId);
    setApprenticeStep('saved-ready');
  };

  const handleInstructorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = instUsername.trim();
    if (!cleanUser || !instPassword) {
      setInstError('Ingresa el usuario y la contraseña asignados para continuar.');
      return;
    }
    if (
      cleanUser.toLowerCase() !== INSTRUCTOR_GENERIC_CREDENTIALS.username.toLowerCase() ||
      instPassword !== INSTRUCTOR_GENERIC_CREDENTIALS.password
    ) {
      setInstError(
        'Usuario o contraseña incorrectos. Verifica las credenciales genéricas del instructor.',
      );
      return;
    }
    resetInstructorForm();
    onEnterAsInstructor();
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-16">
      {/* 1. Hero Section */}
      <section id="propuesta" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 py-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wide text-[#2C8200] dark:text-emerald-400">
              Servicio Nacional de Aprendizaje · SENA
            </p>
            <h1 className="text-[clamp(2.15rem,4vw,3.4rem)] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.08] [text-wrap:balance]">
              Plataforma de inducción, normativa e imagen institucional
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Múltiples aprendices recorren los módulos multimedia, simuladores del Reglamento
              (Acuerdo 009 de 2024 · act. Acuerdo 002 de 2026) y cuestionarios interactivos, mientras
              un único instructor encargado supervisa en tiempo real el cumplimiento de todas las
              fichas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#acceso-rol"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#39A900] hover:bg-[#2C8200] rounded-lg transition-colors whitespace-nowrap"
            >
              Seleccionar rol de ingreso
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onOpenVideoManual}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <PlayCircle className="w-4 h-4 text-[#39A900]" />
              Ver video manual
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Complejo de Formación SENA · Acceso diferenciado para Aprendices e Instructor Encargado
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[320px]">
          <ResilientImage
            src={SENA_IMAGES.heroCampus}
            alt="Aprendices e instructora SENA en ambiente de formación colaborativa"
            fallbackTitle="Ambiente de Inducción SENA"
            className="w-full h-full lg:h-full object-cover"
          />
        </div>
      </section>

      {/* 2. Central Role Selector Section (Multiple Apprentices vs Single Instructor) */}
      <section id="acceso-rol" className="space-y-6 scroll-mt-24">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-[#2C8200] dark:text-emerald-400">
            Ingreso por perfil institucional
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Elige cómo deseas ingresar a la plataforma
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Cada aprendiz accede a su ruta individual de aprendizaje y evaluación. Un solo
            instructor líder centraliza la revisión de evidencias, asistencia y alertas de todas las
            cohortes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Multiple Apprentices Flow */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#39A900]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Rol Aprendiz
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {apprenticeStep === 'choose-role' &&
                        'Paso 1 de 3 · Escoge tu rol para iniciar tu perfil'}
                      {apprenticeStep === 'fill-profile' &&
                        'Paso 2 de 3 · Diligencia tus datos e interés de inducción'}
                      {apprenticeStep === 'saved-ready' &&
                        'Paso 3 de 3 · Perfil guardado y listo para continuar'}
                      {apprenticeStep === 'existing-profile' &&
                        'Retomar perfil de aprendiz ya guardado'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                  {apprentices.length} perfiles guardados
                </span>
              </div>

              {apprenticeStep === 'choose-role' && (
                <div className="space-y-5">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Si ingresas como <strong className="text-slate-900 dark:text-slate-100">Aprendiz</strong>,
                    primero registrarás tus datos de identificación y tu tema de interés para guardar
                    tu perfil de progreso. Luego podrás recorrer los módulos multimedia y presentar
                    los cuestionarios bajo seguimiento del instructor.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-mono font-semibold text-[#2C8200] dark:text-emerald-400">
                        01. Rol
                      </div>
                      <div className="text-slate-700 dark:text-slate-200 font-medium">
                        Escoges el rol de Aprendiz
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-mono font-semibold text-[#2C8200] dark:text-emerald-400">
                        02. Perfil e interés
                      </div>
                      <div className="text-slate-700 dark:text-slate-200 font-medium">
                        Llenas y guardas tus datos
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-mono font-semibold text-[#2C8200] dark:text-emerald-400">
                        03. Prototipo
                      </div>
                      <div className="text-slate-700 dark:text-slate-200 font-medium">
                        Accedes a módulos y avance
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {apprenticeStep === 'fill-profile' && (
                <form
                  id="apprentice-profile-form"
                  onSubmit={handleSaveProfile}
                  autoComplete="off"
                  className="space-y-4"
                >
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <Info className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100">
                        Cómo llenar tu perfil:
                      </strong>{' '}
                      Completa los campos obligatorios (<span className="font-semibold">*</span>)
                      usando tus datos de matrícula en SOFÍA Plus. Sigue la pista debajo de cada
                      casilla.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="reg-name"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                      >
                        Nombre completo *
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        autoComplete="off"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ej. Camila Andrea López"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                      />
                      <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Pista: escribe tus nombres y apellidos tal como figuran en tu documento.
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="reg-doc"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                      >
                        Documento de identidad *
                      </label>
                      <input
                        id="reg-doc"
                        type="text"
                        inputMode="numeric"
                        required
                        autoComplete="off"
                        value={regDoc}
                        onChange={(e) => setRegDoc(e.target.value)}
                        placeholder="Ej. 1036942180"
                        className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                      />
                      <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Pista: digita solo números (6 a 12 dígitos), sin puntos ni espacios.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="reg-email"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                      >
                        Correo institucional
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        autoComplete="off"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nombre@soy.sena.edu.co"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                      />
                      <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Pista: si aún no tienes @soy.sena.edu.co, déjalo vacío y se generará uno.
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="reg-ficha"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                      >
                        Ficha y programa *
                      </label>
                      <select
                        id="reg-ficha"
                        required
                        value={regFicha}
                        onChange={(e) => setRegFicha(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                      >
                        <option value="">Selecciona tu ficha y programa...</option>
                        {COHORTS.map((c) => (
                          <option key={c.fichaId} value={c.fichaId}>
                            Ficha {c.fichaId} · {c.programName}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Pista: ubica el código de 7 dígitos asignado a tu grupo (ej. 2874190).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="reg-interest"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                      >
                        Eje de interés principal *
                      </label>
                      <select
                        id="reg-interest"
                        required
                        value={regInterest}
                        onChange={(e) => setRegInterest(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                      >
                        <option value="">Selecciona tu eje de interés...</option>
                        {APPRENTICE_INTERESTS.map((interest) => (
                          <option key={interest} value={interest}>
                            {interest}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Pista: elige el tema de inducción en el que deseas enfocarte primero.
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="reg-goal"
                        className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                      >
                        Expectativa de inducción (opcional)
                      </label>
                      <input
                        id="reg-goal"
                        type="text"
                        autoComplete="off"
                        value={regGoal}
                        onChange={(e) => setRegGoal(e.target.value)}
                        placeholder="Ej. Dominar reglamento y etapa productiva"
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                      />
                      <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Pista: resume en una frase corta lo que esperas lograr en esta etapa.
                      </p>
                    </div>
                  </div>

                  {regError && (
                    <p className="text-xs text-[#DC2626] dark:text-red-400">{regError}</p>
                  )}
                </form>
              )}

              {apprenticeStep === 'saved-ready' && newlySavedApprentice && (
                <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center gap-2 text-[#16A34A] dark:text-emerald-400 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Perfil de aprendiz guardado correctamente</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Aprendiz</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {newlySavedApprentice.fullName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">
                        Documento y Ficha
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        CC {newlySavedApprentice.documentId} · {newlySavedApprentice.fichaId}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">
                        Interés seleccionado
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {newlySavedApprentice.interestArea}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">
                        Estado de progreso
                      </span>
                      <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                        0% inicial · Sincronizado con instructor
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {apprenticeStep === 'existing-profile' && (
                <div className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label
                      htmlFor="landing-ficha-filter"
                      className="text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      Filtrar perfiles guardados por ficha:
                    </label>
                    <select
                      id="landing-ficha-filter"
                      value={fichaFilter}
                      onChange={(e) => setFichaFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                    >
                      <option value="all">Todas las fichas ({apprentices.length})</option>
                      {COHORTS.map((c) => (
                        <option key={c.fichaId} value={c.fichaId}>
                          Ficha {c.fichaId} · {c.programName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {filteredApprentices.map((apr) => {
                      const isSelected = activeChoice?.id === apr.id;
                      const pct = getApprenticeModulePercent(apr);
                      return (
                        <button
                          key={apr.id}
                          type="button"
                          onClick={() => setChosenApprenticeId(apr.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-[#39A900]'
                              : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {apr.fullName}
                            </div>
                            <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                              CC {apr.documentId} · Ficha {apr.fichaId}
                              {apr.interestArea ? ` · ${apr.interestArea}` : ''}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                              {pct}%
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {isSelected ? 'Seleccionado' : 'Elegir'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions for Card 1 */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {apprenticeStep === 'choose-role' && (
                <>
                  <button
                    type="button"
                    onClick={() => setApprenticeStep('existing-profile')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    Ya tengo un perfil guardado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetProfileForm();
                      setApprenticeStep('fill-profile');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#39A900] hover:bg-[#2C8200] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Escoger rol de Aprendiz
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {apprenticeStep === 'fill-profile' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      resetProfileForm();
                      setApprenticeStep('choose-role');
                    }}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Volver al paso anterior
                  </button>
                  <button
                    type="submit"
                    form="apprentice-profile-form"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#39A900] hover:bg-[#2C8200] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <UserPlus className="w-4 h-4" />
                    Guardar perfil de aprendiz
                  </button>
                </>
              )}

              {apprenticeStep === 'saved-ready' && newlySavedApprentice && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      resetProfileForm();
                      setApprenticeStep('fill-profile');
                    }}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Registrar otro aprendiz
                  </button>
                  <button
                    type="button"
                    onClick={() => onEnterAsApprentice(newlySavedApprentice.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#39A900] hover:bg-[#2C8200] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Continuar al prototipo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {apprenticeStep === 'existing-profile' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      resetProfileForm();
                      setApprenticeStep('fill-profile');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Registrar nuevo aprendiz
                  </button>
                  <button
                    type="button"
                    disabled={!activeChoice}
                    onClick={() => activeChoice && onEnterAsApprentice(activeChoice.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#39A900] hover:bg-[#2C8200] disabled:opacity-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Continuar al prototipo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Single Designated Instructor */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-slate-100">
                    {instructorStep === 'auth' ? (
                      <Lock className="w-5 h-5 text-[#39A900]" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-[#39A900]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Rol Instructor Encargado
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {instructorStep === 'auth'
                        ? 'Acceso protegido · Ingresa usuario y contraseña'
                        : 'Revisión centralizada única · Todas las fichas'}
                    </p>
                  </div>
                </div>
              </div>

              {instructorStep === 'overview' ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="text-xs font-medium text-[#2C8200] dark:text-emerald-400">
                      Responsable único asignado
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {LEAD_INSTRUCTOR.fullName}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {LEAD_INSTRUCTOR.roleTitle}
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                      {LEAD_INSTRUCTOR.email}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Estado actual para revisión del instructor
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                          {apprentices.length}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Aprendices
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <div className="text-lg font-bold font-mono tabular-nums text-[#16A34A] dark:text-emerald-400">
                          {instructorStats.completedCount}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Al día
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <div className="text-lg font-bold font-mono tabular-nums text-[#DC2626] dark:text-red-400">
                          {instructorStats.priorityCount}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Alertas
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Revisa calificaciones de cuestionarios, marca asistencia a jornadas, valida{' '}
                      <span className="font-mono tabular-nums">
                        {instructorStats.unsignedCount}
                      </span>{' '}
                      firmas pendientes de reglamento y exporta reportes CSV.
                    </p>
                  </div>
                </>
              ) : (
                <form
                  id="instructor-auth-form"
                  onSubmit={handleInstructorLogin}
                  autoComplete="off"
                  className="space-y-4"
                >
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                      <KeyRound className="w-3.5 h-3.5 text-[#39A900]" />
                      <span>Credenciales genéricas del prototipo</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                      <div>
                        Usuario:{' '}
                        <code className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {INSTRUCTOR_GENERIC_CREDENTIALS.username}
                        </code>
                      </div>
                      <div>
                        Contraseña:{' '}
                        <code className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {INSTRUCTOR_GENERIC_CREDENTIALS.password}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inst-username"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                    >
                      Usuario institucional *
                    </label>
                    <input
                      id="inst-username"
                      type="text"
                      required
                      autoComplete="off"
                      value={instUsername}
                      onChange={(e) => setInstUsername(e.target.value)}
                      placeholder="Ej. instructor.sena"
                      className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                    />
                    <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                      Pista: escribe el usuario genérico asignado al rol instructor.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="inst-password"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1"
                    >
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        id="inst-password"
                        type={showInstPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={instPassword}
                        onChange={(e) => setInstPassword(e.target.value)}
                        placeholder="Ingresa la contraseña genérica"
                        className="w-full pl-3 pr-10 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowInstPassword((prev) => !prev)}
                        aria-label={showInstPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showInstPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                      Pista: respeta las mayúsculas y el símbolo especial de la contraseña.
                    </p>
                  </div>

                  {instError && (
                    <p className="text-xs text-[#DC2626] dark:text-red-400">{instError}</p>
                  )}
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {instructorStep === 'overview' ? (
                <button
                  type="button"
                  onClick={() => {
                    resetInstructorForm();
                    setInstructorStep('auth');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Users className="w-4 h-4" />
                  Ingresar como Instructor Encargado
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetInstructorForm();
                      setInstructorStep('overview');
                    }}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    form="instructor-auth-form"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Lock className="w-4 h-4" />
                    Validar e ingresar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Proof / Metrics Strip */}
      <section
        id="indicadores"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2 scroll-mt-24"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Aprendices activos</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {apprentices.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Distribuidos en {COHORTS.length} fichas
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Instructor encargado</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            1
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
            {LEAD_INSTRUCTOR.fullName}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Ejes multimedia</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {INDUCTION_MODULES.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Normativa, símbolos y bienestar
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Evaluaciones activas</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {QUIZZES.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Con constancia digital al aprobar
          </div>
        </div>
      </section>
    </div>
  );
}
