import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Compass,
  HeartHandshake,
  Layers,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MultimediaKind } from '../types/sena';

interface MultimediaPlayerProps {
  kind: MultimediaKind;
  title: string;
}

const SYMBOLS_HOTSPOTS = [
  {
    id: 'pinon',
    label: 'El Piñón (Rueda Dentada)',
    sector: 'Sector Industria y Manufactura',
    description:
      'Representa el desarrollo tecnológico, los procesos industriales, la mecánica, la electrónica y la transformación productiva de materias primas.',
    accent: '#39A900',
  },
  {
    id: 'caduceo',
    label: 'El Caduceo',
    sector: 'Sector Comercio y Servicios',
    description:
      'Simboliza la actividad comercial, administrativa, financiera, logística y de servicios que dinamizan la economía colombiana.',
    accent: '#0284C7',
  },
  {
    id: 'cafe',
    label: 'Los Ramos de Café',
    sector: 'Sector Primario y Agropecuario',
    description:
      'Representan la vocación agrícola, pecuaria y agroindustrial del país, emblema de trabajo rural sostenible y soberanía alimentaria.',
    accent: '#D97706',
  },
  {
    id: 'logosimbolo',
    label: 'El Logosímbolo (Hombre y Sendero)',
    sector: 'Identidad del Aprendiz SENA',
    description:
      'Muestra a una persona que avanza por un sendero hacia un horizonte abierto: simboliza al aprendiz construyendo su proyecto de vida mediante la formación integral.',
    accent: '#0F172A',
  },
  {
    id: 'bandera',
    label: 'La Bandera Blanca',
    sector: 'Paz y Transparencia',
    description:
      'El lienzo blanco con el escudo en el centro refleja la vocación de paz, equidad, gratuidad y transparencia en el servicio público educativo.',
    accent: '#475569',
  },
];

const HYMN_STANZAS = [
  {
    id: 'coro',
    heading: 'Coro Oficial',
    lines: [
      'Estudiantes del SENA adelante',
      'por Colombia luchad con amor',
      'con el ánimo noble y radiante',
      'transformémosla en mundo mejor.',
    ],
    durationMs: 7000,
  },
  {
    id: 'e1',
    heading: 'Estrofa I · Ciencia y Trabajo',
    lines: [
      'De la patria el futuro destino,',
      'en las manos del joven está,',
      'el trabajo es seguro camino',
      'que el progreso a Colombia dará.',
    ],
    durationMs: 7000,
  },
  {
    id: 'e2',
    heading: 'Estrofa II · Ciencia y Técnica',
    lines: [
      'En la forja del SENA se forman,',
      'hombres libres que anhelan triunfar,',
      'con la ciencia y la técnica unidas,',
      'nuevos rumbos de paz trazarán.',
    ],
    durationMs: 7000,
  },
  {
    id: 'e3',
    heading: 'Estrofa III · Hoy la Patria Reclama',
    lines: [
      'Hoy la patria nos grita sentida,',
      '¡estudiantes del SENA triunfad!',
      'solo así lograréis en la vida,',
      'más justicia, mayor libertad.',
    ],
    durationMs: 7000,
  },
];

const CAPSULE_CHAPTERS = [
  {
    id: 'cap-1',
    title: '01. Principios y 24 Derechos',
    subtitle: 'Garantías con enfoque diferencial e inclusión',
    caption:
      'El Acuerdo 009 de 2024 amplía a 24 los derechos del aprendiz en modalidades presencial, virtual, dual y a distancia: formación gratuita de calidad, trato digno sin discriminación, bienestar, evaluación objetiva y debido proceso.',
    article: 'Acuerdo 009 de 2024 · Capítulos I y II',
    keyTags: ['24 derechos', 'Enfoque diferencial', 'Multimodalidad'],
  },
  {
    id: 'cap-2',
    title: '02. Deberes y Novedades',
    subtitle: 'Compromiso formativo y trámites en SOFÍA Plus',
    caption:
      'Cumplir actividades y evidencias, portar visible el carné institucional, cuidar equipos y respetar la convivencia. Permite gestionar traslados, retiros voluntarios y aplazamientos hasta por 3 meses prorrogables por fuerza mayor.',
    article: 'Acuerdo 009 de 2024 · Capítulos III y IV',
    keyTags: ['Porte del carné', 'Aplazamiento 3 meses', 'Retiro voluntario'],
  },
  {
    id: 'cap-3',
    title: '03. Faltas, Medidas y Sanciones',
    subtitle: 'Clasificación vigente: faltas leves y graves',
    caption:
      'Las faltas se clasifican en leves (medidas formativas: llamados de atención y planes de mejoramiento) y graves como plagio, suplantación o agresión (condicionamiento o cancelación: inhabilidad de 6–12 meses académicas o 12–24 meses disciplinarias).',
    article: 'Acuerdo 009 de 2024 · Cap. III y V',
    keyTags: ['Leves y graves', 'Medidas formativas', 'Inhabilidad 6–24 meses'],
  },
  {
    id: 'cap-4',
    title: '04. Deserción y Comité (Art. 48)',
    subtitle: 'Debido proceso y actualización Acuerdo 002 de 2026',
    caption:
      'Tres días consecutivos injustificados o incumplir etapa productiva exigen indagación previa (inhabilidad de 6 meses si se declara deserción). El Acuerdo 002 de 2026 actualizó el Art. 48 precisando el análisis por Equipo Ejecutor y Comité de Evaluación y Seguimiento.',
    article: 'Acuerdo 009 de 2024 (Art. 30–31, 48) · Act. Acuerdo 002 de 2026',
    keyTags: ['Art. 30 Deserción', 'Art. 48 Comité', 'Acuerdo 002 de 2026'],
  },
];

const PORTE_SCENARIOS = {
  taller: {
    label: 'Taller Industrial / Mecatrónica',
    description: 'Ambiente con maquinaria, riesgo eléctrico o manipulación de herramientas.',
    requiredIds: ['carne', 'uniforme', 'epp', 'calzado'],
  },
  tic: {
    label: 'Ambiente TIC / Software',
    description: 'Laboratorio de cómputo, redes y desarrollo de aplicaciones.',
    requiredIds: ['carne', 'uniforme', 'calzado'],
  },
  evento: {
    label: 'Ceremonia o Visita Empresarial',
    description: 'Representación institucional externa o jornada formal en auditorio.',
    requiredIds: ['carne', 'uniforme', 'presentacion'],
  },
} as const;

const PORTE_ITEMS = [
  {
    id: 'carne',
    label: 'Carné institucional SENA visible',
    detail: 'Obligatorio en portería y dentro de cualquier ambiente.',
  },
  {
    id: 'uniforme',
    label: 'Uniforme o prenda institucional reglamentaria',
    detail: 'Limpio, sin alteraciones gráficas al logosímbolo SENA.',
  },
  {
    id: 'epp',
    label: 'Elementos de Protección Personal (EPP)',
    detail: 'Gafas de seguridad, protección auditiva o bata según ficha técnica.',
  },
  {
    id: 'calzado',
    label: 'Calzado cerrado antideslizante / dieléctrico',
    detail: 'Indispensable para prevenir lesiones en talleres y desplazamientos.',
  },
  {
    id: 'presentacion',
    label: 'Presentación personal sobria y acorde al evento',
    detail: 'Proyecta profesionalismo y respeto por la imagen SENA.',
  },
];

const PRODUCTIVE_ALTERNATIVES = [
  {
    id: 'contrato',
    title: 'Contrato de Aprendizaje',
    duration: '6 meses · 864 horas',
    support: 'Apoyo de sostenimiento mensual + EPS y ARL cubiertas por la empresa patrocinadora.',
    requirement: 'Gestión en SGVA, edad mínima 15 años (con autorización si es menor) y aval de coordinación.',
  },
  {
    id: 'laboral',
    title: 'Vínculo Laboral o Contractual',
    duration: '6 meses · 864 horas',
    support: 'Salario y prestaciones vigentes según contrato laboral o de prestación de servicios.',
    requirement: 'Funciones directamente afines al programa de formación y aval previo en SOFÍA Plus.',
  },
  {
    id: 'vinculo-formativo',
    title: 'Contrato de Vínculo Formativo o Pasantía',
    duration: '6 meses · 864 horas',
    support: 'Experiencia práctica en entidad estatal, ONG, empresa o unidad productiva familiar.',
    requirement: 'Carta de aceptación o convenio, afiliación ARL conforme al Acuerdo 009 de 2024 y bitácoras.',
  },
  {
    id: 'proyecto',
    title: 'Proyecto Productivo (I+D+i / SENA Emprende)',
    duration: '6 meses · 864 horas',
    support: 'Desarrollo de iniciativa empresarial, investigativa o de innovación con mentoría.',
    requirement: 'Anteproyecto aprobado por comité técnico y entregas quincenales de avance.',
  },
  {
    id: 'monitoria',
    title: 'Monitoría Institucional SENA',
    duration: 'Según convocatoria',
    support: 'Estímulo económico institucional por apoyar procesos formativos en el centro.',
    requirement: 'Desempeño académico sobresaliente y selección en convocatoria de Bienestar.',
  },
  {
    id: 'economia-popular',
    title: 'Prácticas en Economía Popular y/o Campesina',
    duration: '6 meses · 864 horas',
    support: 'Acompañamiento productivo a iniciativas comunitarias, populares, familiares o campesinas.',
    requirement: 'Modalidad reconocida en el Acuerdo 009 de 2024, aval del centro y bitácoras quincenales.',
  },
];

const BIENESTAR_ROUTES = [
  {
    id: 'apoyos',
    title: 'Apoyos de Sostenimiento',
    channel: 'Oficina de Bienestar al Aprendiz · Convocatoria Trimestral',
    summary:
      'Auxilios económicos regulares y de transporte dirigidos a aprendices en condiciones de vulnerabilidad socioeconómica con matrícula activa.',
    action: 'Verifica requisitos en cartelera de Bienestar y postúlate con tu documento y ficha.',
  },
  {
    id: 'psicosocial',
    title: 'Acompañamiento Psicosocial',
    channel: 'Profesional de Psicología del Centro',
    summary:
      'Orientación confidencial frente a estrés académico, manejo emocional, proyectos de vida y prevención de deserción temprana.',
    action: 'Solicita cita presencial o virtual a través del enlace de Bienestar o tu instructor líder.',
  },
  {
    id: 'enfermeria',
    title: 'Enfermería y Primeros Auxilios',
    channel: 'Punto de Salud del Centro de Formación',
    summary:
      'Atención primaria en sede, orientación en salud sexual y reproductiva, y activación de póliza de accidentes del aprendiz.',
    action: 'Reporta cualquier malestar o incidente de inmediato al instructor y acude a enfermería.',
  },
  {
    id: 'cultura',
    title: 'Deporte, Arte y Liderazgo',
    channel: 'Grupos Representativos y Vocería',
    summary:
      'Torneos deportivos, danza, música, robótica recreativa y escuelas de liderazgo para fortalecer las habilidades blandas.',
    action: 'Inscríbete en las jornadas de inducción o con los dinamizadores de cultura.',
  },
  {
    id: 'sst',
    title: 'Seguridad y Salud en el Trabajo (SST)',
    channel: 'Brigada de Emergencias del Centro',
    summary:
      'Señalización de rutas de evacuación, puntos de encuentro, uso de extintores y reporte de actos o condiciones inseguras.',
    action: 'Ubica la salida de emergencia y el punto de encuentro más cercano en cada bloque.',
  },
];

function speakSpanish(text: string, rate = 1) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-CO';
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function stopSpanish() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

export function MultimediaPlayer({ kind, title }: MultimediaPlayerProps) {
  const [symbolSubMode, setSymbolSubMode] = useState<'escudo' | 'himno'>('escudo');
  const [activeHotspotId, setActiveHotspotId] = useState<string>('pinon');
  const [shieldImageError, setShieldImageError] = useState<boolean>(false);

  const [hymnIndex, setHymnIndex] = useState(0);
  const [hymnPlaying, setHymnPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const [chapterIndex, setChapterIndex] = useState(0);
  const [capsulePlaying, setCapsulePlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25>(1);
  const [capsuleProgress, setCapsuleProgress] = useState(0);

  const [porteEnv, setPorteEnv] = useState<keyof typeof PORTE_SCENARIOS>('taller');
  const [selectedPorteItems, setSelectedPorteItems] = useState<string[]>(['carne', 'uniforme']);

  const [activeStage, setActiveStage] = useState<'lectiva' | 'productiva'>('productiva');
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string>('contrato');
  const [activePlatform, setActivePlatform] = useState<'sofia' | 'zajuna'>('sofia');

  const [selectedRouteId, setSelectedRouteId] = useState<string>('apoyos');

  const hymnTimerRef = useRef<number | null>(null);
  const capsuleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setHymnPlaying(false);
    setCapsulePlaying(false);
    stopSpanish();
  }, [kind]);

  useEffect(() => {
    if (!hymnPlaying) {
      if (hymnTimerRef.current) window.clearTimeout(hymnTimerRef.current);
      return;
    }

    const currentStanza = HYMN_STANZAS[hymnIndex];
    if (voiceEnabled) {
      speakSpanish(`${currentStanza.heading}. ${currentStanza.lines.join('. ')}`, 0.96);
    }

    hymnTimerRef.current = window.setTimeout(() => {
      if (hymnIndex < HYMN_STANZAS.length - 1) {
        setHymnIndex((prev) => prev + 1);
      } else {
        setHymnPlaying(false);
        setHymnIndex(0);
        stopSpanish();
      }
    }, currentStanza.durationMs);

    return () => {
      if (hymnTimerRef.current) window.clearTimeout(hymnTimerRef.current);
    };
  }, [hymnPlaying, hymnIndex, voiceEnabled]);

  useEffect(() => {
    if (!capsulePlaying) {
      if (capsuleTimerRef.current) window.clearInterval(capsuleTimerRef.current);
      return;
    }

    const currentChapter = CAPSULE_CHAPTERS[chapterIndex];
    if (voiceEnabled) {
      speakSpanish(`${currentChapter.title}. ${currentChapter.caption}`, playbackSpeed);
    }

    const stepMs = 150;
    const totalMs = Math.round(7500 / playbackSpeed);
    let elapsed = 0;
    setCapsuleProgress(0);

    capsuleTimerRef.current = window.setInterval(() => {
      elapsed += stepMs;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setCapsuleProgress(pct);
      if (elapsed >= totalMs) {
        if (chapterIndex < CAPSULE_CHAPTERS.length - 1) {
          setChapterIndex((prev) => prev + 1);
          elapsed = 0;
        } else {
          setCapsulePlaying(false);
          setCapsuleProgress(100);
          stopSpanish();
        }
      }
    }, stepMs);

    return () => {
      if (capsuleTimerRef.current) window.clearInterval(capsuleTimerRef.current);
    };
  }, [capsulePlaying, chapterIndex, playbackSpeed, voiceEnabled]);

  const activeHotspot =
    SYMBOLS_HOTSPOTS.find((h) => h.id === activeHotspotId) ?? SYMBOLS_HOTSPOTS[0];

  const togglePorteItem = (id: string) => {
    setSelectedPorteItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  if (kind === 'simbolos-interactivos') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Laboratorio Multimedia · Módulo 1
            </p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setSymbolSubMode('escudo');
                setHymnPlaying(false);
                stopSpanish();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                symbolSubMode === 'escudo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Escudo y Logosímbolo
            </button>
            <button
              type="button"
              onClick={() => setSymbolSubMode('himno')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                symbolSubMode === 'himno'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Himno del SENA
            </button>
          </div>
        </div>

        {symbolSubMode === 'escudo' ? (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col items-center">
              <svg
                viewBox="0 0 420 230"
                className="w-full max-w-[420px] h-auto"
                role="img"
                aria-label="Diagrama interactivo del Escudo y Logosímbolo del SENA"
              >
                <g
                  onClick={() => setActiveHotspotId('bandera')}
                  className="cursor-pointer transition-opacity"
                >
                  <rect
                    x="14"
                    y="16"
                    width="186"
                    height="198"
                    rx="12"
                    fill="#FFFFFF"
                    stroke={activeHotspotId === 'bandera' ? '#39A900' : '#CBD5E1'}
                    strokeWidth={activeHotspotId === 'bandera' ? '3' : '1.5'}
                  />
                  <text
                    x="107"
                    y="203"
                    textAnchor="middle"
                    className="fill-slate-500 text-[10px] font-medium"
                  >
                    Bandera Blanca (Paz)
                  </text>
                </g>

                {!shieldImageError ? (
                  <>
                    <foreignObject x="37" y="34" width="140" height="140">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src="https://www.sena.edu.co/assets/escudo-CKAC4aSg.png"
                          alt="Escudo oficial del SENA"
                          referrerPolicy="no-referrer"
                          onError={() => setShieldImageError(true)}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </foreignObject>

                    {/* Zonas interactivas transparentes sobre el escudo oficial */}
                    <g onClick={() => setActiveHotspotId('pinon')} className="cursor-pointer">
                      <circle
                        cx="107"
                        cy="104"
                        r="62"
                        fill="transparent"
                        stroke={activeHotspotId === 'pinon' ? '#39A900' : 'transparent'}
                        strokeWidth="3"
                        strokeDasharray="6 4"
                      />
                    </g>

                    <g onClick={() => setActiveHotspotId('cafe')} className="cursor-pointer">
                      <path
                        d="M54 136 C44 112, 46 82, 64 62"
                        fill="none"
                        stroke={activeHotspotId === 'cafe' ? '#D97706' : 'transparent'}
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M160 136 C170 112, 168 82, 150 62"
                        fill="none"
                        stroke={activeHotspotId === 'cafe' ? '#D97706' : 'transparent'}
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </g>

                    <g onClick={() => setActiveHotspotId('caduceo')} className="cursor-pointer">
                      <rect
                        x="86"
                        y="62"
                        width="42"
                        height="84"
                        rx="12"
                        fill="transparent"
                        stroke={activeHotspotId === 'caduceo' ? '#0284C7' : 'transparent'}
                        strokeWidth="2.5"
                      />
                    </g>
                  </>
                ) : (
                  <>
                    <g onClick={() => setActiveHotspotId('pinon')} className="cursor-pointer">
                      <circle
                        cx="107"
                        cy="104"
                        r="56"
                        fill={activeHotspotId === 'pinon' ? '#EEFCE6' : '#F8FAFC'}
                        stroke={activeHotspotId === 'pinon' ? '#39A900' : '#334155'}
                        strokeWidth={activeHotspotId === 'pinon' ? '4' : '2.5'}
                        strokeDasharray="10 6"
                      />
                      <circle
                        cx="107"
                        cy="104"
                        r="42"
                        fill="none"
                        stroke={activeHotspotId === 'pinon' ? '#39A900' : '#64748B'}
                        strokeWidth="2"
                      />
                    </g>

                    <g onClick={() => setActiveHotspotId('cafe')} className="cursor-pointer">
                      <path
                        d="M66 132 C54 110, 56 84, 72 68"
                        fill="none"
                        stroke={activeHotspotId === 'cafe' ? '#D97706' : '#39A900'}
                        strokeWidth={activeHotspotId === 'cafe' ? '4' : '2.5'}
                        strokeLinecap="round"
                      />
                      <circle cx="62" cy="112" r="4.5" fill={activeHotspotId === 'cafe' ? '#D97706' : '#DC2626'} />
                      <circle cx="60" cy="96" r="4.5" fill={activeHotspotId === 'cafe' ? '#D97706' : '#DC2626'} />
                      <circle cx="66" cy="81" r="4.5" fill={activeHotspotId === 'cafe' ? '#D97706' : '#DC2626'} />

                      <path
                        d="M148 132 C160 110, 158 84, 142 68"
                        fill="none"
                        stroke={activeHotspotId === 'cafe' ? '#D97706' : '#39A900'}
                        strokeWidth={activeHotspotId === 'cafe' ? '4' : '2.5'}
                        strokeLinecap="round"
                      />
                      <circle cx="152" cy="112" r="4.5" fill={activeHotspotId === 'cafe' ? '#D97706' : '#DC2626'} />
                      <circle cx="154" cy="96" r="4.5" fill={activeHotspotId === 'cafe' ? '#D97706' : '#DC2626'} />
                      <circle cx="148" cy="81" r="4.5" fill={activeHotspotId === 'cafe' ? '#D97706' : '#DC2626'} />
                    </g>

                    <g onClick={() => setActiveHotspotId('caduceo')} className="cursor-pointer">
                      <line
                        x1="107"
                        y1="72"
                        x2="107"
                        y2="136"
                        stroke={activeHotspotId === 'caduceo' ? '#0284C7' : '#0F172A'}
                        strokeWidth={activeHotspotId === 'caduceo' ? '4' : '3'}
                        strokeLinecap="round"
                      />
                      <path
                        d="M90 83 Q107 75 124 83"
                        fill="none"
                        stroke={activeHotspotId === 'caduceo' ? '#0284C7' : '#334155'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M96 95 Q118 103 96 115 Q118 124 98 132"
                        fill="none"
                        stroke={activeHotspotId === 'caduceo' ? '#0284C7' : '#475569'}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="107"
                        cy="70"
                        r="5"
                        fill={activeHotspotId === 'caduceo' ? '#0284C7' : '#0F172A'}
                      />
                    </g>
                  </>
                )}

                <g onClick={() => setActiveHotspotId('logosimbolo')} className="cursor-pointer">
                  <rect
                    x="220"
                    y="16"
                    width="186"
                    height="198"
                    rx="12"
                    fill={activeHotspotId === 'logosimbolo' ? '#F0FDF4' : '#FFFFFF'}
                    stroke={activeHotspotId === 'logosimbolo' ? '#39A900' : '#CBD5E1'}
                    strokeWidth={activeHotspotId === 'logosimbolo' ? '3' : '1.5'}
                  />
                  <text
                    x="313"
                    y="70"
                    textAnchor="middle"
                    className="fill-[#39A900] text-[22px] font-extrabold tracking-wide"
                  >
                    SENA
                  </text>
                  <circle cx="313" cy="95" r="10" fill="#39A900" />
                  <path
                    d="M270 156 L305 112 M356 156 L321 112 M288 164 L313 122 L338 164"
                    fill="none"
                    stroke="#39A900"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="313"
                    y="203"
                    textAnchor="middle"
                    className="fill-slate-500 text-[10px] font-medium"
                  >
                    Logosímbolo (Haz clic)
                  </text>
                </g>
              </svg>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                Haz clic sobre el piñón, el caduceo, los granos de café, la bandera o el logosímbolo para explorar su significado.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {SYMBOLS_HOTSPOTS.map((spot) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveHotspotId(spot.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                      activeHotspotId === spot.id
                        ? 'bg-[#39A900] text-white border-[#39A900]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {spot.label.split(' (')[0]}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-xs font-medium text-[#2C8200] dark:text-emerald-400">
                  {activeHotspot.sector}
                </p>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {activeHotspot.label}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-6 space-y-5 border border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-emerald-400 font-medium">
                    {HYMN_STANZAS[hymnIndex].heading}
                  </p>
                  <h4 className="text-lg font-semibold text-white mt-0.5">Himno Oficial del SENA</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (!next) stopSpanish();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                  {voiceEnabled ? 'Voz activa' : 'Activar voz'}
                </button>
              </div>

              <div className="py-4 space-y-2.5 min-h-[140px] flex flex-col justify-center">
                {HYMN_STANZAS[hymnIndex].lines.map((line, idx) => (
                  <p
                    key={idx}
                    className="text-lg sm:text-xl font-medium tracking-wide text-white leading-snug"
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="flex items-end gap-1.5 h-6" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-sm transition-all duration-200 ${
                      hymnPlaying ? 'bg-[#39A900]' : 'bg-slate-700'
                    }`}
                    style={{
                      height: hymnPlaying ? `${28 + ((i * 19 + hymnIndex * 11) % 72)}%` : '22%',
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (hymnPlaying) {
                        setHymnPlaying(false);
                        stopSpanish();
                      } else {
                        setHymnPlaying(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    {hymnPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {hymnPlaying ? 'Pausar lectura' : 'Reproducir estrofas'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopSpanish();
                      setHymnIndex((prev) => (prev + 1) % HYMN_STANZAS.length);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    Siguiente
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHymnPlaying(false);
                      setHymnIndex(0);
                      stopSpanish();
                    }}
                    aria-label="Reiniciar himno"
                    className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {hymnIndex + 1} / {HYMN_STANZAS.length}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Estructura del Himno
              </p>
              {HYMN_STANZAS.map((stanza, index) => (
                <button
                  key={stanza.id}
                  type="button"
                  onClick={() => {
                    stopSpanish();
                    setHymnIndex(index);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                    hymnIndex === index
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] text-slate-900 dark:text-slate-100'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-semibold">{stanza.heading}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {stanza.lines[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (kind === 'simulador-porte') {
    const scenario = PORTE_SCENARIOS[porteEnv];
    const missingRequired = scenario.requiredIds.filter((id) => !selectedPorteItems.includes(id));
    const isCompliant = missingRequired.length === 0;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Simulador Práctico · Módulo 2
            </p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            {(Object.keys(PORTE_SCENARIOS) as Array<keyof typeof PORTE_SCENARIOS>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPorteEnv(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  porteEnv === key
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {PORTE_SCENARIOS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">{scenario.description}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Selecciona los elementos de porte y seguridad que llevarías a este ambiente:
            </p>
            <div className="space-y-2">
              {PORTE_ITEMS.map((item) => {
                const checked = selectedPorteItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePorteItem(item.id)}
                    className={`w-full text-left p-3.5 rounded-lg border flex items-start gap-3 transition-colors cursor-pointer ${
                      checked
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-[#39A900]'
                        : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        checked
                          ? 'bg-[#39A900] border-[#39A900] text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {checked && <CheckCircle2 className="w-3 h-3" />}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.detail}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {isCompliant ? (
                  <ShieldCheck className="w-5 h-5 text-[#16A34A] dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#D97706] dark:text-amber-400" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    isCompliant
                      ? 'text-[#16A34A] dark:text-emerald-400'
                      : 'text-[#B45309] dark:text-amber-400'
                  }`}
                >
                  {isCompliant
                    ? 'Apto para ingreso al ambiente'
                    : `Faltan ${missingRequired.length} requisitos obligatorios`}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isCompliant
                  ? 'Cumples con el porte del carné institucional, imagen SENA y normas de seguridad para este ambiente.'
                  : 'Revisa los requerimientos faltantes para evitar restricciones de acceso o riesgos de seguridad industrial.'}
              </p>

              {!isCompliant && (
                <ul className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {missingRequired.map((reqId) => {
                    const found = PORTE_ITEMS.find((p) => p.id === reqId);
                    return (
                      <li
                        key={reqId}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400 shrink-0" />
                        <span>Falta: {found?.label}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Referencia: Acuerdo 009 de 2024 Cap. III (Deberes) · Normas SG-SST de centro.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'capsula-reglamento') {
    const chapter = CAPSULE_CHAPTERS[chapterIndex];
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Cápsula Audiovisual Interactiva · Módulo 3
            </p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.25 : 1))}
              className="px-2.5 py-1 text-xs font-mono font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              {playbackSpeed}x
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next) stopSpanish();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
            >
              {voiceEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#39A900]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              {voiceEnabled ? 'Narración ON' : 'Narración OFF'}
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-slate-900 dark:bg-slate-950 rounded-xl p-5 text-white flex flex-col justify-between min-h-[290px] border border-slate-800">
            <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
              <span>{chapter.article}</span>
              <span className="font-mono tabular-nums">
                Capítulo {chapterIndex + 1} de {CAPSULE_CHAPTERS.length}
              </span>
            </div>

            <div className="my-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 flex items-center justify-center">
                <svg viewBox="0 0 180 140" className="w-40 h-32">
                  <rect
                    x="10"
                    y="10"
                    width="160"
                    height="120"
                    rx="14"
                    fill="#1E293B"
                    stroke="#334155"
                  />
                  {chapterIndex === 0 && (
                    <g>
                      <circle
                        cx="90"
                        cy="56"
                        r="24"
                        fill="#39A900"
                        fillOpacity="0.2"
                        stroke="#39A900"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M79 56 L87 64 L103 48"
                        fill="none"
                        stroke="#4ADE80"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect x="44" y="92" width="92" height="10" rx="5" fill="#334155" />
                      <rect x="58" y="108" width="64" height="8" rx="4" fill="#475569" />
                    </g>
                  )}
                  {chapterIndex === 1 && (
                    <g>
                      <rect
                        x="52"
                        y="28"
                        width="76"
                        height="54"
                        rx="8"
                        fill="#0F172A"
                        stroke="#39A900"
                        strokeWidth="2"
                      />
                      <circle cx="72" cy="55" r="10" fill="#39A900" />
                      <rect x="90" y="47" width="28" height="5" rx="2.5" fill="#94A3B8" />
                      <rect x="90" y="58" width="20" height="5" rx="2.5" fill="#64748B" />
                      <text
                        x="90"
                        y="106"
                        textAnchor="middle"
                        className="fill-emerald-400 text-[10px] font-mono"
                      >
                        CARNÉ VISIBLE
                      </text>
                    </g>
                  )}
                  {chapterIndex === 2 && (
                    <g>
                      <polygon
                        points="90,26 128,92 52,92"
                        fill="#D97706"
                        fillOpacity="0.2"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                      />
                      <line
                        x1="90"
                        y1="48"
                        x2="90"
                        y2="70"
                        stroke="#FBBF24"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <circle cx="90" cy="80" r="2.5" fill="#FBBF24" />
                      <text
                        x="90"
                        y="112"
                        textAnchor="middle"
                        className="fill-amber-300 text-[10px] font-mono"
                      >
                        INTEGRIDAD SENA
                      </text>
                    </g>
                  )}
                  {chapterIndex === 3 && (
                    <g>
                      <circle cx="46" cy="64" r="10" fill="#39A900" />
                      <line x1="56" y1="64" x2="80" y2="64" stroke="#64748B" strokeWidth="2" />
                      <circle cx="90" cy="64" r="10" fill="#0284C7" />
                      <line x1="100" y1="64" x2="124" y2="64" stroke="#64748B" strokeWidth="2" />
                      <circle cx="134" cy="64" r="10" fill="#4ADE80" />
                      <text
                        x="90"
                        y="104"
                        textAnchor="middle"
                        className="fill-slate-300 text-[10px] font-mono"
                      >
                        DEBIDO PROCESO
                      </text>
                    </g>
                  )}
                </svg>
              </div>
              <div className="sm:col-span-7 space-y-2.5">
                <p className="text-xs text-emerald-400 font-medium">{chapter.subtitle}</p>
                <h4 className="text-xl font-bold text-white">{chapter.title}</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{chapter.caption}</p>
                <div className="text-xs text-slate-400 pt-1">{chapter.keyTags.join(' · ')}</div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#39A900] transition-all duration-150"
                  style={{ width: `${capsuleProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (capsulePlaying) {
                        setCapsulePlaying(false);
                        stopSpanish();
                      } else {
                        setCapsulePlaying(true);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#39A900] hover:bg-[#2C8200] text-white rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    {capsulePlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    {capsulePlaying ? 'Pausar cápsula' : 'Reproducir cápsula'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopSpanish();
                      setCapsuleProgress(0);
                      setChapterIndex((prev) => (prev + 1) % CAPSULE_CHAPTERS.length);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    Siguiente clave
                  </button>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {capsuleProgress}%
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Capítulos de la cápsula
            </p>
            {CAPSULE_CHAPTERS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  stopSpanish();
                  setCapsuleProgress(0);
                  setChapterIndex(idx);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                  chapterIndex === idx
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] text-slate-900 dark:text-slate-100'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-semibold">{item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'simulador-etapas') {
    const selectedAlt =
      PRODUCTIVE_ALTERNATIVES.find((a) => a.id === selectedAlternativeId) ??
      PRODUCTIVE_ALTERNATIVES[0];

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Simulador Curricular · Módulo 4
            </p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveStage('lectiva')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeStage === 'lectiva'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Etapa Lectiva
            </button>
            <button
              type="button"
              onClick={() => setActiveStage('productiva')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeStage === 'productiva'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Etapa Productiva (6 Alternativas)
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {activeStage === 'lectiva' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm">
                  <Layers className="w-4 h-4 text-[#39A900]" />
                  Aprendizaje por Proyectos y Competencias
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Durante la etapa lectiva desarrollas competencias técnicas y transversales bajo la guía de instructores, evaluadas mediante juicios de{' '}
                  <strong className="text-slate-900 dark:text-white">Aprobado (A)</strong> o{' '}
                  <strong className="text-slate-900 dark:text-white">
                    Por Evaluar / No Aprobado (D)
                  </strong>
                  .
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Ecosistema Digital
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActivePlatform('sofia')}
                      className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer ${
                        activePlatform === 'sofia'
                          ? 'bg-[#39A900] text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      SOFÍA Plus
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePlatform('zajuna')}
                      className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer ${
                        activePlatform === 'zajuna'
                          ? 'bg-[#39A900] text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      Zajuna LMS
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activePlatform === 'sofia'
                    ? 'SOFÍA Plus centraliza tu historial académico: matrícula, novedades (traslado, aplazamiento, retiro), consulta de juicios evaluativos y descarga de certificados.'
                    : 'Zajuna (LMS) es el aula virtual institucional: allí encuentras las guías de aprendizaje, material multimedia, foros colaborativos y enlaces de entrega de evidencias.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 space-y-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Explora las alternativas válidas:
                </p>
                {PRODUCTIVE_ALTERNATIVES.map((alt) => (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => setSelectedAlternativeId(alt.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedAlternativeId === alt.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] text-slate-900 dark:text-slate-100'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-sm font-medium">{alt.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {alt.duration}
                    </div>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-7 p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-[#2C8200] dark:text-emerald-400 font-medium">
                      Alternativa Seleccionada
                    </span>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {selectedAlt.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                    {selectedAlt.duration}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Cobertura y Apoyo
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mt-1">{selectedAlt.support}</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Requisito Institucional
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mt-1">
                      {selectedAlt.requirement}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <BookOpenCheck className="w-4 h-4 text-[#39A900] shrink-0" />
                    <span>Seguimiento obligatorio mediante bitácoras quincenales (GFPI-F-147).</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const selectedRoute =
    BIENESTAR_ROUTES.find((r) => r.id === selectedRouteId) ?? BIENESTAR_ROUTES[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Mapa Interactivo · Módulo 5
        </p>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-2">
          {BIENESTAR_ROUTES.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => setSelectedRouteId(route.id)}
              className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                selectedRouteId === route.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] text-slate-900 dark:text-slate-100'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="text-sm font-medium">{route.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {route.channel}
              </div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#2C8200] dark:text-emerald-400 text-xs font-medium">
              <HeartHandshake className="w-4 h-4" />
              <span>{selectedRoute.channel}</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {selectedRoute.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedRoute.summary}
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
              <Compass className="w-3.5 h-3.5 text-[#39A900]" />
              ¿Cómo activar esta ruta?
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{selectedRoute.action}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Award className="w-4 h-4 text-[#39A900] shrink-0" />
            <span>Todos los servicios de Bienestar al Aprendiz son gratuitos.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
