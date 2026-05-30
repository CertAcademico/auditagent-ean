import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { CATEGORIES, QUESTIONS, KNOWLEDGE_PHASES_MAP, RULE_RECOMMENDATIONS } from "../data";
import { AssessmentResponse, AssessmentTarget, CriticalGap, GapData, SavedReport } from "../types";

interface GapDashboardProps {
  responses: AssessmentResponse;
  targets: AssessmentTarget;
}

export default function GapDashboard({ responses, targets }: GapDashboardProps) {
  // Real-time calculation of overall metrics for active session
  const currentMaturity = useMemo(() => {
    let sumCurrent = 0;
    let count = 0;

    CATEGORIES.forEach((cat) => {
      const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
      const catSum = catQuestions.reduce((acc, q) => acc + (responses[q.id] || 0), 0);
      const catAvg = catQuestions.length > 0 ? catSum / catQuestions.length : 0;
      sumCurrent += catAvg;
      count++;
    });

    return count > 0 ? Math.round(sumCurrent / count) : 0;
  }, [responses]);

  const currentTarget = useMemo(() => {
    let sumTarget = 0;
    let count = 0;

    CATEGORIES.forEach((cat) => {
      sumTarget += targets[cat.id] || 80;
      count++;
    });

    return count > 0 ? Math.round(sumTarget / count) : 0;
  }, [targets]);

  // Load state from localStorage to track overall history and progress
  const savedReports = useMemo<SavedReport[]>(() => {
    try {
      const raw = localStorage.getItem("audit_reports");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error al cargar reportes desde localStorage en el Dashboard", e);
      return [];
    }
  }, [responses, targets]);

  const lineChartData = useMemo(() => {
    // Chronological sorting (from oldest to newest) for left-to-right line chart flow
    const historical = [...savedReports].sort((a, b) => Number(a.id) - Number(b.id));

    const historyPoints = historical.map((report) => ({
      name: report.projectName.substring(0, 15) + (report.projectName.length > 15 ? ".." : ""),
      fullName: report.projectName,
      fecha: report.date || "Sin fecha",
      "Madurez Actual": report.overallMaturity,
      "Meta de Madurez": report.overallTarget,
      id: report.id,
      isCurrent: false,
    }));

    // Detect if current system responses exactly match a saved report's responses
    const isCurrentSaved = historical.some((r) => {
      const sameResponses =
        Object.keys(responses).length === Object.keys(r.responses).length &&
        Object.keys(responses).every((k) => responses[k] === r.responses[k]);
      const sameTargets =
        Object.keys(targets).length === Object.keys(r.targets).length &&
        Object.keys(targets).every((k) => targets[k] === r.targets[k]);
      return sameResponses && sameTargets;
    });

    // If active evaluation isn't saved yet, append it as the live progress node
    if (!isCurrentSaved) {
      historyPoints.push({
        name: "Sesión Activa",
        fullName: "Evaluación Activa (En tiempo real)",
        fecha: "Ahora",
        "Madurez Actual": currentMaturity,
        "Meta de Madurez": currentTarget,
        id: "active_live",
        isCurrent: true,
      });
    }

    return historyPoints;
  }, [savedReports, responses, targets, currentMaturity, currentTarget]);

  // 1. Calculate category averages & construct radar data
  const radarData = useMemo<GapData[]>(() => {
    return CATEGORIES.map((cat) => {
      const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
      const sum = catQuestions.reduce((acc, q) => acc + (responses[q.id] || 0), 0);
      const avgCurrent = catQuestions.length > 0 ? sum / catQuestions.length : 0;
      const targetGoal = targets[cat.id] || 80;

      return {
        name: cat.name,
        A: Math.round(avgCurrent), // Current Score
        B: targetGoal, // Target Score
        fullMark: 100,
      };
    });
  }, [responses, targets]);

  // 2. Calculate granular question gaps to find critical points
  const criticalGaps = useMemo<CriticalGap[]>(() => {
    const gaps: CriticalGap[] = [];

    QUESTIONS.forEach((q) => {
      const current = responses[q.id] || 0;
      const target = targets[q.category] || 80;
      const gap = target - current;

      if (gap > 0) {
        // Find EAN knowledge phase mapped
        const phase = KNOWLEDGE_PHASES_MAP[q.id] || "Ciclo Organizacional";
        // Grab a random or specific rule remedy
        const remedies = RULE_RECOMMENDATIONS[q.category] || [];
        const index = Math.abs(q.id.charCodeAt(0)) % remedies.length;
        const remedy = remedies[index] || "Establecer capacitación continua y auditoría de prompts.";

        gaps.push({
          id: q.id,
          name: q.label,
          current,
          target,
          gap,
          phase,
          remedy,
        });
      }
    });

    // Sort by largest gap
    return gaps.sort((a, b) => b.gap - a.gap);
  }, [responses, targets]);

  // 3. Prepare data for the granular bar chart
  const barData = useMemo(() => {
    return QUESTIONS.map((q) => ({
      shortName: q.label.substring(0, 18) + (q.label.length > 18 ? ".." : ""),
      Completo: q.label,
      "Puntaje Actual": responses[q.id] || 0,
      "Meta Deseada": targets[q.category] || 80,
    }));
  }, [responses, targets]);

  const hasAnswers = Object.keys(responses).length > 0;

  if (!hasAnswers) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center text-center">
        <Compass className="w-12 h-12 text-sky-500 mb-3 animate-spin duration-3000" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
          Esperando Evaluación
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
          Comienza a responder las preguntas en el panel izquierdo. El Dashboard de Brechas contrastará tus respuestas con las metas deseadas en tiempo real.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart Panel */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Alineación de Vectores IA
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Contraste de madurez general actual (azul celeste) vs metas corporativas deseadas (azul índigo).
            </p>
          </div>

          <div className="h-65 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#475569", fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8" }} />
                <Radar
                  name="Puntaje Actual"
                  dataKey="A"
                  stroke="#0284C7"
                  fill="#0284C7"
                  fillOpacity={0.15}
                />
                <Radar
                  name="Meta de la Empresa"
                  dataKey="B"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.08}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: "#475569" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Panel */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-505 bg-indigo-500" /> Detalle de Puntuaciones
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Puntajes específicos de las {QUESTIONS.length} dimensiones evaluadas frente a su target.
            </p>
          </div>

          <div className="h-65 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barSize={6}
              >
                <XAxis dataKey="shortName" tick={{ fill: "#64748B", fontSize: 8 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "0.5rem",
                    border: "1px solid #E2E8F0",
                    color: "#0F172A",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="Puntaje Actual" fill="#0284C7" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Meta Deseada" fill="#4F46E5" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Progress Chart Section */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-sky-500" /> Evolución Histórica de Madurez
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Monitoreo cronológico del índice de madurez global frente a las auditorías guardadas en este navegador.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-100 text-xs font-mono font-bold text-sky-700">
            {savedReports.length} {savedReports.length === 1 ? "Registro" : "Registros"} Guardados
          </span>
        </div>

        {savedReports.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center">
            <TrendingUp className="w-10 h-10 text-slate-400 mb-2.5 stroke-[1.5]" />
            <p className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Monitoreo de Cambios de Madurez</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
              Aún no has guardado reportes de auditoría en este navegador. Genera un informe y pulsa <strong>&quot;Guardar Informe&quot;</strong> en la pestaña <em>Informe / Consultoría IA EAN</em> para registrar tus simulaciones e histórico de progreso aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-68 sm:h-76 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#64748B", fontSize: 9 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: "#64748B", fontSize: 9 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-md text-xs space-y-1 text-slate-700">
                            <p className="font-black text-slate-900 border-b border-slate-100 pb-1 mb-1">{data.fullName}</p>
                            <p className="font-mono text-[10px] text-slate-500">Fecha: {data.fecha}</p>
                            <div className="flex items-center gap-2 mt-1.5 font-bold">
                              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                              <span>Madurez IA Global: <strong className="text-slate-900">{data["Madurez Actual"]}%</strong></span>
                            </div>
                            <div className="flex items-center gap-2 font-bold">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] inline-block" />
                              <span>Meta Corporativa: <strong className="text-slate-900">{data["Meta de Madurez"]}%</strong></span>
                            </div>
                            {data.isCurrent && (
                              <p className="text-[9px] text-sky-650 text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded font-mono font-bold mt-1 text-center border border-sky-100/60">
                                ★ Live (Sesión en Edición)
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    iconType="circle"
                    iconSize={8} 
                    wrapperStyle={{ fontSize: 10, color: "#475569", paddingTop: 10 }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="Madurez Actual"
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.isCurrent) {
                        return (
                          <svg x={cx - 7} y={cy - 7} width={14} height={14} viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="30" fill="#0284C7" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#0284C7" strokeWidth="15" className="animate-pulse" opacity="0.4" />
                          </svg>
                        );
                      }
                      return <circle cx={cx} cy={cy} r={4.5} fill="#ffffff" stroke="#0284C7" strokeWidth={2.5} />;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Meta de Madurez"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    activeDot={{ r: 5 }}
                    dot={{ r: 3, fill: "#FFFFFF", stroke: "#4F46E5", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Critical Gaps Section */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" /> Brechas Críticas de Adopción y Gobernanza
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Muestrario ordenado de métricas con deficiencias de apropiación para la toma de decisiones.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-xs font-mono font-bold text-amber-700">
            {criticalGaps.length} Gaps Críticos
          </span>
        </div>

        {criticalGaps.length === 0 ? (
          <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
            <p className="font-semibold text-slate-900 text-sm">¡Excelente Integración!</p>
            <p className="text-xs mt-0.5 max-w-sm leading-relaxed">
              Felicidades. El agente cumple o supera todas las metas de madurez técnica y organizacional establecidas en las dimensiones analizadas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalGaps.slice(0, 4).map((gap) => (
              <div
                key={gap.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors duration-300 animate-fade-in"
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h4 className="text-xs font-bold text-slate-900 tracking-wide">{gap.name}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono text-rose-700 bg-rose-50 border border-rose-100 rounded">
                      -{gap.gap}% Gap
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-650 text-indigo-650 text-indigo-600 mb-3 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" /> FASE EAN: {gap.phase}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Puntaje actual: <span className="text-slate-800 font-bold">{gap.current}%</span>. Target fijado: <span className="text-indigo-650 text-indigo-600 font-semibold">{gap.target}%</span>.
                  </p>
                </div>

                <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-100 text-[11px]">
                  <p className="font-bold text-amber-700 flex items-center gap-1 mb-0.5">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" /> Acción Correctiva Sugerida:
                  </p>
                  <p className="text-slate-700 leading-relaxed italic">{gap.remedy}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
