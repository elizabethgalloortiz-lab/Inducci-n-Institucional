export type AppView = 'inicio' | 'modulos' | 'cuestionarios' | 'seguimiento';

export type UserRole = 'aprendiz' | 'instructor';

export type ApprenticeStatus = 'completado' | 'en_progreso' | 'prioritario';

export type MultimediaKind =
  | 'simbolos-interactivos'
  | 'simulador-porte'
  | 'capsula-reglamento'
  | 'simulador-etapas'
  | 'ruta-bienestar';

export interface ModuleKeyPoint {
  title: string;
  reference: string;
  summary: string;
}

export interface ModuleCaseScenario {
  id: string;
  situation: string;
  question: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface InductionModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  axis: string;
  durationMinutes: number;
  normativeRef: string;
  imageUrl: string;
  imageAlt: string;
  multimediaKind: MultimediaKind;
  multimediaTitle: string;
  objectives: string[];
  keyPoints: ModuleKeyPoint[];
  caseScenario: ModuleCaseScenario;
  relatedQuizId: string;
}

export type QuestionType = 'single' | 'scenario' | 'order' | 'match';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  context?: string;
  normativeCitation: string;
  explanation: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single' | 'scenario';
  options: string[];
  correctIndex: number;
}

export interface OrderQuestion extends BaseQuestion {
  type: 'order';
  items: string[];
  correctOrder: number[];
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match';
  pairs: {
    left: string;
    right: string;
  }[];
}

export type QuizQuestion = SingleChoiceQuestion | OrderQuestion | MatchQuestion;

export interface QuizDefinition {
  id: string;
  title: string;
  subtitle: string;
  axis: string;
  estimatedMinutes: number;
  passingScore: number;
  isCertificationExam?: boolean;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  completedAt: string;
}

export interface ObservationNote {
  id: string;
  date: string;
  author: string;
  text: string;
  category: 'academico' | 'convivencia' | 'bienestar' | 'asistencia';
}

export interface ApprenticeRecord {
  id: string;
  fullName: string;
  documentId: string;
  email: string;
  fichaId: string;
  interestArea?: string;
  learningGoal?: string;
  completedModuleIds: string[];
  quizAttempts: Record<string, QuizAttempt>;
  inductionAttendance: boolean[]; // 5 induction sessions
  regulationSigned: boolean;
  observations: ObservationNote[];
  lastActivity: string;
}

export interface CohortInfo {
  fichaId: string;
  programName: string;
  level: 'Técnico' | 'Tecnólogo';
  centerName: string;
  instructorLead: string;
  startDate: string;
  modality: 'Presencial' | 'Virtual' | 'Mixta';
}
