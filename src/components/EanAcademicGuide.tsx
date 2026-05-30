import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Copy,
  ChevronRight,
  TrendingUp,
  Table,
  Cpu,
  Bookmark,
  Share2,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Plus,
  Trash,
  Settings,
  Lightbulb,
  FileCheck2,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EanAcademicGuideProps {
  projectName: string;
  sector: string;
  overallMaturityScore: number;
  overallTargetScore: number;
  gapScore: number;
}

export default function EanAcademicGuide({
  projectName,
  sector,
  overallMaturityScore,
  overallTargetScore,
  gapScore,
}: EanAcademicGuideProps) {
  const [activeSubTab, setActiveSubTab] = useState<"cultura" | "matriz" | "propuesta" | "swot" | "redactor">("cultura");
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string>("r1");

  // Form states specifically for student EAN activities (saves locally in localStorage automatically)
  const [cultureDescription, setCultureDescription] = useState(() => {
    return localStorage.getItem("ean_culture_desc") || 
      "La organización cuenta con una cultura predominantemente orientada a procesos (jerárquica/operaciones), donde el conocimiento táctico de los operarios senior se transmite de manera verbal. Existe cierto recelo sobre compartir prompts eficientes o flujos de IA por temor al desplazamiento laboral, lo que genera silos y fragmentación del saber.";
  });

  const [selectedCompanyModel, setSelectedCompanyModel] = useState(() => {
    return localStorage.getItem("ean_company_model") || "Modelo Empírico Basado en Tareas";
  });

  const [selectedTheoreticalReference, setSelectedTheoreticalReference] = useState(() => {
    return localStorage.getItem("ean_theoretical_ref") || "Modelo SECI (Nonaka & Takeuchi)";
  });

  const [improvementDraft, setImprovementDraft] = useState(() => {
    return localStorage.getItem("ean_improvement_draft") || 
      "Nuestra propuesta se enfoca en institucionalizar el Modelo SECI mediante herramientas de IA Generativa. Se implementará una base de datos vectorial unificada (Vector DB) que almacene los embeddings del conocimiento regulatorio e interno de la organización (Interiorización). Asimismo, crearemos un canal interactivo de retroalimentación donde comités humanos (expertos) corrijan y retroalimenten las inconsistencias del robot mediante aprendizaje de refuerzo RLHF (Exteriorización/Socialización).";
  });

  const [rolloutRecommendations, setRolloutRecommendations] = useState(() => {
    return localStorage.getItem("ean_rollout_recs") || 
      "1. Conformar de manera inmediata un comité interdisciplinario de Gestión del Conocimiento e Inteligencia Artificial.\n2. Diseñar un plan piloto de 30 días en el área de servicio al cliente para registrar prompts de alto impacto.\n3. Implementar un taller introductorio de Prompt Engineering para romper el recelo laboral y fomentar la co-creación.\n4. Auditar mensualmente el porcentaje de alucinaciones y el uso efectivo del repositorio vectorial centralizado.";
  });

  const [academicConclusions, setAcademicConclusions] = useState(() => {
    return localStorage.getItem("ean_conclusions") || 
      "La realización de esta auditoría sistémica demuestra que los agentes de IA no sustituyen la sabiduría humana; por el contrario, exigen una infraestructura estructurada de Gestión del Conocimiento para ser veraces. El contraste de modelos teóricos (SECI, Wiig, Anderson) permite identificar que la mayor brecha radica en formalizar el tránsito de conocimiento táctico a explícito indexable por la IA corporativa.";
  });

  const [customBibliography, setCustomBibliography] = useState(() => {
    return localStorage.getItem("ean_bibliography") || 
      "Nonaka, I., & Takeuchi, H. (1995). The knowledge-creating company: How Japanese companies create the dynamics of innovation. Oxford University Press.\nWiig, K. M. (1993). Knowledge Management Foundations: Thinking about thinking - how people and organizations create, represent, and use knowledge. Schema Press.\nAndersen, A. (1999). Metodología de Auditoría y Flujo de Gestión del Conocimiento Organizacional. Arthur Andersen Corp.\nUniversidad EAN. (2026). Modelos de gestión del conocimiento: Objeto de Aprendizaje Guía 3.";
  });

  // Local storage auto backup
  const handleSaveData = (key: string, val: string, setter: (v: string) => void) => {
    setter(val);
    localStorage.setItem(key, val);
  };

  // Theoretical models database for the matrix contrast
  const THEORETICAL_MODELS = [
    {
      name: "Modelo SECI (Nonaka & Takeuchi)",
      focus: "Transformación dinámica continua entre Conocimiento Tácito y Explícito (Socialización, Exteriorización, Combinación, Interiorización).",
      tacit_explicit: "Tránsito fluido. Valora la experiencia personal del empleado para inyectarla en manuales corporativos estructurados.",
      tech_support: "Comunidades colaborativas, wikis avanzadas y bases de vectores alimentadas por prompts refinados por expertos de negocio.",
      ean_advantage: "Muy útil para entrenar Agentes de IA a partir del conocimiento pragmático de ingenieros seniors mediante RLHF (Reinforcement Learning).",
    },
    {
      name: "Modelo de Arthur Andersen",
      focus: "Flujo bidireccional acelerado del conocimiento desde el individuo hacia la base común de la organización para agregar valor económico.",
      tacit_explicit: "Altamente explícito. Exige registrar de forma sistemática el saber de cada transacción para alimentar la memoria corporativa.",
      tech_support: "Bases documentales, repositorios de embeddings cifrados y motores de búsqueda semántica de alta escalabilidad.",
      ean_advantage: "Permite consolidar un costo total por consulta optimizado y optimizar el Retorno de Inversión (ROI) de la Inteligencia Artificial.",
    },
    {
      name: "Modelo de Karl Wiig (Cognitivo)",
      focus: "Enfoque cognitivo absoluto. Evalúa la calidad, utilidad conceptual del conocimiento y la toma de decisiones basada en niveles de veracidad.",
      tacit_explicit: "Balanceado. El conocimiento debe organizarse en taxonomías conceptuales rigurosas para que sea factible su aplicación inmediata.",
      tech_support: "Model Cards, bases gráficas de relación conceptual, ontologías computacionales y bases de datos vectoriales jerarquizadas.",
      ean_advantage: "Garantiza un control estricto de alucinaciones algorítmicas mediante una categorización minuciosa de las fuentes documentales indexadas.",
    }
  ];

  // Dynamic contrast logic
  const matrixComparison = useMemo(() => {
    return THEORETICAL_MODELS;
  }, []);

  // Opportunities computed from current simulator state
  const computedOpportunities = useMemo(() => {
    const list = [];
    if (overallMaturityScore < 40) {
      list.push({
        id: "opp_1",
        title: "Estructurar directrices y manuales base",
        desc: "El bajo nivel de madurez actual exige formalizar y documentar el prompt del sistema y mapear las fuentes de datos para mitigar la improvisación cognitiva.",
      });
    } else {
      list.push({
        id: "opp_1",
        title: "Institucionalizar bucle RLHF",
        desc: "Establecer comités semanales para curar las respuestas fallidas de la IA y reentrenar semánticamente la base de embeddings de la empresa.",
      });
    }

    if (gapScore > 20) {
      list.push({
        id: "opp_2",
        title: "Cerrar la brecha táctica-explícita",
        desc: "Dado el alto gap estratégico, urge migrar el conocimiento empírico de redactores y administradores hacia plantillas de prompts corporativos parametrizados.",
      });
    }

    list.push({
      id: "opp_3",
      title: "Consolidar Base Vectorial Segura (Vector DB)",
      desc: "Migrar carpetas cloud desorganizadas hacia un repositorio vectorial segmentado con control de accesos e inyección dinámica para controlar el Copyright.",
    });

    return list;
  }, [overallMaturityScore, gapScore]);

  // SWOT Matrix derived from overall scores
  const swotMatrix = useMemo(() => {
    const weaknesses: string[] = [];
    const strengths: string[] = [];
    const opportunities: string[] = [];
    const threats: string[] = [];

    // 1. Debilidades (Weaknesses - Internal & Negative)
    if (overallMaturityScore < 40) {
      weaknesses.push(
        "Falta severa de procesos formales documentados para guiar el uso de herramientas de conocimiento e IA.",
        "Dependencia crítica de conocimiento tácito inestructurado (silos en operarios senior sin registrar).",
        "Bajo nivel de alfabetización digital y recelo sobre el rol del trabajo frente a la automatización de tareas cognitivas."
      );
    } else if (overallMaturityScore < 65) {
      weaknesses.push(
        "Manuales de buenas prácticas digitales dispersos y sin estandarizar de manera corporativa.",
        "Gobernanza de conocimiento fragmentada entre diferentes áreas de negocio.",
        "Pocas métricas estructuradas para auditar la precisión cognitiva (alucinaciones) de las bases de consulta."
      );
    } else {
      weaknesses.push(
        "Elevado costo temporal en la curación continua de bases de datos de embeddings corporativos.",
        "Complejidad de escala para sostener la sincronía del conocimiento tácito recolectado de la operación.",
        "Necesidad latente de supervisión humana constante para auditar decisiones automatizadas complejas."
      );
    }

    // 2. Oportunidades (Opportunities - External & Positive)
    opportunities.push(
      "Sinergia EAN: integrar los lineamientos académicos de la guía de intervención universitaria para restructurar el flujo SECI.",
      "Reducción directa de tiempos muertos adoptando bases vectoriales (Vector DB) y búsqueda semántica.",
      "Capacitación de personal en ingeniería de prompts para convertir saberes tradicionales en instructivos explícitos.",
      "Estandarización sectorial mediante la adopción temprana de metodologías de auditoría de conocimiento organizacionales."
    );

    // 3. Fortalezas (Strengths - Internal & Positive)
    if (overallMaturityScore >= 55) {
      strengths.push(
        `Infraestructura de madurez adecuada (${overallMaturityScore}% score global) que facilita la ingesta de tecnología.`,
        "Existencia de repositorios digitales base y canales de comunicación interdepartamentales estables.",
        "Liderazgo ágil con interés deliberado en el retorno económico del conocimiento compartido (enfoque Arthur Andersen)."
      );
    } else {
      strengths.push(
        "Aceptación al cambio de los estudiantes e interventores para liderar la adopción técnica.",
        "Flexibilidad estructural para remodelar y reescribir flujos de trabajo sin arrastrar legados restrictivos.",
        "Existencia de conocimiento táctico de alta valía en los equipos de trabajo, listo para ser exteriorizado."
      );
    }
    strengths.push("Disponibilidad de metodologías de medición y autodiagnóstico en tiempo real gracias a este simulador.");

    // 4. Amenazas (Threats - External & Negative)
    if (gapScore > 15) {
      threats.push(
        `Amplia brecha de competitividad organizada (con un -${gapScore}% de Gap estratégico) frente a firmas que ya automatizan con pipelines SECI maduros.`,
        "Pérdida de conocimiento experto por jubilación o rotación laboral antes de que sus saberes sean documentados mediante Inteligencia Artificial."
      );
    } else {
      threats.push(
        "Rápida evolución de las tecnologías que puede dejar obsoletos los prompts de sistema fijados inicialmente."
      );
    }
    threats.push(
      "Riesgos normativos extranjeros y domésticos referentes a la soberanía de los datos, derechos de propiedad intelectual y cumplimiento ético.",
      "Resistencia pasiva o desconfianza de los clientes finales si perciben respuestas despersonalizadas de la organización."
    );

    return { strengths, weaknesses, opportunities, threats };
  }, [overallMaturityScore, gapScore]);

  // Dynamic risks dataset calculated from real assessment scores (Probability vs Impact)
  const risksData = useMemo(() => {
    const r1_prob = Math.max(15, Math.min(95, 100 - overallMaturityScore * 1.1));
    const r1_imp = Math.max(40, Math.min(95, 45 + gapScore * 1.5));

    const r2_prob = Math.max(20, Math.min(95, 95 - overallMaturityScore * 0.9));
    const r2_imp = Math.max(60, Math.min(95, 75 + gapScore * 0.8));

    const r3_prob = Math.max(15, Math.min(90, 90 - overallMaturityScore * 0.8));
    const r3_imp = Math.max(30, Math.min(90, 50 + gapScore * 1.2));

    const r4_prob = Math.max(25, Math.min(95, 110 - overallMaturityScore));
    const r4_imp = Math.max(50, Math.min(95, 60 + gapScore));

    const getClassification = (prob: number, imp: number) => {
      const avg = (prob + imp) / 2;
      if (avg >= 70) return { label: "Catastrófico / Crítico", color: "bg-red-500 text-white", text: "text-red-650 font-black", border: "border-red-200" };
      if (avg >= 45) return { label: "Moderado / Alto", color: "bg-amber-500 text-white", text: "text-amber-655 font-black", border: "border-amber-200" };
      return { label: "Bajo / Controlable", color: "bg-emerald-500 text-white", text: "text-emerald-655 font-black", border: "border-emerald-200" };
    };

    return [
      {
        id: "r1",
        name: "Riesgo de Fuga Intelectual y Alucinaciones de Seguridad",
        prob: Math.round(r1_prob),
        imp: Math.round(r1_imp),
        cat: "Seguridad y Ciberseguridad",
        classInfo: getClassification(r1_prob, r1_imp),
        description: "Alucinaciones cognitivas donde la IA inventa respuestas erráticas derivadas de silos de conocimiento inestructurados, o filtración involuntaria de información patentada e industrial sensible en APIs comerciales.",
        action: "Fijar firewalls de prompts, anonimizar los aportes manuales, implementar APIs de IA con contratos locales de no-entrenamiento y capacitar a la fuerza laboral en prompts corporativos auditados.",
      },
      {
        id: "r2",
        name: "Incumplimiento Regulatorio y Privacidad por Embeddings Expuestos",
        prob: Math.round(r2_prob),
        imp: Math.round(r2_imp),
        cat: "Privacidad y Cumplimiento de Datos",
        classInfo: getClassification(r2_prob, r2_imp),
        description: "Almacenamiento inadecuado de datos sensibles en la base vectorial (Vector DB). Empleados sin autorización podrían ver información restringida como salarios, historias médicas o datos fiscales.",
        action: "Imponer control de acceso basado en roles (RBAC) a nivel de metadatos en la base de vectores, implementar filtros automáticos de PII (Personally Identifiable Information) y encriptar embeddings.",
      },
      {
        id: "r3",
        name: "Sesgo Algorítmico y Discriminación en la Destilación del Saber",
        prob: Math.round(r3_prob),
        imp: Math.round(r3_imp),
        cat: "Sesgo Cognitivo & Equidad",
        classInfo: getClassification(r3_prob, r3_imp),
        description: "La IA genera patrones de respuesta con sesgos raciales, de género o comerciales debidos a un corpus desbalanceado, o produce alucinaciones semánticas que son tomadas como decisiones empresariales verdaderas.",
        action: "Establecer un comité supervisor tripartito para auditar los corpora de embeddings, calibrar continuamente los sesgos mediante RLHF humano y medir respuestas en pruebas de tolerancia cognitiva.",
      },
      {
        id: "r4",
        name: "Silos y Cripticismo por Resistencia Cultural o Pérdida de Conocimiento",
        prob: Math.round(r4_prob),
        imp: Math.round(r4_imp),
        cat: "Soberanía Cultural",
        classInfo: getClassification(r4_prob, r4_imp),
        description: "Pérdida de la sabiduría tradicional senior por rotación o por resistencia laboral. Los expertos temen ser reemplazados por la IA, guardando de forma recelosa e individual los secretos de prompts exitosos.",
        action: "Diseñar esquemas de gamificación para premiar a los colaboradores que carguen y documenten flujos de trabajo eficientes, e institucionalizar talleres colaborativos SECI.",
      }
    ];
  }, [overallMaturityScore, gapScore]);

  // Copy full academic report draft to clipboard (Point 1.17 template helper!)
  const handleCopyDraft = () => {
    const textToCopy = `=========================================================
INFORME ACADÉMICO DE GESTIÓN DEL CONOCIMIENTO Y AUDITORÍA DE IA
UNIVERSIDAD EAN - GUÍA DE TRABAJO EN EL PROYECTO DE INTERVENCIÓN
=========================================================

PROYECTO EVALUADO: ${projectName}
SECTOR INDUSTRIAL: ${sector}
ÍNDICE DE MADUREZ GLOBAL: ${overallMaturityScore}% (Meta Corporativa: ${overallTargetScore}%)
GAP ESTRATÉGICO IDENTIFICADO: ${gapScore}% de brecha de madurez

---------------------------------------------------------
1. CARACTERIZACIÓN DE LA CULTURA ORGANIZACIONAL Y SITUACIÓN ACTUAL
---------------------------------------------------------
${cultureDescription}

MODELO ACTUAL DE GESTIÓN DEL CONOCIMIENTO QUE APLICA EN LA EMPRESA:
${selectedCompanyModel}

---------------------------------------------------------
2. MATRIZ DE CONTRASTE DE MODELOS TEÓRICOS DE REFERENCIA
---------------------------------------------------------
A continuación se realiza el contraste dinámico entre los modelos teóricos de Gestión del Conocimiento:

A. MODELO DE REFERENCIA TEÓRICA SELECCIONADO PARA EL PROYECTO:
   ${selectedTheoreticalReference}

B. MATRIZ COMPARATIVA DE ESTUDIO (DOBLE ENTRADA):

* Modelo 1: Nonaka & Takeuchi (SECI)
  - Enfoque: Transformación dinámica continua entre Conocimiento Tácito y Explícito (Socialización, Exteriorización, Combinación, Interiorización).
  - Tratamiento Tacit/Explicit: Tránsito fluido. Valora la experiencia personal del empleado para inyectarla en manuales corporativos estructurados.
  - Soporte Tecnológico: Comunidades colaborativas, wikis avanzadas y bases de vectores alimentadas por prompts refinados por expertos.

* Modelo 2: de Arthur Andersen
  - Enfoque: Flujo bidireccional acelerado del conocimiento desde el individuo hacia la base común de la organización para agregar valor económico.
  - Tratamiento Tacit/Explicit: Altamente explícito. Exige registrar de forma sistemática el saber de cada transacción para alimentar la memoria corporativa.
  - Soporte Tecnológico: Bases documentales, repositorios de embeddings cifrados y motores de búsqueda semántica.

* Modelo 3: de Karl Wiig (Cognitivo)
  - Enfoque: Enfoque cognitivo absoluto. Evalúa la calidad, utilidad conceptual del conocimiento y la toma de decisiones basada en niveles de veracidad.
  - Tratamiento Tacit/Explicit: Balanceado. El conocimiento debe organizarse en taxonomías conceptuales rigurosas para que sea factible su aplicación inmediata.
  - Soporte Tecnológico: Model Cards, bases gráficas de relación conceptual, ontologías computacionales y bases vectoriales.

---------------------------------------------------------
2.5. MATRIZ DOFA DE DIAGNÓSTICO ESTRATÉGICO DIRECTIVO (SITUACIÓN ACTUAL)
---------------------------------------------------------
A partir de la medición de madurez global (${overallMaturityScore}%), se deriva el siguiente diagnóstico estratégico:

FORTALEZAS (Internas):
${swotMatrix.strengths.map(s => ` - ${s}`).join("\n")}

DEBILIDADES (Internas):
${swotMatrix.weaknesses.map(w => ` - ${w}`).join("\n")}

OPORTUNIDADES (Externas):
${swotMatrix.opportunities.map(o => ` - ${o}`).join("\n")}

AMENAZAS (Externas):
${swotMatrix.threats.map(t => ` - ${t}`).join("\n")}

---------------------------------------------------------
2.6. MATRIZ DE RIESGOS CRÍTICOS (PROBABILIDAD VS IMPACTO)
---------------------------------------------------------
Evaluación diagnóstica de riesgos éticos, de seguridad y de privacidad del conocimiento indexado:

${risksData.map((r, idx) => `Riesgo ${idx + 1}: ${r.name}
 - Categoría: ${r.cat}
 - Probabilidad de ocurrencia: ${r.prob}%
 - Severidad del Impacto: ${r.imp}%
 - Clasificación de Riesgo: ${r.classInfo.label}
 - Descripción: ${r.description}
 - Recomendación de Mitigación: ${r.action}`).join("\n\n")}

---------------------------------------------------------
3. OPORTUNIDADES DE MEJORA E INSTRUMENTOS DE IA GENERATIVA IDENTIFICADOS
---------------------------------------------------------
* Gaps principales identificados a través del simulador de madurez:
${computedOpportunities.map((op, idx) => `${idx + 1}. [${op.title}]: ${op.desc}`).join("\n")}

---------------------------------------------------------
4. PROPUESTA DE MEJORAMIENTO FORMULADA (Superación de brechas)
---------------------------------------------------------
${improvementDraft}

VENTAJAS DE CONTAR CON ESTE MODELO Y HERRAMIENTAS:
1. Asegura la veracidad cognitiva del agente IA disminuyendo riesgos de alucinación semántica.
2. Promueve la democratización del conocimiento en la empresa, disminuyendo la dependencia en empleados específicos.
3. Se alinea de forma transparente con el ciclo estratégico de la Universidad EAN.

---------------------------------------------------------
5. RECOMENDACIONES PARA LA PUESTA EN MARCHA DE LA PROPUESTA
---------------------------------------------------------
${rolloutRecommendations}

---------------------------------------------------------
6. CONCLUSIONES DE LA ACTIVIDAD DE APRENDIZAJE E INTERVENCIÓN
---------------------------------------------------------
${academicConclusions}

---------------------------------------------------------
7. FUENTES BIBLIOGRÁFICAS CONSULTADAS (Formato APA)
---------------------------------------------------------
${customBibliography}

=========================================================
Generado automáticamente por AuditAgent IA - Universidad EAN.`;

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-700 via-slate-900 to-indigo-950 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <GraduationCap className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold font-mono text-indigo-300 bg-white/5 px-2.5 py-0.5 rounded border border-white/10 tracking-widest">
                Espacio de Trabajo Estudiantil
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">Guía EAN de Proyecto de Intervención: Guía de Trabajo 3</h2>
            <p className="text-xs text-indigo-200 mt-1.5 leading-relaxed max-w-2xl">
              Este panel complementa la medición de madurez global. Permite al estudiante realizar la contrastación empírica y estructurar sistemáticamente los puntos obligatorios <strong>1.10 al 1.17</strong> del informe para su empresa.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs inside EAN workspace */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveSubTab("cultura")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === "cultura"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> 1. Cultura y Modelo Actual (1.10)
        </button>
        <button
          onClick={() => setActiveSubTab("matriz")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === "matriz"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Table className="w-3.5 h-3.5" /> 2. Matriz de Contraste (1.11)
        </button>
        <button
          onClick={() => setActiveSubTab("propuesta")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === "propuesta"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" /> 3. Gaps y Propuesta (1.12-1.13)
        </button>
        <button
          onClick={() => setActiveSubTab("swot")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === "swot"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-950"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-indigo-505 text-indigo-500" /> 4. Análisis Estratégico (DOFA)
        </button>
        <button
          onClick={() => setActiveSubTab("redactor")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === "redactor"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" /> 5. Redactor & Entregable EAN (1.14-1.17)
        </button>
      </div>

      {/* Tab Panels with animations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <AnimatePresence mode="wait">
          {activeSubTab === "cultura" && (
            <motion.div
              key="cultura"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-600" /> Caracterización Cultural y Modelo Actual de Gestión
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Describa cómo fluye el conocimiento en su empresa. Este análisis sienta las bases de madurez del agente de IA.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
                    Cultura Organizacional frente a la Gestión del Conocimiento:
                  </label>
                  <textarea
                    rows={4}
                    value={cultureDescription}
                    onChange={(e) => handleSaveData("ean_culture_desc", e.target.value, setCultureDescription)}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/45 text-slate-800 leading-relaxed font-sans"
                    placeholder="Ej. Describa si la empresa es jerárquica, orientada a clanes, mercado o ad-hoc..."
                  />
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="text-indigo-600 font-bold">Guía Académica:</span>
                    <span>Considere aspectos como resistencia al cambio, silos documentales o incentivos al compartir prompts.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
                    1.10. Identificación del Modelo de Gestión actual que aplica la empresa:
                  </label>
                  <input
                    type="text"
                    value={selectedCompanyModel}
                    onChange={(e) => handleSaveData("ean_company_model", e.target.value, setSelectedCompanyModel)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/45 font-semibold text-slate-800"
                    placeholder="Ej. Modelo Empírico Basado en Tareas / Modelo Informal"
                  />
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="text-indigo-600 font-bold">Guía Académica:</span>
                    <span>Escriba el nombre con el que se asocia la gestión actual (sea estructurado o informal en el día a día).</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-150 text-orange-950 text-xs flex gap-3 mt-4">
                <Lightbulb className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Tip Metodológico Universidad EAN:</span>
                  <p className="leading-relaxed text-slate-700">
                    Muchos agentes de IA fracasan no por culpa de la tecnología, sino porque la cultura corporativa no fomenta la <strong>Exteriorización</strong> (convertir conocimiento táctico del experto en reglas explícitas). Asegúrese de mapear esto en sus conclusiones.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === "matriz" && (
            <motion.div
              key="matriz"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Table className="w-4 h-4 text-indigo-600" /> Matriz de Contraste Obligatoria (Punto 1.11)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Contraste el modelo actual de su organización con al menos tres de los modelos teóricos teóricos básicos de gestión de conocimiento.
                    </p>
                  </div>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-mono text-[10px] uppercase">
                      <th className="p-3.5 font-bold">Modelos Teóricos Referenciales</th>
                      <th className="p-3.5 font-bold">Enfoque Principal</th>
                      <th className="p-3.5 font-bold">Tácito vs. Explícito</th>
                      <th className="p-3.5 font-bold">Soporte Tecnológico / IA</th>
                      <th className="p-3.5 font-bold text-indigo-700">Ventaja estratégica en IA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {matrixComparison.map((model, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-black text-slate-800 bg-slate-50/20">{model.name}</td>
                        <td className="p-3.5 text-slate-600 leading-relaxed min-w-[150px]">{model.focus}</td>
                        <td className="p-3.5 text-slate-600 leading-relaxed min-w-[150px]">{model.tacit_explicit}</td>
                        <td className="p-3.5 text-slate-600 leading-relaxed min-w-[150px] font-mono text-[11px]">{model.tech_support}</td>
                        <td className="p-3.5 text-indigo-950 bg-indigo-50/30 font-semibold leading-relaxed min-w-[150px]">
                          {model.ean_advantage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
                  Seleccione el Modelo Teórico en el que se basará para su propuesta de mejoramiento (Punto 1.13):
                </label>
                <select
                  value={selectedTheoreticalReference}
                  onChange={(e) => handleSaveData("ean_theoretical_ref", e.target.value, setSelectedTheoreticalReference)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-bold text-indigo-800"
                >
                  <option value="Modelo SECI (Nonaka & Takeuchi)">Modelo SECI (Nonaka & Takeuchi, 1995)</option>
                  <option value="Modelo de Arthur Andersen">Modelo de Arthur Andersen (1999)</option>
                  <option value="Modelo de Karl Wiig (Cognitivo)">Modelo de Karl Wiig (Cognitivo, 1993)</option>
                </select>
                <p className="mt-1 text-[10px] text-slate-400">
                  Refiera este modelo de base para estructurar su propuesta de mejoramiento en el informe consolidado.
                </p>
              </div>
            </motion.div>
          )}

          {activeSubTab === "propuesta" && (
            <motion.div
              key="propuesta"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-indigo-600" /> Identificar Gaps e Instrumentar Soluciones (1.12 - 1.13)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  En base al contraste de modelos, configure la propuesta de mejoramiento y asocie las herramientas tecnológicas adecuadas.
                </p>
              </div>

              {/* Computed Academic Opportunities from Simulation metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  1.12. Oportunidades de Mejora Derivadas de su Simulación Actual:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {computedOpportunities.map((op) => (
                    <div key={op.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider mb-2 inline-block">
                        RECOMENDADA
                      </span>
                      <h5 className="text-xs font-black text-slate-800 mb-1.5">{op.title}</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{op.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposal Text area (Criterio 1.13) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  1.13. Propuesta de mejoramiento para superar los gaps (Redactor de Enfoque):
                </h4>
                <p className="text-[11px] text-slate-500">
                  Describa la propuesta de valor integrada. Especifique las ventajas de contar con un modelo riguroso y unas herramientas de IA Generativa.
                </p>
                <textarea
                  rows={4}
                  value={improvementDraft}
                  onChange={(e) => handleSaveData("ean_improvement_draft", e.target.value, setImprovementDraft)}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/45 text-slate-800 leading-relaxed"
                  placeholder="Ej. Redacte detalladamente cómo mitigará los gaps utilizando el modelo seleccionado y tecnologías de IA..."
                />
              </div>
            </motion.div>
          )}

          {activeSubTab === "swot" && (
            <motion.div
              key="swot"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" /> Diagnóstico de Situación Actual: Matriz DOFA (FODA / SWOT)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Análisis estratégico derivado del Índice de Madurez Global del conocimiento actual ({overallMaturityScore}%) y Brecha ({gapScore}%).
                  </p>
                </div>
                <div className="text-[10px] font-mono bg-indigo-50 border border-indigo-150 px-3 py-1 text-indigo-805 rounded-lg text-indigo-750">
                  Estado: <strong className="uppercase">{overallMaturityScore >= 50 ? "Estable / Promisorio" : "Crítico / Alta Brecha"}</strong>
                </div>
              </div>

              {/* Explanatory introduction block */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-xs text-slate-650 leading-relaxed">
                <p>
                  Sustentado en las métricas recopiladas por el simulador, el motor ha estructurado un mapeo de factores internos e influencias externas. Los estudiantes de la <strong>Universidad EAN</strong> pueden utilizar esta matriz dinámica para el desarrollo analítico del informe de intervención, justificando científicamente los inputs y conectándolos con las deudas operativas de IA identificadas.
                </p>
              </div>

              {/* 2x2 Bento SWOT Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* STRENGTHS */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-150 pb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs uppercase font-black tracking-wider font-mono">
                      Fortalezas (F) - Factores Internos Alentadores
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-slate-755 text-xs">
                    {swotMatrix.strengths.map((str, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 font-mono">F{idx+1}.</span>
                        <span className="text-slate-750 font-medium leading-relaxed">{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WEAKNESSES */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-rose-800 border-b border-rose-150 pb-2">
                    <HelpCircle className="w-4 h-4 text-rose-600" />
                    <h4 className="text-xs uppercase font-black tracking-wider font-mono">
                      Debilidades (D) - Factores Internos de Arrastre
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-slate-755 text-xs">
                    {swotMatrix.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-rose-500 font-bold shrink-0 font-mono">D{idx+1}.</span>
                        <span className="text-slate-750 font-medium leading-relaxed">{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* OPPORTUNITIES */}
                <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-sky-802 border-b border-sky-150 pb-2">
                    <Lightbulb className="w-4 h-4 text-sky-600" />
                    <h4 className="text-xs uppercase font-black tracking-wider font-mono">
                      Oportunidades (O) - Factores Externos a Capitalizar
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-slate-755 text-xs">
                    {swotMatrix.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-sky-500 font-bold shrink-0 font-mono">O{idx+1}.</span>
                        <span className="text-slate-750 font-medium leading-relaxed">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* THREATS */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-802 border-b border-amber-150 pb-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs uppercase font-black tracking-wider font-mono">
                      Amenazas (A) - Factores Externos de Alerta Colectiva
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-slate-755 text-xs">
                    {swotMatrix.threats.map((threat, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-amber-500 font-bold shrink-0 font-mono">A{idx+1}.</span>
                        <span className="text-slate-750 font-medium leading-relaxed">{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* INTERACTIVE RISK MATRIX GRAPH COMPONENT */}
              <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" /> Matriz de Riesgos Críticos (Gobernanza de IA)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Mapeo dinámico de vulnerabilidades basados en el Diagnóstico Organizacional (Maturity: {overallMaturityScore}%, Gap: {gapScore}%).
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-850">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Bucle de Mitigación Activo
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Interactive Visual Grid Selector (lg:col-span-6) */}
                  <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest mb-4">
                      Cuadrante de Probabilidad de Ocurrencia vs Impacto Organizacional
                    </span>

                    <div className="relative w-full aspect-square max-w-[340px] border-l-2 border-b-2 border-slate-700 p-2">
                      {/* Grid background zones */}
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                        {/* TL: High Prob, Low Impact */}
                        <div className="border-r border-b border-dashed border-slate-800/40 bg-amber-500/[0.01] flex items-start justify-start p-2">
                          <span className="text-[9px] font-mono text-slate-600 font-bold">ALTA PROB. / BAJO IMP.</span>
                        </div>
                        {/* TR: High Prob, High Impact (Critical Zone) */}
                        <div className="border-b border-slate-800/40 bg-red-500/[0.03] flex items-start justify-end p-2 relative">
                          <span className="absolute top-2 right-2 text-[9px] font-mono text-rose-500 font-bold bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/60 animate-pulse">ZONA CRÍTICA</span>
                        </div>
                        {/* BL: Low Prob, Low Impact */}
                        <div className="border-r border-slate-800/40 bg-emerald-500/[0.01] flex items-end justify-start p-2">
                          <span className="text-[9px] font-mono text-slate-600 font-bold">BAJA PROB. / BAJO IMP.</span>
                        </div>
                        {/* BR: Low Prob, High Impact */}
                        <div className="bg-amber-500/[0.02] flex items-end justify-end p-2">
                          <span className="text-[9px] font-mono text-slate-600 font-bold">BAJA PROB. / ALTO IMP.</span>
                        </div>
                      </div>

                      {/* Axis indicators */}
                      <div className="absolute -left-7 top-[45%] -rotate-90 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest shrink-0">
                        Probabilidad ──►
                      </div>
                      <div className="absolute bottom-[-24px] left-[35%] text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">
                        Impacto / Severidad ──►
                      </div>

                      {/* Plots (Dynamic Dots) */}
                      {risksData.map((risk, index) => {
                        const isSelected = selectedRisk === risk.id;
                        return (
                          <button
                            key={risk.id}
                            onClick={() => setSelectedRisk(risk.id)}
                            className={`absolute w-8 h-8 rounded-full flex items-center justify-center -translate-x-1/2 translate-y-1/2 transition-all duration-300 ${
                              isSelected
                                ? "bg-indigo-600 text-white ring-4 ring-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.8)] scale-110 z-20"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200 cursor-pointer hover:scale-105 z-10 border border-slate-700"
                            }`}
                            style={{
                              left: `${risk.imp}%`,
                              bottom: `${risk.prob}%`,
                            }}
                            title={`${risk.name} (P:${risk.prob}%, I:${risk.imp}%)`}
                          >
                            <span className="text-xs font-mono font-black">R{index + 1}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-4 mt-8 flex-wrap justify-center text-[10px] font-mono text-slate-400">
                      {risksData.map((r, idx) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedRisk(r.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                            selectedRisk === r.id
                              ? "bg-indigo-950/40 border-indigo-700/80 text-indigo-300 font-bold"
                              : "border-transparent text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          R{idx + 1}: {r.cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detail panel of the selected risk (lg:col-span-6) */}
                  <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    {(() => {
                      const active = risksData.find((r) => r.id === selectedRisk) || risksData[0];
                      return (
                        <div className="space-y-4 flex flex-col h-full justify-between">
                          <div className="space-y-3.5">
                            {/* Danger tag and metadata */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-400 font-bold">
                                {active.cat}
                              </span>
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono ${active.classInfo.color}`}>
                                {active.classInfo.label}
                              </span>
                            </div>

                            {/* Title & score indicator */}
                            <div>
                              <h5 className="text-sm font-black text-white leading-snug">
                                {active.name}
                              </h5>
                              <div className="flex gap-4 mt-2 font-mono text-[11px] text-slate-400">
                                <div>
                                  Probabilidad: <strong className="text-slate-200">{active.prob}%</strong>
                                </div>
                                <div>
                                  Impacto: <strong className="text-slate-200">{active.imp}%</strong>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                              {active.description}
                            </p>
                          </div>

                          {/* Action bullet */}
                          <div className="space-y-2 mt-4">
                            <h6 className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Acción De Mitigación (Informe EAN):
                            </h6>
                            <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 p-3.5 border border-emerald-900/30 rounded-xl">
                              {active.action}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Helpful directive how to use for project intervention page-count */}
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-[11px] text-slate-700 leading-relaxed flex gap-2.5">
                <Lightbulb className="w-4.5 h-4.5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-orange-950 block">Conexión Metodológica Directa:</span>
                  <span>Al formular la propuesta del apartado <strong>3 (Gaps y Propuesta)</strong>, los estudiantes deben elegir al menos una debilidad (ej. D1: Carencia de prompts estándar) y contrarrestarla diseñando un procedimiento basado en su modelo referencial elegido (ej. SECI de Nonaka) soportado por una oportunidad clara (ej. O2: optimización con Vector DB).</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === "redactor" && (
            <motion.div
              key="redactor"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-600" /> Redactor y Consolidado EAN (Recomendaciones, Conclusiones y Fuentes)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete la sección final de su Guía 3 y genere un borrador listo para copiar a su procesador de texto (ej. Word).
                  </p>
                </div>
                <button
                  onClick={handleCopyDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold font-mono transition shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> {copySuccess ? "¡Copiado con Éxito!" : "Copiar Borrador Completo"}
                </button>
              </div>

              {/* Dynamic textareas for 1.14 - 1.16 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
                    1.14. Recomendaciones para puesta en marcha:
                  </label>
                  <textarea
                    rows={4}
                    value={rolloutRecommendations}
                    onChange={(e) => handleSaveData("ean_rollout_recs", e.target.value, setRolloutRecommendations)}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/45 text-slate-800 leading-relaxed font-mono"
                    placeholder="Escriba los puntos de inicio recomendados..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
                    1.15. Conclusiones de Aprendizaje:
                  </label>
                  <textarea
                    rows={4}
                    value={academicConclusions}
                    onChange={(e) => handleSaveData("ean_conclusions", e.target.value, setAcademicConclusions)}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/45 text-slate-800 leading-relaxed"
                    placeholder="Construya sus reflexiones analíticas sobre el gap y la madurez..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
                  1.16. Fuentes Bibliográficas Consultadas (Formato APA):
                </label>
                <textarea
                  rows={3}
                  value={customBibliography}
                  onChange={(e) => handleSaveData("ean_bibliography", e.target.value, setCustomBibliography)}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50/45 font-mono text-slate-700 leading-relaxed"
                  placeholder="Bibliografía empleada..."
                />
              </div>

              {/* Guide about 1.17 70-page document limit instruction */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-650 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider font-mono">
                  <Layers className="w-4 h-4 text-sky-500" /> Nota sobre el Entregable Integrado (Punto 1.17)
                </div>
                <p className="leading-relaxed text-slate-500 text-[11px]">
                  Recuerde que el informe final de la <strong>Guía No. 3 (máximo 20 páginas)</strong> debe integrarse en un único documento comprensivo junto con los informes previos ajustados de la <strong>Guía No. 1 y Guía No. 2</strong>, sumando un <strong>máximo de 70 páginas</strong> en total. Al pulsar el botón superior obtendrá toda la base textual de la Guía 3 estruturada según esta rúbrica de la Universidad EAN.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
