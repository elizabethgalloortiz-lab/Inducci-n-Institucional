import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock,
  FileCheck2,
} from 'lucide-react';
import { INDUCTION_MODULES } from '../data/senaData';
import { ApprenticeRecord } from '../types/sena';
import { MultimediaPlayer } from './MultimediaPlayer';
import { ResilientImage } from './ResilientImage';

interface ModulesViewProps {
  activeApprentice: ApprenticeRecord;
  selectedModuleId: string;
  onSelectModule: (moduleId: string) => void;
  onToggleModuleComplete: (moduleId: string) => void;
  onOpenQuiz: (quizId: string) => void;
  onSignRegulation: () => void;
}

export function ModulesView({
  activeApprentice,
  selectedModuleId,
  onSelectModule,
  onToggleModuleComplete,
  onOpenQuiz,
  onSignRegulation,
}: ModulesViewProps) {
  const currentModule =
    INDUCTION_MODULES.find((m) => m.id === selectedModuleId) ?? INDUCTION_MODULES[0];

  const [selectedCaseOption, setSelectedCaseOption] = useState<Record<string, string>>({});

  const isCompleted = activeApprentice.completedModuleIds.includes(currentModule.id);
  const chosenOptionId = selectedCaseOption[currentModule.id];
  const chosenOption = currentModule.caseScenario.options.find((o) => o.id === chosenOptionId);

  const completedCount = activeApprentice.completedModuleIds.length;
  const totalCount = INDUCTION_MODULES.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top workspace header & apprentice progress strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Ruta Formativa de Inducción · {activeApprentice.fullName} · Ficha{' '}
            <span className="font-mono tabular-nums">{activeApprentice.fichaId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Módulos de Normativa e Imagen Institucional
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Avance en módulos</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {completedCount}/{totalCount} ({progressPercent}%)
            </div>
          </div>
          {!activeApprentice.regulationSigned ? (
            <button
              type="button"
              onClick={onSignRegulation}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileCheck2 className="w-4 h-4" />
              Firmar Compromiso (Acuerdo 009 de 2024)
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A] dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Compromiso Acuerdo 009 de 2024 firmado
            </div>
          )}
        </div>
      </div>

      {/* Horizontal module selector tabs */}
      <div
        role="tablist"
        aria-label="Módulos de inducción"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        {INDUCTION_MODULES.map((mod) => {
          const active = mod.id === currentModule.id;
          const done = activeApprentice.completedModuleIds.includes(mod.id);
          return (
            <button
              key={mod.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectModule(mod.id)}
              className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                active
                  ? 'bg-white dark:bg-slate-900 border-[#39A900] shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono tabular-nums font-medium">
                  0{mod.order} · {mod.durationMinutes} min
                </span>
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                {mod.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main 2-zone educational studio */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left/Primary Zone (Interactive Multimedia Stage + Case Practice) */}
        <div className="xl:col-span-8 space-y-6">
          <MultimediaPlayer
            kind={currentModule.multimediaKind}
            title={currentModule.multimediaTitle}
          />

          {/* Interactive Case Scenario Practice */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="text-xs font-medium text-[#2C8200] dark:text-emerald-400">
                Práctica Situacional · Aplicación Normativa
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {currentModule.normativeRef}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentModule.caseScenario.situation}
            </p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {currentModule.caseScenario.question}
            </h3>

            <div className="space-y-2.5">
              {currentModule.caseScenario.options.map((opt) => {
                const isSelected = chosenOptionId === opt.id;
                let borderStyle =
                  'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950/60';
                if (isSelected && opt.isCorrect) {
                  borderStyle =
                    'border-[#16A34A] bg-emerald-50/70 dark:bg-emerald-950/40';
                } else if (isSelected && !opt.isCorrect) {
                  borderStyle = 'border-[#DC2626] bg-red-50/60 dark:bg-red-950/40';
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setSelectedCaseOption((prev) => ({
                        ...prev,
                        [currentModule.id]: opt.id,
                      }))
                    }
                    className={`w-full text-left p-3.5 rounded-lg border text-sm text-slate-800 dark:text-slate-200 transition-colors cursor-pointer ${borderStyle}`}
                  >
                    <span className="font-mono font-semibold mr-2 uppercase text-slate-500 dark:text-slate-400">
                      {opt.id}.
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {chosenOption && (
              <div
                className={`p-4 rounded-lg border text-sm leading-relaxed ${
                  chosenOption.isCorrect
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100'
                    : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-100'
                }`}
              >
                <span className="font-semibold block mb-1">
                  {chosenOption.isCorrect ? 'Criterio adecuado' : 'Revisa el criterio normativo'}
                </span>
                {chosenOption.feedback}
              </div>
            )}
          </section>
        </div>

        {/* Right Zone (Concept Deck, Visual Context, Actions) */}
        <aside className="xl:col-span-4 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="space-y-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentModule.axis} · {currentModule.durationMinutes} min ·{' '}
              {isCompleted ? 'Estudiado' : 'Pendiente'}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {currentModule.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentModule.subtitle}
            </p>
          </div>

          <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <ResilientImage
              src={currentModule.imageUrl}
              alt={currentModule.imageAlt}
              fallbackTitle={currentModule.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Objetivos de aprendizaje
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {currentModule.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#2C8200] dark:text-emerald-400 mt-0.5 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Síntesis normativa
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentModule.keyPoints.map((kp, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {kp.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                      {kp.reference}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {kp.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <button
              type="button"
              onClick={() => onToggleModuleComplete(currentModule.id)}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#16A34A] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/70 dark:hover:bg-emerald-950'
                  : 'bg-[#39A900] hover:bg-[#2C8200] text-white'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Módulo marcado como estudiado
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Marcar módulo como estudiado
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenQuiz(currentModule.relatedQuizId)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              Ir al cuestionario evaluativo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
