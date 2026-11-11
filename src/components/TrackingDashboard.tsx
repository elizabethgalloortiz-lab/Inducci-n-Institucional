import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Plus,
  Search,
  UserCheck,
  X,
} from 'lucide-react';
import {
  COHORTS,
  computeApprenticeStatus,
  getApprenticeAverageScore,
  getApprenticeModulePercent,
  INDUCTION_MODULES,
  INDUCTION_SESSIONS,
  QUIZZES,
} from '../data/senaData';
import { ApprenticeRecord, ApprenticeStatus, ObservationNote } from '../types/sena';

interface TrackingDashboardProps {
  apprentices: ApprenticeRecord[];
  activeApprenticeId: string;
  onSelectActiveApprentice: (id: string) => void;
  onToggleAttendance: (apprenticeId: string, sessionIndex: number) => void;
  onToggleRegulationSigned: (apprenticeId: string) => void;
  onAddObservation: (
    apprenticeId: string,
    note: Omit<ObservationNote, 'id' | 'date'>,
  ) => void;
  onAddApprentice: (newApprentice: Omit<ApprenticeRecord, 'id'>) => void;
  onResetDemoData: () => void;
}

const STATUS_META: Record<
  ApprenticeStatus,
  { label: string; colorClass: string; Icon: typeof CheckCircle2 }
> = {
  completado: {
    label: 'Completado',
    colorClass: 'text-[#16A34A] dark:text-emerald-400',
    Icon: CheckCircle2,
  },
  en_progreso: {
    label: 'En progreso',
    colorClass: 'text-[#B45309] dark:text-amber-400',
    Icon: Clock,
  },
  prioritario: {
    label: 'Seguimiento prioritario',
    colorClass: 'text-[#DC2626] dark:text-red-400',
    Icon: AlertTriangle,
  },
};

export function TrackingDashboard({
  apprentices,
  activeApprenticeId,
  onSelectActiveApprentice,
  onToggleAttendance,
  onToggleRegulationSigned,
  onAddObservation,
  onAddApprentice,
  onResetDemoData,
}: TrackingDashboardProps) {
  const [selectedFicha, setSelectedFicha] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ApprenticeStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newFullName, setNewFullName] = useState('');
  const [newDocumentId, setNewDocumentId] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newFichaId, setNewFichaId] = useState(COHORTS[0].fichaId);

  const [obsText, setObsText] = useState('');
  const [obsCategory, setObsCategory] = useState<ObservationNote['category']>('academico');

  const cohortFiltered = useMemo(() => {
    if (selectedFicha === 'all') return apprentices;
    return apprentices.filter((a) => a.fichaId === selectedFicha);
  }, [apprentices, selectedFicha]);

  const filteredApprentices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cohortFiltered.filter((a) => {
      const status = computeApprenticeStatus(a);
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.documentId.includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    });
  }, [cohortFiltered, statusFilter, searchQuery]);

  const kpis = useMemo(() => {
    const total = cohortFiltered.length;
    if (total === 0) {
      return { total: 0, avgModulePct: 0, avgQuizScore: 0, priorityCount: 0, completedCount: 0 };
    }
    let modulePctSum = 0;
    let quizScoreSum = 0;
    let quizEvaluatedCount = 0;
    let priorityCount = 0;
    let completedCount = 0;

    for (const a of cohortFiltered) {
      modulePctSum += getApprenticeModulePercent(a);
      const avg = getApprenticeAverageScore(a);
      if (avg !== null) {
        quizScoreSum += avg;
        quizEvaluatedCount += 1;
      }
      const st = computeApprenticeStatus(a);
      if (st === 'prioritario') priorityCount += 1;
      if (st === 'completado') completedCount += 1;
    }

    return {
      total,
      avgModulePct: Math.round(modulePctSum / total),
      avgQuizScore: quizEvaluatedCount > 0 ? Math.round(quizScoreSum / quizEvaluatedCount) : 0,
      priorityCount,
      completedCount,
    };
  }, [cohortFiltered]);

  const moduleCoverage = useMemo(() => {
    const total = cohortFiltered.length || 1;
    return INDUCTION_MODULES.map((mod) => {
      const doneCount = cohortFiltered.filter((a) =>
        a.completedModuleIds.includes(mod.id),
      ).length;
      return {
        id: mod.id,
        order: mod.order,
        title: mod.title,
        doneCount,
        totalCount: cohortFiltered.length,
        percent: Math.round((doneCount / total) * 100),
      };
    });
  }, [cohortFiltered]);

  const inspectedApprentice = apprentices.find((a) => a.id === inspectedId) ?? null;
  const activeCohortInfo = COHORTS.find((c) => c.fichaId === selectedFicha);

  const handleExportCsv = () => {
    const headers = [
      'Nombre Completo',
      'Documento',
      'Correo SENA',
      'Ficha',
      'Avance Modulos (%)',
      'Promedio Cuestionarios (%)',
      'Asistencia Induccion',
      'Compromiso Reglamento',
      'Estado Seguimiento',
    ];
    const rows = filteredApprentices.map((a) => {
      const avg = getApprenticeAverageScore(a);
      const att = a.inductionAttendance.filter(Boolean).length;
      const status = STATUS_META[computeApprenticeStatus(a)].label;
      return [
        `"${a.fullName}"`,
        a.documentId,
        a.email,
        a.fichaId,
        `${getApprenticeModulePercent(a)}%`,
        avg !== null ? `${avg}%` : 'Sin evaluar',
        `${att}/5`,
        a.regulationSigned ? 'Firmado' : 'Pendiente',
        `"${status}"`,
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seguimiento-induccion-sena-${selectedFicha}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateApprentice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newDocumentId.trim()) return;
    onAddApprentice({
      fullName: newFullName.trim(),
      documentId: newDocumentId.trim(),
      email:
        newEmail.trim() ||
        `${newFullName.trim().toLowerCase().replace(/\s+/g, '.')}@soy.sena.edu.co`,
      fichaId: newFichaId,
      completedModuleIds: [],
      quizAttempts: {},
      inductionAttendance: [true, false, false, false, false],
      regulationSigned: false,
      observations: [],
      lastActivity: new Date().toISOString().slice(0, 10),
    });
    setNewFullName('');
    setNewDocumentId('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectedApprentice || !obsText.trim()) return;
    onAddObservation(inspectedApprentice.id, {
      author: activeCohortInfo?.instructorLead ?? 'Instructor Líder de Inducción',
      text: obsText.trim(),
      category: obsCategory,
    });
    setObsText('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Revisión única por {COHORTS[0].instructorLead} ·{' '}
            {activeCohortInfo
              ? `Ficha ${activeCohortInfo.fichaId} · ${activeCohortInfo.programName}`
              : 'Todas las fichas activas'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Seguimiento del Proceso de Inducción SENA
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Registrar Aprendiz
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Aprendices en seguimiento
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {kpis.total}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            {kpis.completedCount} con ruta completada
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Avance promedio en módulos
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {kpis.avgModulePct}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sobre 5 ejes institucionales
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Promedio en cuestionarios
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
            {kpis.avgQuizScore}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Meta mínima aprobatoria: 70%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 dark:text-slate-400">Alertas de permanencia</div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
              kpis.priorityCount > 0
                ? 'text-[#DC2626] dark:text-red-400'
                : 'text-[#16A34A] dark:text-emerald-400'
            }`}
          >
            {kpis.priorityCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {kpis.priorityCount > 0 ? 'Requieren contacto oportuno' : 'Sin alertas críticas'}
          </div>
        </div>
      </div>

      {/* Cohort Module Coverage Matrix */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Cumplimiento de la cohorte por eje de inducción
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sincronizado en tiempo real con el avance de cada aprendiz
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {moduleCoverage.map((item) => (
            <div key={item.id} className="space-y-2 pt-1">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  0{item.order}
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  {item.percent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#39A900] transition-all duration-200"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <div className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                {item.title}
              </div>
              <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {item.doneCount}/{item.totalCount} aprendices
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter & Search Toolbar + Apprentice Data Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filtrar por ficha"
              value={selectedFicha}
              onChange={(e) => setSelectedFicha(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
            >
              <option value="all">Todas las fichas ({apprentices.length})</option>
              {COHORTS.map((c) => (
                <option key={c.fichaId} value={c.fichaId}>
                  Ficha {c.fichaId} · {c.programName}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'completado', label: 'Completado' },
                  { id: 'en_progreso', label: 'En progreso' },
                  { id: 'prioritario', label: 'Prioritario' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar nombre o documento..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-2 focus:outline-[#39A900]"
            />
          </div>
        </div>

        {filteredApprentices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              No hay aprendices que coincidan con los filtros actuales.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ajusta la búsqueda, cambia de ficha o registra un nuevo aprendiz en el proceso.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedFicha('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-3.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg cursor-pointer"
              >
                Limpiar filtros
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer"
              >
                Registrar Aprendiz
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Aprendiz y Documento</th>
                  <th className="py-3 px-4">Ficha</th>
                  <th className="py-3 px-4 text-right">Módulos</th>
                  <th className="py-3 px-4 text-right">Evaluaciones</th>
                  <th className="py-3 px-4 text-right">Asistencia</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredApprentices.map((a) => {
                  const modPct = getApprenticeModulePercent(a);
                  const avgQuiz = getApprenticeAverageScore(a);
                  const attCount = a.inductionAttendance.filter(Boolean).length;
                  const status = computeApprenticeStatus(a);
                  const meta = STATUS_META[status];
                  const StatusIcon = meta.Icon;
                  const isCurrentPreview = a.id === activeApprenticeId;

                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {a.fullName}
                        </div>
                        <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          CC {a.documentId} · {a.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-xs text-slate-700 dark:text-slate-300">
                        {a.fichaId}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        {modPct}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        {avgQuiz !== null ? `${avgQuiz}%` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {attCount}/5
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${meta.colorClass}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectActiveApprentice(a.id)}
                            title="Simular vista de este aprendiz"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer whitespace-nowrap ${
                              isCurrentPreview
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#39A900] text-[#2C8200] dark:text-emerald-400'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            {isCurrentPreview ? 'Activo' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setInspectedId(a.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-md cursor-pointer whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Detalle
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
          <span>
            Mostrando <span className="font-mono tabular-nums">{filteredApprentices.length}</span> de{' '}
            <span className="font-mono tabular-nums">{apprentices.length}</span> registros
          </span>
          <button
            type="button"
            onClick={onResetDemoData}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 cursor-pointer"
          >
            Restablecer datos iniciales de demostración
          </button>
        </div>
      </section>

      {/* Slide-over / Modal: Apprentice Detailed Tracking & Observation Logger */}
      {inspectedApprentice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex justify-end"
        >
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full overflow-y-auto border-l border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  Ficha {inspectedApprentice.fichaId} · CC {inspectedApprentice.documentId}
                </div>
                <h2
                  id="detail-modal-title"
                  className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5"
                >
                  {inspectedApprentice.fullName}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {inspectedApprentice.email}
                </div>
                {inspectedApprentice.interestArea && (
                  <div className="text-xs text-[#2C8200] dark:text-emerald-400 font-medium mt-1.5">
                    Interés: {inspectedApprentice.interestArea}
                    {inspectedApprentice.learningGoal
                      ? ` · Meta: ${inspectedApprentice.learningGoal}`
                      : ''}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setInspectedId(null)}
                aria-label="Cerrar detalle"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attendance checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Asistencia a jornadas de inducción
                </h3>
                <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                  {inspectedApprentice.inductionAttendance.filter(Boolean).length}/5 días
                </span>
              </div>
              <div className="space-y-2">
                {INDUCTION_SESSIONS.map((label, idx) => {
                  const attended = inspectedApprentice.inductionAttendance[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onToggleAttendance(inspectedApprentice.id, idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer transition-colors ${
                        attended
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-[#39A900] text-slate-900 dark:text-slate-100'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{label}</span>
                      <span className="font-medium shrink-0">
                        {attended ? 'Asistió' : 'Sin registro'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Regulation signature & Quiz summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Compromiso del Reglamento
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {inspectedApprentice.regulationSigned ? 'Firmado' : 'Pendiente'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleRegulationSigned(inspectedApprentice.id)}
                    className="text-xs font-medium text-[#2C8200] dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Cambiar estado
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Cuestionarios presentados
                </div>
                <div className="text-sm font-semibold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {Object.keys(inspectedApprentice.quizAttempts).length} de {QUIZZES.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Promedio:{' '}
                  <span className="font-mono tabular-nums">
                    {getApprenticeAverageScore(inspectedApprentice) ?? '—'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Observations log & new note */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Bitácora de observaciones y seguimiento
              </h3>

              <form onSubmit={handleCreateObservation} className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={obsCategory}
                    onChange={(e) =>
                      setObsCategory(e.target.value as ObservationNote['category'])
                    }
                    className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100"
                  >
                    <option value="academico">Académico</option>
                    <option value="asistencia">Asistencia</option>
                    <option value="convivencia">Convivencia / Normativa</option>
                    <option value="bienestar">Bienestar al Aprendiz</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={obsText}
                  onChange={(e) => setObsText(e.target.value)}
                  placeholder="Registrar novedad, compromiso o remisión a Bienestar..."
                  className="w-full p-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-2 focus:outline-[#39A900]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer"
                >
                  Guardar observación
                </button>
              </form>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {inspectedApprentice.observations.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                    No hay observaciones registradas para este aprendiz.
                  </p>
                ) : (
                  inspectedApprentice.observations.map((obs) => (
                    <div key={obs.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-200 capitalize">
                          {obs.category} · {obs.author}
                        </span>
                        <span className="font-mono tabular-nums">{obs.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{obs.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Apprentice */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-apprentice-title"
          className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2
                id="add-apprentice-title"
                className="text-lg font-bold text-slate-900 dark:text-slate-100"
              >
                Registrar aprendiz en inducción
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Cerrar formulario"
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApprentice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Nombre completo
                </label>
                <input
                  required
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ej. Andrés Felipe Castaño"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Documento de identidad
                </label>
                <input
                  required
                  type="text"
                  value={newDocumentId}
                  onChange={(e) => setNewDocumentId(e.target.value)}
                  placeholder="Ej. 1037654321"
                  className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Correo institucional (opcional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nombre@soy.sena.edu.co"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Ficha de formación
                </label>
                <select
                  value={newFichaId}
                  onChange={(e) => setNewFichaId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                >
                  {COHORTS.map((c) => (
                    <option key={c.fichaId} value={c.fichaId}>
                      Ficha {c.fichaId} · {c.programName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer"
                >
                  Guardar registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
