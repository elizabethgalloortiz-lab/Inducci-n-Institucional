import { ArrowRight, BookOpen, ClipboardCheck, PlayCircle } from 'lucide-react';
import {
  COHORTS,
  getApprenticeAverageScore,
  getApprenticeModulePercent,
  INDUCTION_MODULES,
  SENA_IMAGES,
} from '../data/senaData';
import { ApprenticeRecord, AppView } from '../types/sena';
import { ResilientImage } from './ResilientImage';

interface HomeViewProps {
  apprentices: ApprenticeRecord[];
  activeApprentice: ApprenticeRecord;
  onSelectActiveApprentice: (id: string) => void;
  onNavigate: (view: AppView) => void;
  onOpenModule: (moduleId: string) => void;
}

export function HomeView({
  apprentices,
  activeApprentice,
  onSelectActiveApprentice,
  onNavigate,
  onOpenModule,
}: HomeViewProps) {
  const cohort = COHORTS.find((c) => c.fichaId === activeApprentice.fichaId);
  const myModPct = getApprenticeModulePercent(activeApprentice);
  const myAvgQuiz = getApprenticeAverageScore(activeApprentice);
  const myAttendance = activeApprentice.inductionAttendance.filter(Boolean).length;

  const totalCompletedModulesAll = apprentices.reduce(
    (sum, a) => sum + a.completedModuleIds.length,
    0,
  );
  const cohortOverallPct = Math.round(
    (totalCompletedModulesAll / (apprentices.length * INDUCTION_MODULES.length)) * 100,
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Workspace role / apprentice switcher toolbar below header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Centro de Servicios y Formación ·{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {cohort?.programName ?? 'Programa SENA'}
          </span>{' '}
          · Ficha <span className="font-mono tabular-nums">{activeApprentice.fichaId}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <label
            htmlFor="active-apprentice-select"
            className="text-xs text-slate-500 dark:text-slate-400 shrink-0"
          >
            Aprendiz activo:
          </label>
          <select
            id="active-apprentice-select"
            value={activeApprentice.id}
            onChange={(e) => onSelectActiveApprentice(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
          >
            {apprentices.map((a) => (
              <option key={a.id} value={a.id}>
                {a.fullName} (Ficha {a.fichaId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Balanced 2-column Hero Split with items-stretch */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 py-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wide text-[#2C8200] dark:text-emerald-400">
              Inducción Institucional SENA · Prototipo Interactivo
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.12] [text-wrap:balance]">
              Domina la normativa, los símbolos y la cultura SENA desde el primer día
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Una plataforma diseñada para que cada aprendiz explore de manera dinámica el
              Reglamento del Aprendiz (Acuerdo 009 de 2024 · act. Acuerdo 002 de 2026) y la
              identidad institucional, mientras instructores y coordinadores realizan seguimiento
              oportuno por ficha.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('modulos')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#39A900] hover:bg-[#2C8200] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <PlayCircle className="w-4 h-4" />
              Iniciar ruta multimedia
            </button>
            <button
              type="button"
              onClick={() => onNavigate('cuestionarios')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <ClipboardCheck className="w-4 h-4" />
              Presentar cuestionarios
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            5 módulos multimedia · 4 cuestionarios con retroalimentación normativa · Seguimiento en vivo
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[300px]">
          <ResilientImage
            src={SENA_IMAGES.heroCampus}
            alt="Aprendices e instructora SENA colaborando en laboratorio de innovación técnica"
            fallbackTitle="Ambiente de Formación SENA"
            className="w-full h-full lg:h-full object-cover"
          />
        </div>
      </section>

      {/* Full-width 4-column Live KPI Summary Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Tu avance en módulos</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {myModPct}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            {activeApprentice.completedModuleIds.length} de {INDUCTION_MODULES.length} completados
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Promedio en cuestionarios</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {myAvgQuiz !== null ? `${myAvgQuiz}%` : 'Sin nota'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Evaluación con retroalimentación
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Asistencia a inducción</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {myAttendance}/5 días
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Jornadas registradas</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Progreso global de cohortes</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {cohortOverallPct}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            {apprentices.length} aprendices monitoreados
          </div>
        </div>
      </section>

      {/* Direct access to the induction modules */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Ejes de aprendizaje interactivo
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Accede directamente a simuladores visuales, explorador de símbolos y casos prácticos del Reglamento.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('cuestionarios')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2C8200] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            Ir a cuestionarios evaluativos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INDUCTION_MODULES.slice(0, 3).map((mod) => {
            const done = activeApprentice.completedModuleIds.includes(mod.id);
            return (
              <article
                key={mod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-100 dark:border-slate-800">
                  <ResilientImage
                    src={mod.imageUrl}
                    alt={mod.imageAlt}
                    fallbackTitle={mod.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      0{mod.order}. {mod.axis} · {mod.durationMinutes} min ·{' '}
                      {done ? 'Completado' : 'Pendiente'}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {mod.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenModule(mod.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2C8200] dark:text-emerald-400 hover:text-[#1F5E00] dark:hover:text-emerald-300 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    Abrir módulo interactivo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
