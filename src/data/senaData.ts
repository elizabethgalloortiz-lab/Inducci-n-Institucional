import {
  ApprenticeRecord,
  ApprenticeStatus,
  CohortInfo,
  InductionModule,
  QuizDefinition,
} from '../types/sena';

export const SENA_IMAGES = {
  heroCampus: '/src/assets/images/hero_sena_campus_1794325208831.jpg',
  identidadSena: '/src/assets/images/module_identidad_sena_1794325207838.jpg',
  normativaReglamento: '/src/assets/images/module_normativa_reglamento_1794325208329.jpg',
  multimediaTaller: '/src/assets/images/module_multimedia_taller_1794325209400.jpg',
};

export const INDUCTION_SESSIONS = [
  'Día 1 · Bienvenida e Identidad SENA',
  'Día 2 · Imagen Institucional y Cultura',
  'Día 3 · Reglamento del Aprendiz',
  'Día 4 · Plataformas Sofía Plus y Zajuna',
  'Día 5 · Bienestar, SST y Compromiso',
];

export const LEAD_INSTRUCTOR = {
  id: 'inst-01',
  fullName: 'Ing. Carolina Restrepo Montoya',
  roleTitle: 'Instructora Líder Encargada de Inducción',
  email: 'crestrepo@sena.edu.co',
  center: 'Complejo de Formación e Innovación SENA',
};

export const INSTRUCTOR_GENERIC_CREDENTIALS = {
  username: 'instructor.sena',
  password: 'Sena2026*',
};

export const COHORTS: CohortInfo[] = [
  {
    fichaId: '2874190',
    programName: 'Análisis y Desarrollo de Software (ADSO)',
    level: 'Tecnólogo',
    centerName: 'Centro de Servicios y Gestión Empresarial',
    instructorLead: LEAD_INSTRUCTOR.fullName,
    startDate: '2026-11-02',
    modality: 'Presencial',
  },
  {
    fichaId: '2910455',
    programName: 'Gestión Administrativa y Talento Humano',
    level: 'Tecnólogo',
    centerName: 'Centro de Comercio y Servicios',
    instructorLead: LEAD_INSTRUCTOR.fullName,
    startDate: '2026-11-02',
    modality: 'Mixta',
  },
  {
    fichaId: '2938812',
    programName: 'Automatización y Mecatrónica Industrial',
    level: 'Técnico',
    centerName: 'Centro Metalmecánico y de Innovación',
    instructorLead: LEAD_INSTRUCTOR.fullName,
    startDate: '2026-11-04',
    modality: 'Presencial',
  },
];

export const INDUCTION_MODULES: InductionModule[] = [
  {
    id: 'mod-identidad',
    order: 1,
    title: 'Identidad, Historia y Símbolos del SENA',
    subtitle: 'Origen institucional, misión, visión y significado de los símbolos patrios del SENA.',
    axis: 'Identidad Institucional',
    durationMinutes: 20,
    normativeRef: 'Decreto Ley 118 de 1957 · Manual de Identidad',
    imageUrl: SENA_IMAGES.identidadSena,
    imageAlt: 'Ilustración de los sectores productivos representados en el SENA',
    multimediaKind: 'simbolos-interactivos',
    multimediaTitle: 'Explorador del Escudo, Logosímbolo e Himno del SENA',
    objectives: [
      'Reconocer la fundación del SENA en 1957 impulsada por Rodolfo Martínez Tono.',
      'Interpretar los tres sectores económicos presentes en el escudo: industria, comercio y agricultura.',
      'Identificar el significado del logosímbolo como el camino del aprendiz hacia el progreso.',
    ],
    keyPoints: [
      {
        title: 'Misión Institucional',
        reference: 'Ley 119 de 1994 · Art. 2',
        summary:
          'Cumplir la función que corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo formación profesional integral gratuita.',
      },
      {
        title: 'Visión de Futuro y Transformación',
        reference: 'Plan Estratégico SENA',
        summary:
          'Consolidarse como entidad referente de formación tecnológica, innovación, emprendimiento y pertinencia productiva en todo el territorio nacional.',
      },
      {
        title: 'Estructura del Escudo y la Bandera',
        reference: 'Manual de Símbolos',
        summary:
          'La bandera es de color blanco (paz y transparencia) con el escudo en el centro: el piñón representa la industria, el caduceo al comercio y servicios, y los ramos de café al sector primario.',
      },
    ],
    caseScenario: {
      id: 'case-identidad',
      situation:
        'Durante la jornada de bienvenida regional, tu equipo debe presentar el significado del logosímbolo y el escudo ante aprendices de primer ingreso.',
      question:
        '¿Qué representa exactamente la figura central del logosímbolo del SENA (el hombre estilizado en la intersección de las líneas)?',
      options: [
        {
          id: 'a',
          label: 'El camino horizontal de la formación técnica únicamente en el sector industrial.',
          isCorrect: false,
          feedback:
            'Incorrecto. El SENA integra los sectores agropecuario, industrial y de comercio/servicios.',
        },
        {
          id: 'b',
          label: 'Los enfoques de la formación y al aprendiz que asciende por un sendero hacia su proyecto de vida.',
          isCorrect: true,
          feedback:
            'Correcto. El logosímbolo refleja los tres sectores económicos y la proyección del aprendiz construyendo su camino profesional con autonomía y responsabilidad.',
        },
        {
          id: 'c',
          label: 'Un emblema decorativo exclusivo para certificados de etapa productiva.',
          isCorrect: false,
          feedback:
            'Incorrecto. Es el símbolo oficial permanente de toda la comunidad SENA.',
        },
      ],
    },
    relatedQuizId: 'quiz-identidad',
  },
  {
    id: 'mod-imagen',
    order: 2,
    title: 'Imagen Institucional, Porte y Cultura SENA',
    subtitle: 'Uso correcto de la marca, porte del carné, uniforme reglamentario y presentación en ambientes.',
    axis: 'Imagen y Cultura',
    durationMinutes: 15,
    normativeRef: 'Manual de Identidad Visual · Acuerdo 009 de 2024 Cap. III',
    imageUrl: SENA_IMAGES.multimediaTaller,
    imageAlt: 'Aprendices SENA portando uniforme y carné institucional en laboratorio técnico',
    multimediaKind: 'simulador-porte',
    multimediaTitle: 'Simulador Interactivo de Porte e Imagen por Ambiente',
    objectives: [
      'Aplicar las pautas de uso del color institucional Verde SENA (#39A900) y respeto por la marca.',
      'Comprender la obligatoriedad del porte visible del carné como documento de identidad e ingreso.',
      'Diferenciar los requerimientos de vestuario y Elementos de Protección Personal (EPP) según el ambiente.',
    ],
    keyPoints: [
      {
        title: 'Porte Permanente del Carné',
        reference: 'Acuerdo 009 de 2024 · Cap. III (Deberes)',
        summary:
          'El carné institucional es personal e intransferible. Debe portarse en un lugar visible al ingresar y permanecer en las sedes y centros de formación.',
      },
      {
        title: 'Uso del Uniforme y Seguridad (SST)',
        reference: 'Normas de Ambiente y Taller',
        summary:
          'En laboratorios, talleres y prácticas técnicas, el uniforme y los EPP (gafas, botas dieléctricas o bata según especialidad) previenen accidentes laborales y fortalecen la imagen profesional.',
      },
      {
        title: 'Cuidado de la Marca SENA',
        reference: 'Manual de Imagen Corporativa',
        summary:
          'No se permite alterar proporciones, colores ni combinar el logosímbolo con mensajes ajenos a los valores institucionales o proselitismo.',
      },
    ],
    caseScenario: {
      id: 'case-imagen',
      situation:
        'Un compañero olvida su carné físico y te pide que registres tu carné dos veces en el torniquete o le prestes el tuyo para entrar rápido al bloque de sistemas.',
      question: 'De acuerdo con la normativa institucional, ¿cuál es la acción correcta?',
      options: [
        {
          id: 'a',
          label: 'Prestarle el carné brevemente mientras pasa el control de portería.',
          isCorrect: false,
          feedback:
            'Incorrecto. Prestar o facilitar el carné constituye suplantación o uso indebido de documento institucional, tipificado como falta disciplinaria.',
        },
        {
          id: 'b',
          label: 'Indicarle que reporte el olvido en portería/coordinación con su documento de identidad para ingreso temporal.',
          isCorrect: true,
          feedback:
            'Correcto. El carné es personal e intransferible; el ingreso sin carné debe gestionarse por los canales de control autorizados del centro.',
        },
        {
          id: 'c',
          label: 'Permitirle el ingreso por la salida de emergencia para evitar retrasos.',
          isCorrect: false,
          feedback:
            'Incorrecto. Evadir los controles de acceso vulnera los protocolos de seguridad física del centro.',
        },
      ],
    },
    relatedQuizId: 'quiz-identidad',
  },
  {
    id: 'mod-normativa',
    order: 3,
    title: 'Normativa y Reglamento del Aprendiz',
    subtitle:
      'Acuerdo 009 de 2024 (act. Acuerdo 002 de 2026): derechos, deberes, prohibiciones, faltas, deserción y debido proceso.',
    axis: 'Normativa Institucional',
    durationMinutes: 25,
    normativeRef: 'Acuerdo 009 de 2024 · Act. Acuerdo 002 de 2026 (Art. 48)',
    imageUrl: SENA_IMAGES.normativaReglamento,
    imageAlt: 'Aprendices estudiando el Reglamento del Aprendiz en la biblioteca del centro',
    multimediaKind: 'capsula-reglamento',
    multimediaTitle: 'Cápsula Audiovisual Animada: Acuerdo 009 de 2024 en 4 Claves',
    objectives: [
      'Distinguir los 24 derechos del aprendiz (con enfoque diferencial e inclusión) frente a sus deberes y prohibiciones.',
      'Diferenciar las faltas académicas y disciplinarias (leves y graves), las medidas formativas y los rangos de inhabilidad.',
      'Conocer el Debido Proceso, el rol del Equipo Ejecutor y el Comité de Evaluación y Seguimiento (Art. 48 · Acuerdo 002 de 2026).',
    ],
    keyPoints: [
      {
        title: 'Derechos, Deberes y Prohibiciones',
        reference: 'Acuerdo 009 de 2024 · Cap. II y III',
        summary:
          'Amplía a 24 los derechos (enfoque diferencial, pluralista y modalidades presencial, virtual, dual y a distancia) e integra en el Capítulo III deberes y prohibiciones de convivencia e integridad académica.',
      },
      {
        title: 'Inasistencia y Deserción',
        reference: 'Acuerdo 009 de 2024 · Cap. VII (Art. 30–31)',
        summary:
          'Se configura por 3 días consecutivos de inasistencia injustificada, incumplir la planeación de etapa productiva o no reincorporarse tras aplazamiento. Exige indagación previa; acarrea cancelación e inhabilidad de 6 meses.',
      },
      {
        title: 'Faltas, Sanciones y Comité (Art. 48)',
        reference: 'Acuerdo 009 de 2024 · Act. Acuerdo 002 de 2026',
        summary:
          'Clasifica faltas en leves (medidas formativas) y graves (condicionamiento o cancelación con inhabilidad de 6–12 meses académicas o 12–24 meses disciplinarias). El Acuerdo 002 de 2026 actualizó el Art. 48 sobre Equipo Ejecutor y Comité.',
      },
    ],
    caseScenario: {
      id: 'case-normativa',
      situation:
        'Un aprendiz falta durante 3 días consecutivos sin presentar incapacidad ni comunicarse por los canales institucionales con el equipo ejecutor del programa.',
      question:
        'Según el Capítulo VII (Art. 30 y 31) del Acuerdo 009 de 2024, ¿qué procedimiento debe seguirse?',
      options: [
        {
          id: 'a',
          label: 'Se declara deserción y se cancela su matrícula automáticamente ese mismo día sin notificación.',
          isCorrect: false,
          feedback:
            'Incorrecto. El Acuerdo 009 de 2024 prohíbe declarar la deserción de forma automática sin agotar el debido proceso y la indagación previa.',
        },
        {
          id: 'b',
          label: 'El equipo ejecutor reporta la novedad e indaga por los canales institucionales para que el aprendiz justifique su ausencia antes de declarar deserción.',
          isCorrect: true,
          feedback:
            'Correcto. Debe adelantarse indagación y verificación con derecho a justificar antes de declarar deserción; si procede, conlleva cancelación de matrícula e inhabilidad de 6 meses en formación titulada.',
        },
        {
          id: 'c',
          label: 'Solo se le resta un 10% en la siguiente evaluación escrita.',
          isCorrect: false,
          feedback:
            'Incorrecto. La inasistencia injustificada por 3 días consecutivos está tipificada en el Art. 30 como causal de verificación de deserción, no como descuento de nota.',
        },
      ],
    },
    relatedQuizId: 'quiz-reglamento',
  },
  {
    id: 'mod-formacion',
    order: 4,
    title: 'Formación Profesional Integral y Plataformas',
    subtitle: 'Estructura curricular por competencias, etapa lectiva, etapa productiva, Sofía Plus y Zajuna.',
    axis: 'Ruta Formativa',
    durationMinutes: 20,
    normativeRef: 'Acuerdo 009 de 2024 · Estatuto de Formación Profesional',
    imageUrl: SENA_IMAGES.heroCampus,
    imageAlt: 'Aprendices en ambiente de formación práctica y digital',
    multimediaKind: 'simulador-etapas',
    multimediaTitle: 'Simulador de Etapa Productiva y Guía de Plataformas',
    objectives: [
      'Comprender el modelo de Formación Profesional Integral basado en competencias y proyectos.',
      'Comparar las 6 principales alternativas vigentes de Etapa Productiva en el Acuerdo 009 de 2024.',
      'Diferenciar el uso de Sofía Plus (gestión académica) y Zajuna (ambiente virtual de aprendizaje).',
    ],
    keyPoints: [
      {
        title: 'Etapa Lectiva vs. Etapa Productiva',
        reference: 'Acuerdo 009 de 2024 · Etapa Productiva',
        summary:
          'En etapa lectiva adquieres competencias en el centro; en etapa productiva aplicas lo aprendido en entorno real durante 6 meses (864 horas aprox., edad mínima 15 años) con bitácoras quincenales.',
      },
      {
        title: 'Alternativas de Etapa Productiva',
        reference: 'Acuerdo 009 de 2024',
        summary:
          'Contrato de aprendizaje, vínculo laboral, contrato de vínculo formativo o pasantía, proyecto productivo (I+D+i), monitoría institucional y prácticas en economía popular y/o campesina.',
      },
      {
        title: 'Sofía Plus y Zajuna (LMS)',
        reference: 'Ecosistema Digital SENA',
        summary:
          'Sofía Plus gestiona matrícula, novedades, juicios evaluativos y certificados; Zajuna aloja guías, foros, evidencias y calificaciones diarias.',
      },
    ],
    caseScenario: {
      id: 'case-formacion',
      situation:
        'Estás terminando tu etapa lectiva y una empresa del sector te ofrece vinculación mediante contrato laboral con funciones directamente relacionadas con tu programa.',
      question: '¿Puede validarse ese vínculo laboral como tu Etapa Productiva?',
      options: [
        {
          id: 'a',
          label: 'No, únicamente sirve el Contrato de Aprendizaje SENA.',
          isCorrect: false,
          feedback:
            'Incorrecto. Aunque el contrato de aprendizaje es la vía más común, el vínculo laboral afín al programa es una alternativa válida prevista en el reglamento.',
        },
        {
          id: 'b',
          label: 'Sí, previa solicitud de aval ante Coordinación Académica demostrando afinidad de funciones y cumpliendo el seguimiento con bitácoras.',
          isCorrect: true,
          feedback:
            'Correcto. Requiere aval previo de coordinación y entrega periódica de bitácoras y evaluaciones parcial/final.',
        },
        {
          id: 'c',
          label: 'Sí, sin necesidad de informar al SENA ni entregar bitácoras.',
          isCorrect: false,
          feedback:
            'Incorrecto. Toda etapa productiva requiere registro en Sofía Plus, instructor de seguimiento y bitácoras aprobadas.',
        },
      ],
    },
    relatedQuizId: 'quiz-etapas',
  },
  {
    id: 'mod-bienestar',
    order: 5,
    title: 'Bienestar al Aprendiz, Convivencia y SST',
    subtitle: 'Servicios de permanencia, apoyos socioeconómicos, salud, cultura y seguridad en el centro.',
    axis: 'Bienestar y Seguridad',
    durationMinutes: 15,
    normativeRef: 'Resolución Bienestar al Aprendiz · SG-SST',
    imageUrl: SENA_IMAGES.multimediaTaller,
    imageAlt: 'Aprendices participando en actividades seguras de formación integral',
    multimediaKind: 'ruta-bienestar',
    multimediaTitle: 'Mapa Interactivo de Rutas de Atención y Bienestar SENA',
    objectives: [
      'Identificar los programas de apoyo de sostenimiento, monitorías, transporte y alimentación disponibles.',
      'Conocer las rutas de atención psicológica, enfermería y promoción de la salud mental.',
      'Aplicar normas básicas de Seguridad y Salud en el Trabajo (SST) y evacuación en el centro.',
    ],
    keyPoints: [
      {
        title: 'Permanencia y Apoyos Socioeconómicos',
        reference: 'Plan Nacional de Bienestar',
        summary:
          'Convocatorias periódicas de apoyos de sostenimiento, monitorías remuneradas y auxilios para aprendices en situación de vulnerabilidad con buen desempeño.',
      },
      {
        title: 'Salud Integral y Acompañamiento Psicosocial',
        reference: 'Ruta de Atención al Aprendiz',
        summary:
          'Cada centro cuenta con profesionales de enfermería, psicología y capellanía/cultura para prevenir la deserción y atender emergencias.',
      },
      {
        title: 'Cultura de Prevención (SG-SST)',
        reference: 'Normas Internas de Seguridad',
        summary:
          'Identifica rutas de evacuación, puntos de encuentro, brigadistas y reporta todo incidente o condición insegura en el ambiente de formación.',
      },
    ],
    caseScenario: {
      id: 'case-bienestar',
      situation:
        'Un aprendiz atraviesa una dificultad económica severa que amenaza su continuidad en el programa de formación.',
      question: '¿Cuál es la ruta institucional recomendada antes de pensar en retirarse?',
      options: [
        {
          id: 'a',
          label: 'Dejar de asistir sin avisar mientras resuelve su situación.',
          isCorrect: false,
          feedback:
            'Incorrecto. Dejar de asistir genera causal de deserción y sanción temporal para nuevas inscripciones.',
        },
        {
          id: 'b',
          label: 'Acudir a Bienestar al Aprendiz y al instructor líder para postularse a apoyos de sostenimiento o gestionar un aplazamiento formal si es necesario.',
          isCorrect: true,
          feedback:
            'Correcto. Bienestar ofrece orientación, apoyos de sostenimiento y acompañamiento para preservar la permanencia o tramitar aplazamiento sin penalidad.',
        },
        {
          id: 'c',
          label: 'Solicitar únicamente cambio de horario por redes sociales.',
          isCorrect: false,
          feedback:
            'Incorrecto. Los trámites y apoyos deben gestionarse formalmente mediante Bienestar y Sofía Plus.',
        },
      ],
    },
    relatedQuizId: 'quiz-integral',
  },
];

export const QUIZZES: QuizDefinition[] = [
  {
    id: 'quiz-identidad',
    title: 'Cuestionario 1 · Identidad e Imagen Institucional',
    subtitle: 'Evalúa tu dominio sobre la historia, símbolos patrios, logosímbolo y porte SENA.',
    axis: 'Identidad e Imagen',
    estimatedMinutes: 6,
    passingScore: 70,
    questions: [
      {
        id: 'qi-1',
        type: 'single',
        prompt: '¿En qué año fue fundado el SENA y quién fue su principal impulsor?',
        normativeCitation: 'Decreto Ley 118 de 1957 · Historia Institucional',
        options: [
          '1957, impulsado por Rodolfo Martínez Tono',
          '1964, impulsado por la OIT exclusivamente',
          '1994, mediante la Ley General de Educación',
          '1948, como escuela técnica departamental',
        ],
        correctIndex: 0,
        explanation:
          'El SENA nació el 21 de junio de 1957 bajo el liderazgo de Rodolfo Martínez Tono, con la misión de brindar formación técnica gratuita a los trabajadores colombianos.',
      },
      {
        id: 'qi-2',
        type: 'match',
        prompt: 'Relaciona cada elemento del Escudo del SENA con el sector económico que simboliza:',
        normativeCitation: 'Manual de Símbolos e Identidad Institucional',
        pairs: [
          { left: 'El Piñón (rueda dentada)', right: 'Sector Industria y Manufactura' },
          { left: 'El Caduceo', right: 'Sector Comercio y Servicios' },
          { left: 'Los Ramos de Café', right: 'Sector Primario y Agropecuario' },
        ],
        explanation:
          'Los tres elementos del escudo sintetizan los sectores productivos que atiende el SENA en todo el país.',
      },
      {
        id: 'qi-3',
        type: 'single',
        prompt: '¿Qué color predomina en la bandera oficial del SENA y qué simboliza?',
        normativeCitation: 'Manual de Identidad Visual SENA',
        options: [
          'Verde sólido, en referencia exclusiva al sector agrícola',
          'Blanco con el escudo en el centro, simbolizando paz, tranquilidad y transparencia',
          'Azul oscuro con franjas doradas',
          'Tricolor nacional con el logosímbolo en la esquina',
        ],
        correctIndex: 1,
        explanation:
          'La bandera del SENA es de color blanco con el escudo institucional ubicado en el centro, representando paz, libertad y transparencia en la formación.',
      },
      {
        id: 'qi-4',
        type: 'scenario',
        context: 'Escenario de Imagen y Porte en Ambiente de Taller',
        prompt:
          'Ingresas a un taller de automatización industrial. ¿Cuál combinación cumple correctamente las normas de imagen y seguridad institucional?',
        normativeCitation: 'Acuerdo 009 de 2024 Cap. III · Normas SG-SST',
        options: [
          'Camiseta particular sin carné para evitar que se enrede, y tenis de tela.',
          'Uniforme reglamentario limpio, carné visible en portacarné seguro y Elementos de Protección Personal (EPP) asignados.',
          'Bata abierta sobre sudadera deportiva y sin gafas protectoras porque es solo observación.',
          'Carné guardado en el bolsillo y gorra de marca comercial dentro del laboratorio.',
        ],
        correctIndex: 1,
        explanation:
          'El porte visible del carné, el uniforme propio de la especialidad y los EPP son obligatorios para proyectar imagen profesional y proteger la integridad física.',
      },
      {
        id: 'qi-5',
        type: 'single',
        prompt: '¿Qué expresa el coro del Himno del SENA?',
        normativeCitation: 'Cultura e Identidad SENA',
        options: [
          'La invitación a los aprendices a marchar adelante por Colombia con esfuerzo, saber y trabajo',
          'Una reseña exclusiva sobre las normas de evaluación en plataforma',
          'Los requisitos legales del contrato de aprendizaje',
          'La lista de centros de formación por regional',
        ],
        correctIndex: 0,
        explanation:
          'El himno exalta el compromiso de los estudiantes del SENA con la ciencia, el trabajo digno, la solidaridad y el desarrollo de Colombia.',
      },
    ],
  },
  {
    id: 'quiz-reglamento',
    title: 'Cuestionario 2 · Normativa y Reglamento del Aprendiz',
    subtitle:
      'Casos vigentes según el Acuerdo 009 de 2024 y su actualización Acuerdo 002 de 2026.',
    axis: 'Normativa y Reglamento',
    estimatedMinutes: 9,
    passingScore: 70,
    questions: [
      {
        id: 'qr-1',
        type: 'scenario',
        context: 'Situación Académica en Plataforma Zajuna',
        prompt:
          'Un aprendiz entrega como propio un proyecto descargado de internet sin citar fuentes ni autoría. ¿Cómo clasifica el Acuerdo 009 de 2024 esta conducta?',
        normativeCitation: 'Acuerdo 009 de 2024 · Cap. III (Prohibiciones: Plagio y Fraude)',
        options: [
          'No tiene sanción si el código funciona correctamente.',
          'Constituye una falta académica y disciplinaria grave por fraude o plagio académico, sujeta a debido proceso.',
          'Solo requiere repetir la portada del documento.',
          'Se resuelve únicamente con un llamado de atención verbal sin registro.',
        ],
        correctIndex: 1,
        explanation:
          'El Acuerdo 009 de 2024 clasifica las faltas en leves y graves; el plagio, la falsificación y el fraude comprometen gravemente la ética formativa y activan seguimiento formal.',
      },
      {
        id: 'qr-2',
        type: 'order',
        prompt:
          'Ordena cronológicamente los 4 pasos del Debido Proceso ante una presunta falta grave (Art. 48 · Act. Acuerdo 002 de 2026):',
        normativeCitation: 'Acuerdo 009 de 2024 · Art. 48 (Act. Acuerdo 002 de 2026)',
        items: [
          'Notificación formal al aprendiz e inicio del derecho de defensa / descargos',
          'Informe o reporte motivado del hecho por parte del instructor o integrante de la comunidad',
          'Análisis por el Equipo Ejecutor y sesión del Comité de Evaluación y Seguimiento para documentar y recomendar medida',
          'Acto administrativo motivado del Subdirector de Centro con posibilidad de recurso de reposición',
        ],
        correctOrder: [1, 0, 2, 3],
        explanation:
          'Conforme al Art. 48 (actualizado por el Acuerdo 002 de 2026), tras el reporte motivado y la notificación para descargos, el Equipo Ejecutor y el Comité de Evaluación y Seguimiento analizan y documentan la falta para que el Subdirector decida con garantía de recurso.',
      },
      {
        id: 'qr-3',
        type: 'single',
        prompt:
          'Según el Artículo 30 del Acuerdo 009 de 2024, ¿cuántos días consecutivos de inasistencia injustificada configuran causal de verificación de deserción y qué inhabilidad acarrea?',
        normativeCitation: 'Acuerdo 009 de 2024 · Cap. VII, Art. 30 y 31 (Deserción)',
        options: [
          '1 día de inasistencia sin inhabilidad posterior',
          '3 días consecutivos injustificados; previo debido proceso genera cancelación e inhabilidad de 6 meses para titulada',
          '15 días calendario acumulados con inhabilidad de 36 meses',
          '30 días hábiles sin ingresar a SOFÍA Plus',
        ],
        correctIndex: 1,
        explanation:
          'El Art. 30 contempla 3 días consecutivos de inasistencia injustificada (además de incumplir etapa productiva o no reincorporarse tras aplazamiento); previo requerimiento, conlleva cancelación e inhabilidad de 6 meses en programas titulados.',
      },
      {
        id: 'qr-4',
        type: 'single',
        prompt: '¿Cuál de los siguientes corresponde a un DERECHO vigente del aprendiz SENA?',
        normativeCitation: 'Acuerdo 009 de 2024 · Capítulo II (24 Derechos del Aprendiz)',
        options: [
          'Elegir libremente no presentar evidencias si ya domina el tema.',
          'Recibir formación integral gratuita con enfoque diferencial, trato digno, evaluación objetiva oportuna y acceso a bienestar.',
          'Autorizar el ingreso de personas externas sin registro a los talleres.',
          'Modificar sus notas directamente en SOFÍA Plus.',
        ],
        correctIndex: 1,
        explanation:
          'El Capítulo II del Acuerdo 009 de 2024 amplió a 24 los derechos del aprendiz, incorporando enfoque diferencial, pluralista y garantías para modalidades presencial, virtual, dual y a distancia.',
      },
      {
        id: 'qr-5',
        type: 'single',
        prompt:
          '¿Qué novedad debe solicitar un aprendiz que por fuerza mayor comprobada necesita pausar su formación temporalmente?',
        normativeCitation: 'Acuerdo 009 de 2024 · Capítulo IV (Novedades Académicas)',
        options: [
          'Deserción voluntaria inmediata',
          'Aplazamiento temporal (hasta por 3 meses prorrogables por incapacidad superior a 20 días, maternidad, calamidad o servicio militar)',
          'Cambio automático de centro sin autorización',
          'Suspensión verbal con el vocero de ficha',
        ],
        correctIndex: 1,
        explanation:
          'El Capítulo IV regula el aplazamiento formal por fuerza mayor hasta por 3 meses prorrogables, conservando la condición de aprendiz para luego gestionar el reintegro.',
      },
      {
        id: 'qr-6',
        type: 'single',
        prompt:
          'Cuando se impone sanción de cancelación de matrícula por falta grave en el Acuerdo 009 de 2024, ¿cuáles son los rangos vigentes de inhabilidad?',
        normativeCitation: 'Acuerdo 009 de 2024 · Cap. V (Régimen Sancionatorio)',
        options: [
          'Únicamente 1 mes para cualquier tipo de falta',
          'De 6 a 12 meses para faltas académicas y de 12 a 24 meses para faltas disciplinarias',
          'Inhabilidad vitalicia e irrevocable en el SENA',
          'No existe periodo de inhabilidad tras cancelar la matrícula',
        ],
        correctIndex: 1,
        explanation:
          'El Acuerdo 009 de 2024 fija una inhabilidad temporal de 6 a 12 meses cuando la cancelación obedece a faltas académicas y de 12 a 24 meses por faltas disciplinarias graves.',
      },
    ],
  },
  {
    id: 'quiz-etapas',
    title: 'Cuestionario 3 · Etapas Formativas, Plataformas y Bienestar',
    subtitle: 'Comprueba tu conocimiento sobre etapa productiva, Sofía Plus, Zajuna y apoyos.',
    axis: 'Formación y Bienestar',
    estimatedMinutes: 6,
    passingScore: 70,
    questions: [
      {
        id: 'qe-1',
        type: 'match',
        prompt: 'Empareja cada plataforma o instancia SENA con su función principal:',
        normativeCitation: 'Guía Tecnológica del Aprendiz SENA',
        pairs: [
          { left: 'SOFÍA Plus', right: 'Registro académico, novedades, juicios evaluativos y certificados' },
          { left: 'Zajuna (LMS)', right: 'Ambiente virtual de aprendizaje, guías, foros y envío de evidencias' },
          { left: 'Bienestar al Aprendiz', right: 'Apoyos de sostenimiento, acompañamiento psicosocial y permanencia' },
        ],
        explanation:
          'Sofía Plus es el sistema de gestión académico-administrativa y Zajuna es el ecosistema LMS donde transcurre la interacción pedagógica virtual.',
      },
      {
        id: 'qe-2',
        type: 'single',
        prompt: 'Durante la Etapa Productiva, ¿con qué periodicidad obligatoria debe entregar el aprendiz sus bitácoras de seguimiento?',
        normativeCitation: 'Gestión de Etapa Productiva · Bitácora GFPI-F-147',
        options: [
          'Una sola vez al finalizar los 6 meses',
          'De forma quincenal (cada 15 días), sumando 12 bitácoras en promedio durante los 6 meses',
          'Únicamente cuando la empresa lo solicite por correo',
          'Cada semestre en formato libre sin firma',
        ],
        correctIndex: 1,
        explanation:
          'El seguimiento de etapa productiva requiere entrega quincenal de bitácoras avaladas por el jefe inmediato y el instructor de seguimiento.',
      },
      {
        id: 'qe-3',
        type: 'single',
        prompt:
          '¿Cuál NO es una alternativa válida de Etapa Productiva en el Acuerdo 009 de 2024?',
        normativeCitation: 'Acuerdo 009 de 2024 · Alternativas Etapa Productiva',
        options: [
          'Contrato de aprendizaje o contrato de vínculo formativo',
          'Vinculación laboral o prácticas en economía popular y/o campesina',
          'Proyecto productivo (I+D+i) o monitoría institucional',
          'Presentar un examen teórico adicional para eximir las 864 horas prácticas',
        ],
        correctIndex: 3,
        explanation:
          'El Acuerdo 009 de 2024 reconoce contrato de aprendizaje, vínculo laboral, vínculo formativo/pasantía, proyecto productivo, monitoría y economía popular/campesina; la etapa productiva nunca se reemplaza por un examen teórico.',
      },
      {
        id: 'qe-4',
        type: 'single',
        prompt: '¿Qué es un Plan de Mejoramiento Académico?',
        normativeCitation: 'Acuerdo 009 de 2024 · Cap. V (Medidas Formativas)',
        options: [
          'Una sanción definitiva que cancela la matrícula',
          'Una medida formativa pedagógica concertada con el instructor para superar resultados de aprendizaje aún no aprobados',
          'Un permiso para no asistir a formación durante un mes',
          'Un requisito exclusivo para los voceros de ficha',
        ],
        correctIndex: 1,
        explanation:
          'En el Acuerdo 009 de 2024, el plan de mejoramiento es una medida formativa preventiva con actividades y plazos concertados para alcanzar los resultados de aprendizaje pendientes.',
      },
    ],
  },
  {
    id: 'quiz-integral',
    title: 'Evaluación Final · Certificación de Inducción SENA',
    subtitle: 'Reto integral que consolida identidad, imagen, reglamento, formación y bienestar.',
    axis: 'Certificación Global',
    estimatedMinutes: 10,
    passingScore: 70,
    isCertificationExam: true,
    questions: [
      {
        id: 'qint-1',
        type: 'single',
        prompt: '¿Cuál es el valor fundamental de la Formación Profesional Integral impartida por el SENA?',
        normativeCitation: 'Estatuto de Formación Profesional Integral',
        options: [
          'Es totalmente gratuita y articula el saber, el saber hacer y el saber ser',
          'Se enfoca exclusivamente en teoría magistral sin práctica productiva',
          'Tiene costo semestral según el estrato del aprendiz',
          'Solo certifica programas virtuales de corta duración',
        ],
        correctIndex: 0,
        explanation:
          'El SENA ofrece formación gratuita orientada al desarrollo integral (competencias técnicas, cognitivas y socioemocionales para la vida y el trabajo).',
      },
      {
        id: 'qint-2',
        type: 'single',
        prompt: 'Si un aprendiz decide retirarse definitivamente de su formación sin quedar sancionado para futuras inscripciones, debe tramitar:',
        normativeCitation: 'Acuerdo 009 de 2024 · Cap. IV (Retiro Voluntario)',
        options: [
          'Dejar de asistir hasta completar 10 faltas',
          'Solicitud formal de Retiro Voluntario en SOFÍA Plus con visto bueno de coordinación',
          'Vender su cupo a otro aspirante',
          'Eliminar su cuenta de correo @soy.sena.edu.co',
        ],
        correctIndex: 1,
        explanation:
          'El retiro voluntario tramitado formalmente deja constancia limpia en el historial, mientras que la deserción injustificada acarrea inhabilidad de 6 meses en titulada.',
      },
      {
        id: 'qint-3',
        type: 'scenario',
        context: 'Convivencia y Respeto en Ambientes Digitales',
        prompt:
          'En un foro de Zajuna, un aprendiz publica comentarios ofensivos contra un compañero por su opinión técnica. ¿Qué principio y norma aplica?',
        normativeCitation: 'Acuerdo 009 de 2024 · Cap. III (Deberes y Prohibiciones)',
        options: [
          'Los foros virtuales no están cubiertos por el Reglamento del Aprendiz.',
          'Aplica el Acuerdo 009 de 2024: el respeto mutuo y la convivencia son obligatorios en modalidades presencial, virtual, dual y a distancia.',
          'Solo aplica si hay una queja ante la policía nacional.',
          'Se permite siempre que el comentario sea en horario nocturno.',
        ],
        correctIndex: 1,
        explanation:
          'El Acuerdo 009 de 2024 rige en todas las modalidades y ambientes (presenciales y virtuales); las faltas al respeto son objeto de medidas formativas o disciplinarias.',
      },
      {
        id: 'qint-4',
        type: 'single',
        prompt: '¿Qué representan las tres líneas que convergen hacia el centro en el logosímbolo del SENA?',
        normativeCitation: 'Identidad Institucional SENA',
        options: [
          'Las tres regiones geográficas más grandes del país',
          'La articulación de los sectores económicos y el camino de crecimiento integral del aprendiz',
          'Los tres horarios de formación (mañana, tarde y noche)',
          'Las tres notas mínimas de aprobación',
        ],
        correctIndex: 1,
        explanation:
          'Simboliza la convergencia de la industria, el comercio y el agro junto con el aprendiz avanzando hacia su realización personal y profesional.',
      },
      {
        id: 'qint-5',
        type: 'order',
        prompt: 'Ordena la ruta correcta para iniciar y culminar exitosamente tu formación titulada:',
        normativeCitation: 'Ruta de Formación SENA',
        items: [
          'Aprobación de Etapa Lectiva (todos los resultados de aprendizaje)',
          'Inducción institucional, firma de compromiso y apropiación del Reglamento',
          'Certificación y graduación como Técnico o Tecnólogo SENA',
          'Desarrollo y evaluación satisfactoria de Etapa Productiva con bitácoras',
        ],
        correctOrder: [1, 0, 3, 2],
        explanation:
          'El ciclo inicia en la Inducción, continúa con la Etapa Lectiva, avanza hacia la Etapa Productiva y culmina con la Certificación.',
      },
      {
        id: 'qint-6',
        type: 'single',
        prompt: '¿Quién representa a los aprendices de cada ficha ante instructores y coordinación académica?',
        normativeCitation: 'Acuerdo 009 de 2024 · Cap. II y VIII (Representación y Vocería)',
        options: [
          'El Vocero de Ficha elegido democráticamente durante o después de la inducción',
          'Únicamente el aprendiz con mejor calificación en matemáticas',
          'El vigilante de la sede principal',
          'Un funcionario externo del Ministerio del Trabajo',
        ],
        correctIndex: 0,
        explanation:
          'Cada ficha elige un Vocero (y suplente) quien actúa como canal de comunicación constructiva entre el grupo, los instructores y Bienestar.',
      },
    ],
  },
];

export const INITIAL_APPRENTICES: ApprenticeRecord[] = [
  {
    id: 'apr-01',
    fullName: 'Laura Sofía Martínez Quintero',
    documentId: '1036942180',
    email: 'lsmartinez80@soy.sena.edu.co',
    fichaId: '2874190',
    completedModuleIds: ['mod-identidad', 'mod-imagen', 'mod-normativa'],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 90,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-08',
      },
      'quiz-reglamento': {
        quizId: 'quiz-reglamento',
        score: 80,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-09',
      },
    },
    inductionAttendance: [true, true, true, true, false],
    regulationSigned: true,
    observations: [
      {
        id: 'obs-1',
        date: '2026-11-08',
        author: 'Ing. Carolina Restrepo',
        text: 'Participación destacada en el taller de interpretación del escudo y reglamento.',
        category: 'academico',
      },
    ],
    lastActivity: '2026-11-09',
  },
  {
    id: 'apr-02',
    fullName: 'Juan David Valencia Ríos',
    documentId: '1001458923',
    email: 'jdvalencia23@soy.sena.edu.co',
    fichaId: '2874190',
    completedModuleIds: [
      'mod-identidad',
      'mod-imagen',
      'mod-normativa',
      'mod-formacion',
      'mod-bienestar',
    ],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 100,
        correctCount: 5,
        totalCount: 5,
        completedAt: '2026-11-07',
      },
      'quiz-reglamento': {
        quizId: 'quiz-reglamento',
        score: 100,
        correctCount: 5,
        totalCount: 5,
        completedAt: '2026-11-08',
      },
      'quiz-etapas': {
        quizId: 'quiz-etapas',
        score: 75,
        correctCount: 3,
        totalCount: 4,
        completedAt: '2026-11-09',
      },
      'quiz-integral': {
        quizId: 'quiz-integral',
        score: 83,
        correctCount: 5,
        totalCount: 6,
        completedAt: '2026-11-09',
      },
    },
    inductionAttendance: [true, true, true, true, true],
    regulationSigned: true,
    observations: [
      {
        id: 'obs-2',
        date: '2026-11-09',
        author: 'Ing. Carolina Restrepo',
        text: 'Postulado como candidato a Vocero de Ficha ADSO 2874190.',
        category: 'convivencia',
      },
    ],
    lastActivity: '2026-11-09',
  },
  {
    id: 'apr-03',
    fullName: 'Mateo Andrés Córdoba Ospina',
    documentId: '1020874512',
    email: 'macordoba12@soy.sena.edu.co',
    fichaId: '2874190',
    completedModuleIds: ['mod-identidad'],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 60,
        correctCount: 3,
        totalCount: 5,
        completedAt: '2026-11-06',
      },
    },
    inductionAttendance: [true, false, false, false, false],
    regulationSigned: false,
    observations: [
      {
        id: 'obs-3',
        date: '2026-11-08',
        author: 'Ing. Carolina Restrepo',
        text: 'Dos inasistencias seguidas en jornadas de inducción. Se remite contacto a Bienestar al Aprendiz.',
        category: 'asistencia',
      },
    ],
    lastActivity: '2026-11-06',
  },
  {
    id: 'apr-04',
    fullName: 'Valentina Gómez Henao',
    documentId: '1017293044',
    email: 'vgomez44@soy.sena.edu.co',
    fichaId: '2874190',
    completedModuleIds: ['mod-identidad', 'mod-imagen', 'mod-normativa', 'mod-formacion'],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 80,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-08',
      },
      'quiz-reglamento': {
        quizId: 'quiz-reglamento',
        score: 80,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-09',
      },
    },
    inductionAttendance: [true, true, true, true, false],
    regulationSigned: true,
    observations: [],
    lastActivity: '2026-11-09',
  },
  {
    id: 'apr-05',
    fullName: 'Santiago Bermúdez Salazar',
    documentId: '1040732198',
    email: 'sbermudez98@soy.sena.edu.co',
    fichaId: '2874190',
    completedModuleIds: ['mod-identidad', 'mod-imagen'],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 80,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-08',
      },
    },
    inductionAttendance: [true, true, true, false, false],
    regulationSigned: false,
    observations: [
      {
        id: 'obs-4',
        date: '2026-11-09',
        author: 'Bienestar al Aprendiz',
        text: 'Pendiente firma digital de compromiso del Reglamento del Aprendiz.',
        category: 'convivencia',
      },
    ],
    lastActivity: '2026-11-08',
  },
  {
    id: 'apr-06',
    fullName: 'Camila Andrea Torres Lozano',
    documentId: '1022498115',
    email: 'catorres15@soy.sena.edu.co',
    fichaId: '2910455',
    completedModuleIds: [
      'mod-identidad',
      'mod-imagen',
      'mod-normativa',
      'mod-formacion',
      'mod-bienestar',
    ],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 100,
        correctCount: 5,
        totalCount: 5,
        completedAt: '2026-11-07',
      },
      'quiz-reglamento': {
        quizId: 'quiz-reglamento',
        score: 80,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-08',
      },
      'quiz-integral': {
        quizId: 'quiz-integral',
        score: 100,
        correctCount: 6,
        totalCount: 6,
        completedAt: '2026-11-09',
      },
    },
    inductionAttendance: [true, true, true, true, true],
    regulationSigned: true,
    observations: [],
    lastActivity: '2026-11-09',
  },
  {
    id: 'apr-07',
    fullName: 'Daniel Esteban Rojas Mejía',
    documentId: '1032887410',
    email: 'derojas10@soy.sena.edu.co',
    fichaId: '2910455',
    completedModuleIds: ['mod-identidad', 'mod-imagen', 'mod-normativa'],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 80,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-07',
      },
    },
    inductionAttendance: [true, true, true, false, false],
    regulationSigned: true,
    observations: [],
    lastActivity: '2026-11-08',
  },
  {
    id: 'apr-08',
    fullName: 'Nicolás Herrera Cárdenas',
    documentId: '1019004567',
    email: 'nherrera67@soy.sena.edu.co',
    fichaId: '2938812',
    completedModuleIds: ['mod-identidad', 'mod-imagen', 'mod-normativa', 'mod-formacion'],
    quizAttempts: {
      'quiz-identidad': {
        quizId: 'quiz-identidad',
        score: 80,
        correctCount: 4,
        totalCount: 5,
        completedAt: '2026-11-08',
      },
      'quiz-reglamento': {
        quizId: 'quiz-reglamento',
        score: 100,
        correctCount: 5,
        totalCount: 5,
        completedAt: '2026-11-09',
      },
    },
    inductionAttendance: [true, true, true, true, false],
    regulationSigned: true,
    observations: [
      {
        id: 'obs-5',
        date: '2026-11-09',
        author: 'Ing. Diego Pardo',
        text: 'Cumple cabalmente con EPP y porte del carné en taller de mecatrónica.',
        category: 'academico',
      },
    ],
    lastActivity: '2026-11-09',
  },
  {
    id: 'apr-09',
    fullName: 'Mariana Castro Muñoz',
    documentId: '1053821094',
    email: 'mcastro94@soy.sena.edu.co',
    fichaId: '2938812',
    completedModuleIds: [],
    quizAttempts: {},
    inductionAttendance: [true, false, false, false, false],
    regulationSigned: false,
    observations: [
      {
        id: 'obs-6',
        date: '2026-11-08',
        author: 'Ing. Diego Pardo',
        text: 'Reportó dificultad de conectividad en jornada mixta; requiere apoyo de acceso en centro.',
        category: 'bienestar',
      },
    ],
    lastActivity: '2026-11-05',
  },
];

export function computeApprenticeStatus(apprentice: ApprenticeRecord): ApprenticeStatus {
  const attendanceCount = apprentice.inductionAttendance.filter(Boolean).length;
  const moduleCount = apprentice.completedModuleIds.length;
  const attempts = Object.values(apprentice.quizAttempts);
  const avgScore =
    attempts.length > 0
      ? attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length
      : 0;

  const hasCertified =
    Boolean(apprentice.quizAttempts['quiz-integral']?.score >= 70) &&
    moduleCount === INDUCTION_MODULES.length &&
    apprentice.regulationSigned;

  if (hasCertified || (moduleCount === INDUCTION_MODULES.length && avgScore >= 75)) {
    return 'completado';
  }
  if (attendanceCount <= 1 && moduleCount <= 1) {
    return 'prioritario';
  }
  return 'en_progreso';
}

export function getApprenticeAverageScore(apprentice: ApprenticeRecord): number | null {
  const attempts = Object.values(apprentice.quizAttempts);
  if (attempts.length === 0) return null;
  const sum = attempts.reduce((acc, a) => acc + a.score, 0);
  return Math.round(sum / attempts.length);
}

export function getApprenticeModulePercent(apprentice: ApprenticeRecord): number {
  return Math.round((apprentice.completedModuleIds.length / INDUCTION_MODULES.length) * 100);
}
