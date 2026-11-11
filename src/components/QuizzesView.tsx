import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Printer,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { COHORTS, QUIZZES } from '../data/senaData';
import {
  ApprenticeRecord,
  MatchQuestion,
  OrderQuestion,
  QuizAttempt,
  QuizDefinition,
  SingleChoiceQuestion,
} from '../types/sena';

interface QuizzesViewProps {
  activeApprentice: ApprenticeRecord;
  selectedQuizId: string;
  onSelectQuiz: (quizId: string) => void;
  onSaveAttempt: (attempt: QuizAttempt) => void;
}

type AnswerState = Record<string, unknown>;

export function QuizzesView({
  activeApprentice,
  selectedQuizId,
  onSelectQuiz,
  onSaveAttempt,
}: QuizzesViewProps) {
  const activeQuiz: QuizDefinition =
    QUIZZES.find((q) => q.id === selectedQuizId) ?? QUIZZES[0];

  const [answers, setAnswers] = useState<AnswerState>({});
  const [submittedQuizIds, setSubmittedQuizIds] = useState<Record<string, boolean>>({});
  const [showCertificate, setShowCertificate] = useState(false);

  const isSubmitted = Boolean(submittedQuizIds[activeQuiz.id]);
  const previousAttempt = activeApprentice.quizAttempts[activeQuiz.id];

  const getOrderAnswer = (q: OrderQuestion): number[] => {
    const val = answers[q.id];
    if (Array.isArray(val) && val.length === q.items.length) return val as number[];
    return q.items.map((_, i) => i);
  };

  const getMatchAnswer = (q: MatchQuestion): Record<number, string> => {
    const val = answers[q.id];
    if (val && typeof val === 'object') return val as Record<number, string>;
    return {};
  };

  const moveOrderItem = (q: OrderQuestion, index: number, direction: -1 | 1) => {
    if (isSubmitted) return;
    const current = [...getOrderAnswer(q)];
    const target = index + direction;
    if (target < 0 || target >= current.length) return;
    [current[index], current[target]] = [current[target], current[index]];
    setAnswers((prev) => ({ ...prev, [q.id]: current }));
  };

  const isQuestionCorrect = (q: QuizDefinition['questions'][number]): boolean => {
    if (q.type === 'single' || q.type === 'scenario') {
      const sq = q as SingleChoiceQuestion;
      return answers[q.id] === sq.correctIndex;
    }
    if (q.type === 'order') {
      const oq = q as OrderQuestion;
      const arr = getOrderAnswer(oq);
      return arr.every((val, idx) => val === oq.correctOrder[idx]);
    }
    if (q.type === 'match') {
      const mq = q as MatchQuestion;
      const map = getMatchAnswer(mq);
      return mq.pairs.every((pair, idx) => map[idx] === pair.right);
    }
    return false;
  };

  const evaluationResult = useMemo(() => {
    const totalCount = activeQuiz.questions.length;
    let correctCount = 0;
    for (const q of activeQuiz.questions) {
      if (isQuestionCorrect(q)) correctCount += 1;
    }
    const score = Math.round((correctCount / totalCount) * 100);
    return { correctCount, totalCount, score };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuiz, answers]);

  const handleSubmitQuiz = () => {
    const today = new Date().toISOString().slice(0, 10);
    setSubmittedQuizIds((prev) => ({ ...prev, [activeQuiz.id]: true }));
    onSaveAttempt({
      quizId: activeQuiz.id,
      score: evaluationResult.score,
      correctCount: evaluationResult.correctCount,
      totalCount: evaluationResult.totalCount,
      completedAt: today,
    });
  };

  const handleResetQuiz = () => {
    const nextAnswers = { ...answers };
    for (const q of activeQuiz.questions) {
      delete nextAnswers[q.id];
    }
    setAnswers(nextAnswers);
    setSubmittedQuizIds((prev) => ({ ...prev, [activeQuiz.id]: false }));
  };

  const certAttempt = activeApprentice.quizAttempts['quiz-integral'];
  const isCertified = Boolean(certAttempt && certAttempt.score >= 70);
  const cohort = COHORTS.find((c) => c.fichaId === activeApprentice.fichaId);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Evaluación Interactiva · {activeApprentice.fullName} · Ficha{' '}
            <span className="font-mono tabular-nums">{activeApprentice.fichaId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Cuestionarios de Normativa e Imagen SENA
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {isCertified ? (
            <button
              type="button"
              onClick={() => setShowCertificate((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer whitespace-nowrap"
            >
              <Award className="w-4 h-4" />
              {showCertificate ? 'Ocultar Constancia' : 'Ver Constancia de Inducción'}
            </button>
          ) : (
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Aprueba la Evaluación Final (<span className="font-mono tabular-nums">≥ 70%</span>) para generar tu constancia.
            </div>
          )}
        </div>
      </div>

      {/* Digital Certificate view when certified and toggled */}
      {showCertificate && isCertified && (
        <section className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-8 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#2C8200] dark:text-emerald-400">
                SERVICIO NACIONAL DE APRENDIZAJE · SENA
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                Constancia Digital de Inducción Institucional
              </h2>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Guardar PDF
            </button>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Se hace constar que el aprendiz{' '}
            <strong className="text-slate-900 dark:text-white">{activeApprentice.fullName}</strong>,
            identificado con documento{' '}
            <span className="font-mono tabular-nums">{activeApprentice.documentId}</span>, vinculado a
            la ficha{' '}
            <span className="font-mono tabular-nums font-semibold">
              {activeApprentice.fichaId}
            </span>{' '}
            ({cohort?.programName ?? 'Programa Titulado'}), aprobó satisfactoriamente la evaluación
            integral de normativa vigente (Reglamento del Aprendiz · Acuerdo 009 de 2024, act.
            Acuerdo 002 de 2026) e imagen institucional SENA.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Calificación obtenida
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-[#16A34A] dark:text-emerald-400">
                {certAttempt.score}% ({certAttempt.correctCount}/{certAttempt.totalCount})
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Centro de formación</div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {cohort?.centerName ?? 'Centro SENA'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Fecha de validación</div>
              <div className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {certAttempt.completedAt}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quiz Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 no-print">
        {QUIZZES.map((quiz) => {
          const isActive = quiz.id === activeQuiz.id;
          const attempt = activeApprentice.quizAttempts[quiz.id];
          return (
            <button
              key={quiz.id}
              type="button"
              onClick={() => onSelectQuiz(quiz.id)}
              className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-[#39A900] shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono tabular-nums">
                  {quiz.questions.length} preguntas · {quiz.estimatedMinutes} min
                </span>
                {attempt ? (
                  <span
                    className={`font-mono tabular-nums font-semibold ${
                      attempt.score >= quiz.passingScore
                        ? 'text-[#16A34A] dark:text-emerald-400'
                        : 'text-[#D97706] dark:text-amber-400'
                    }`}
                  >
                    {attempt.score}%
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">Sin presentar</span>
                )}
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {quiz.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Quiz Engine */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start no-print">
        <div className="xl:col-span-8 space-y-5">
          {activeQuiz.questions.map((q, qIdx) => {
            const correct = isQuestionCorrect(q);
            return (
              <article
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-200">
                    Pregunta {qIdx + 1} de {activeQuiz.questions.length}
                  </span>
                  <span>{q.normativeCitation}</span>
                </div>

                {q.context && (
                  <div className="text-xs font-medium text-[#2C8200] dark:text-emerald-400">
                    {q.context}
                  </div>
                )}

                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {q.prompt}
                </h3>

                {/* Type 1: Single choice & Scenario */}
                {(q.type === 'single' || q.type === 'scenario') && (
                  <div className="space-y-2">
                    {(q as SingleChoiceQuestion).options.map((opt, optIdx) => {
                      const chosen = answers[q.id] === optIdx;
                      const isRight = (q as SingleChoiceQuestion).correctIndex === optIdx;

                      let cls =
                        'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
                      if (!isSubmitted && chosen) {
                        cls =
                          'border-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/50 text-slate-900 dark:text-slate-100 font-medium';
                      } else if (isSubmitted && isRight) {
                        cls =
                          'border-[#16A34A] bg-emerald-50 dark:bg-emerald-950/60 text-slate-900 dark:text-slate-100 font-medium';
                      } else if (isSubmitted && chosen && !isRight) {
                        cls =
                          'border-[#DC2626] bg-red-50 dark:bg-red-950/50 text-slate-900 dark:text-slate-100';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`w-full text-left p-3.5 rounded-lg border text-sm transition-colors flex items-center justify-between gap-3 ${
                            isSubmitted ? 'cursor-default' : 'cursor-pointer'
                          } ${cls}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && isRight && (
                            <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && chosen && !isRight && (
                            <XCircle className="w-4 h-4 text-[#DC2626] dark:text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Type 2: Order steps */}
                {q.type === 'order' && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Usa las flechas para ordenar los pasos de arriba (1.°) hacia abajo (4.°):
                    </p>
                    {getOrderAnswer(q as OrderQuestion).map((itemIdx, pos) => {
                      const oq = q as OrderQuestion;
                      const isPosCorrect = isSubmitted && itemIdx === oq.correctOrder[pos];
                      return (
                        <div
                          key={itemIdx}
                          className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-sm ${
                            isSubmitted
                              ? isPosCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#16A34A]'
                                : 'bg-red-50 dark:bg-red-950/50 border-[#DC2626]'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-mono tabular-nums text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                              {pos + 1}.
                            </span>
                            <span className="text-slate-800 dark:text-slate-200">
                              {oq.items[itemIdx]}
                            </span>
                          </div>
                          {!isSubmitted && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={pos === 0}
                                onClick={() => moveOrderItem(oq, pos, -1)}
                                aria-label="Subir paso"
                                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-35 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={pos === oq.items.length - 1}
                                onClick={() => moveOrderItem(oq, pos, 1)}
                                aria-label="Bajar paso"
                                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-35 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Type 3: Match pairs */}
                {q.type === 'match' && (
                  <div className="space-y-3">
                    {(q as MatchQuestion).pairs.map((pair, idx) => {
                      const mq = q as MatchQuestion;
                      const currentSelection = getMatchAnswer(mq)[idx] ?? '';
                      const isPairRight = isSubmitted && currentSelection === pair.right;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center ${
                            isSubmitted
                              ? isPairRight
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#16A34A]'
                                : 'bg-red-50 dark:bg-red-950/50 border-[#DC2626]'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="sm:col-span-5 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {pair.left}
                          </div>
                          <div className="sm:col-span-7">
                            <select
                              disabled={isSubmitted}
                              value={currentSelection}
                              onChange={(e) => {
                                const nextMap = { ...getMatchAnswer(mq), [idx]: e.target.value };
                                setAnswers((prev) => ({ ...prev, [q.id]: nextMap }));
                              }}
                              className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-2 focus:outline-[#39A900]"
                            >
                              <option value="">Selecciona correspondencia...</option>
                              {mq.pairs.map((optPair, oIdx) => (
                                <option key={oIdx} value={optPair.right}>
                                  {optPair.right}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Immediate explanation after submission */}
                {isSubmitted && (
                  <div
                    className={`p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                      correct
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100'
                        : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <div className="font-semibold mb-1">
                      {correct ? 'Respuesta correcta' : 'Retroalimentación normativa'}
                    </div>
                    {q.explanation}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Sticky right summary panel */}
        <aside className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 xl:sticky xl:top-24">
          <div className="space-y-1.5">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {activeQuiz.axis} · Aprobación ≥ {activeQuiz.passingScore}%
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {activeQuiz.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{activeQuiz.subtitle}</p>
          </div>

          {previousAttempt && (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Último resultado registrado
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {previousAttempt.score}%
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                  {previousAttempt.correctCount}/{previousAttempt.totalCount} aciertos ·{' '}
                  {previousAttempt.completedAt}
                </span>
              </div>
            </div>
          )}

          {isSubmitted ? (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {evaluationResult.score >= activeQuiz.passingScore ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
                )}
                <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  Puntaje: {evaluationResult.score}% ({evaluationResult.correctCount}/
                  {evaluationResult.totalCount})
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {evaluationResult.score >= activeQuiz.passingScore
                  ? 'Aprobaste este cuestionario. Tu calificación ya quedó sincronizada en el tablero de seguimiento de la ficha.'
                  : 'Aún no alcanzas el 70% requerido. Revisa la retroalimentación de cada pregunta e inténtalo nuevamente.'}
              </p>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reintentar cuestionario
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                Calificar y registrar intento
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                El resultado se guarda automáticamente en el perfil de seguimiento del aprendiz.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
