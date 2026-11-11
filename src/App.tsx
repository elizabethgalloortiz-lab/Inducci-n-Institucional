/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { HomeView } from './components/HomeView';
import { LandingPage } from './components/LandingPage';
import { ModulesView } from './components/ModulesView';
import { QuizzesView } from './components/QuizzesView';
import { SenaHeader } from './components/SenaHeader';
import { TrackingDashboard } from './components/TrackingDashboard';
import { VideoManualModal } from './components/VideoManualModal';
import { INDUCTION_MODULES, INITIAL_APPRENTICES, QUIZZES } from './data/senaData';
import {
  ApprenticeRecord,
  AppView,
  ObservationNote,
  QuizAttempt,
  UserRole,
} from './types/sena';

const STORAGE_KEY = 'ruta_induccion_sena_state_v1';
const THEME_STORAGE_KEY = 'ruta_induccion_sena_theme_v1';

interface PersistedState {
  apprentices: ApprenticeRecord[];
  activeApprenticeId: string;
}

function loadInitialState(): PersistedState {
  if (typeof window === 'undefined') {
    return {
      apprentices: INITIAL_APPRENTICES,
      activeApprenticeId: INITIAL_APPRENTICES[0].id,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        apprentices: INITIAL_APPRENTICES,
        activeApprenticeId: INITIAL_APPRENTICES[0].id,
      };
    }
    const parsed = JSON.parse(raw) as PersistedState;
    if (Array.isArray(parsed.apprentices) && parsed.apprentices.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback to initial seed data if localStorage is corrupted
  }
  return {
    apprentices: INITIAL_APPRENTICES,
    activeApprenticeId: INITIAL_APPRENTICES[0].id,
  };
}

function loadInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

export default function App() {
  const [persisted, setPersisted] = useState<PersistedState>(loadInitialState);
  const [sessionMode, setSessionMode] = useState<'landing' | UserRole>('landing');
  const [activeView, setActiveView] = useState<AppView>('inicio');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(INDUCTION_MODULES[0].id);
  const [selectedQuizId, setSelectedQuizId] = useState<string>(QUIZZES[0].id);

  const [isDark, setIsDark] = useState<boolean>(loadInitialTheme);
  const [isThemeBlurring, setIsThemeBlurring] = useState<boolean>(false);
  const [isVideoManualOpen, setIsVideoManualOpen] = useState<boolean>(false);
  const swapTimerRef = useRef<number | null>(null);
  const unblurTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    return () => {
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
      if (unblurTimerRef.current) window.clearTimeout(unblurTimerRef.current);
    };
  }, []);

  const handleToggleDark = () => {
    if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
    if (unblurTimerRef.current) window.clearTimeout(unblurTimerRef.current);

    setIsThemeBlurring(true);
    swapTimerRef.current = window.setTimeout(() => {
      setIsDark((prev) => !prev);
      unblurTimerRef.current = window.setTimeout(() => {
        setIsThemeBlurring(false);
      }, 200);
    }, 180);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore quota errors cleanly
    }
  }, [persisted]);

  const activeApprentice =
    persisted.apprentices.find((a) => a.id === persisted.activeApprenticeId) ??
    persisted.apprentices[0];

  const handleSelectActiveApprentice = (id: string) => {
    setPersisted((prev) => ({ ...prev, activeApprenticeId: id }));
  };

  const handleEnterAsApprentice = (apprenticeId: string) => {
    setPersisted((prev) => ({ ...prev, activeApprenticeId: apprenticeId }));
    setSessionMode('aprendiz');
    setActiveView('inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterAsInstructor = () => {
    setSessionMode('instructor');
    setActiveView('seguimiento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToLanding = () => {
    setSessionMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleModuleComplete = (moduleId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setPersisted((prev) => ({
      ...prev,
      apprentices: prev.apprentices.map((a) => {
        if (a.id !== prev.activeApprenticeId) return a;
        const exists = a.completedModuleIds.includes(moduleId);
        const nextIds = exists
          ? a.completedModuleIds.filter((id) => id !== moduleId)
          : [...a.completedModuleIds, moduleId];
        return { ...a, completedModuleIds: nextIds, lastActivity: today };
      }),
    }));
  };

  const handleSignRegulation = () => {
    const today = new Date().toISOString().slice(0, 10);
    setPersisted((prev) => ({
      ...prev,
      apprentices: prev.apprentices.map((a) =>
        a.id === prev.activeApprenticeId
          ? { ...a, regulationSigned: true, lastActivity: today }
          : a,
      ),
    }));
  };

  const handleSaveQuizAttempt = (attempt: QuizAttempt) => {
    setPersisted((prev) => ({
      ...prev,
      apprentices: prev.apprentices.map((a) => {
        if (a.id !== prev.activeApprenticeId) return a;
        return {
          ...a,
          quizAttempts: {
            ...a.quizAttempts,
            [attempt.quizId]: attempt,
          },
          lastActivity: attempt.completedAt,
        };
      }),
    }));
  };

  const handleToggleAttendance = (apprenticeId: string, sessionIndex: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setPersisted((prev) => ({
      ...prev,
      apprentices: prev.apprentices.map((a) => {
        if (a.id !== apprenticeId) return a;
        const nextAtt = [...a.inductionAttendance];
        nextAtt[sessionIndex] = !nextAtt[sessionIndex];
        return { ...a, inductionAttendance: nextAtt, lastActivity: today };
      }),
    }));
  };

  const handleToggleRegulationSignedById = (apprenticeId: string) => {
    setPersisted((prev) => ({
      ...prev,
      apprentices: prev.apprentices.map((a) =>
        a.id === apprenticeId ? { ...a, regulationSigned: !a.regulationSigned } : a,
      ),
    }));
  };

  const handleAddObservation = (
    apprenticeId: string,
    note: Omit<ObservationNote, 'id' | 'date'>,
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const newObs: ObservationNote = {
      id: `obs-${Date.now()}`,
      date: today,
      ...note,
    };
    setPersisted((prev) => ({
      ...prev,
      apprentices: prev.apprentices.map((a) =>
        a.id === apprenticeId
          ? { ...a, observations: [newObs, ...a.observations], lastActivity: today }
          : a,
      ),
    }));
  };

  const handleAddApprentice = (newApprentice: Omit<ApprenticeRecord, 'id'>): string => {
    const createdId = `apr-${Date.now()}`;
    const created: ApprenticeRecord = {
      ...newApprentice,
      id: createdId,
    };
    setPersisted((prev) => ({
      ...prev,
      apprentices: [created, ...prev.apprentices],
    }));
    return createdId;
  };

  const handleResetDemoData = () => {
    setPersisted({
      apprentices: INITIAL_APPRENTICES,
      activeApprenticeId: INITIAL_APPRENTICES[0].id,
    });
  };

  const handleOpenModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setActiveView('modulos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setActiveView('cuestionarios');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrimaryHeaderAction = () => {
    if (sessionMode === 'landing') {
      const target = document.getElementById('acceso-rol');
      target?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    handleReturnToLanding();
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 theme-blur-stage ${
        isThemeBlurring ? 'theme-blur-active' : ''
      }`}
    >
      <SenaHeader
        mode={sessionMode}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBrandClick={handleReturnToLanding}
        onPrimaryAction={handlePrimaryHeaderAction}
        primaryActionLabel={sessionMode === 'landing' ? 'Seleccionar Rol' : 'Cambiar Rol'}
        onOpenVideoManual={() => setIsVideoManualOpen(true)}
        isDark={isDark}
        onToggleDark={handleToggleDark}
      />

      <main className="flex-1">
        {sessionMode === 'landing' && (
          <LandingPage
            apprentices={persisted.apprentices}
            selectedApprenticeId={activeApprentice.id}
            onEnterAsApprentice={handleEnterAsApprentice}
            onEnterAsInstructor={handleEnterAsInstructor}
            onRegisterApprentice={handleAddApprentice}
            onOpenVideoManual={() => setIsVideoManualOpen(true)}
          />
        )}

        {sessionMode !== 'landing' && activeView === 'inicio' && (
          <HomeView
            apprentices={persisted.apprentices}
            activeApprentice={activeApprentice}
            onSelectActiveApprentice={handleSelectActiveApprentice}
            onNavigate={(view) => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenModule={handleOpenModule}
          />
        )}

        {sessionMode !== 'landing' && activeView === 'modulos' && (
          <ModulesView
            activeApprentice={activeApprentice}
            selectedModuleId={selectedModuleId}
            onSelectModule={setSelectedModuleId}
            onToggleModuleComplete={handleToggleModuleComplete}
            onOpenQuiz={handleOpenQuiz}
            onSignRegulation={handleSignRegulation}
          />
        )}

        {sessionMode !== 'landing' && activeView === 'cuestionarios' && (
          <QuizzesView
            activeApprentice={activeApprentice}
            selectedQuizId={selectedQuizId}
            onSelectQuiz={setSelectedQuizId}
            onSaveAttempt={handleSaveQuizAttempt}
          />
        )}

        {sessionMode === 'instructor' && activeView === 'seguimiento' && (
          <TrackingDashboard
            apprentices={persisted.apprentices}
            activeApprenticeId={activeApprentice.id}
            onSelectActiveApprentice={handleSelectActiveApprentice}
            onToggleAttendance={handleToggleAttendance}
            onToggleRegulationSigned={handleToggleRegulationSignedById}
            onAddObservation={handleAddObservation}
            onAddApprentice={handleAddApprentice}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-12 transition-colors duration-300 no-print">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Ruta Inducción SENA · Formación Profesional Integral, Normativa e Imagen Institucional
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleReturnToLanding}
              className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
            >
              Selección de rol
            </button>
            {sessionMode !== 'landing' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveView('modulos')}
                  className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                >
                  Módulos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('cuestionarios')}
                  className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                >
                  Cuestionarios
                </button>
              </>
            )}
            {sessionMode === 'instructor' && (
              <button
                type="button"
                onClick={() => setActiveView('seguimiento')}
                className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
              >
                Seguimiento
              </button>
            )}
          </div>
        </div>
      </footer>

      <VideoManualModal
        isOpen={isVideoManualOpen}
        onClose={() => setIsVideoManualOpen(false)}
      />
    </div>
  );
}
