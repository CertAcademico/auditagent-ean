import React, { useState } from "react";
import {
  Download,
  Printer,
  Sparkles,
  Loader2,
  BookmarkCheck,
  Building,
  Calendar,
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  Save,
  Trash2,
  History,
} from "lucide-react";
import { AssessmentResponse, AssessmentTarget, CriticalGap, SavedReport } from "../types";
import { CATEGORIES, QUESTIONS, KNOWLEDGE_PHASES_MAP } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface ReportExporterProps {
  responses: AssessmentResponse;
  targets: AssessmentTarget;
  projectName: string;
  sector: string;
  onRestoreState?: (state: {
    responses: AssessmentResponse;
    targets: AssessmentTarget;
    projectName: string;
    sector: string;
  }) => void;
}

export default function ReportExporter({
  responses,
  targets,
  projectName,
  sector,
  onRestoreState,
}: ReportExporterProps) {
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [loadedReportId, setLoadedReportId] = useState<string | null>(null);

  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    try {
      const raw = localStorage.getItem("audit_reports");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error al cargar reportes guardados desde localStorage", e);
      return [];
    }
  });

  const hasAnswers = Object.keys(responses).length > 0;

  // Derive global metrics
  const overallStats = (() => {
    let sumCurrent = 0;
    let sumTarget = 0;
    let count = 0;

    CATEGORIES.forEach((cat) => {
      const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
      const catSum = catQuestions.reduce((acc, q) => acc + (responses[q.id] || 0), 0);
      const catAvg = catQuestions.length > 0 ? catSum / catQuestions.length : 0;

      sumCurrent += catAvg;
      sumTarget += targets[cat.id] || 80;
      count++;
    });

    const activeMaturityScore = count > 0 ? Math.round(sumCurrent / count) : 0;
    const targetMaturityScore = count > 0 ? Math.round(sumTarget / count) : 0;
    const gap = Math.max(0, targetMaturityScore - activeMaturityScore);

    return { activeMaturityScore, targetMaturityScore, gap };
  })();

  // Prepare critical gaps for the API or report
  const criticalGaps: CriticalGap[] = (() => {
    const list: CriticalGap[] = [];
    QUESTIONS.forEach((q) => {
      const current = responses[q.id] || 0;
      const target = targets[q.category] || 80;
      const gap = target - current;
      if (gap > 0) {
        list.push({
          id: q.id,
          name: q.label,
          current,
          target,
          gap,
          phase: KNOWLEDGE_PHASES_MAP[q.id] || "Gobernanza de Conocimiento",
          remedy: "", // Server can formulate
        });
      }
    });
    return list.sort((a, b) => b.gap - a.gap);
  })();

  const generateAIAdvisory = async () => {
    if (!hasAnswers) return;
    setLoading(true);

    const steps = [
      "Iniciando evaluación de arquitectura cognitiva...",
      "Escanenado vulnerabilidades de Prompt Injection e inyecciones de datos...",
      "Calculando equidad poblacional frente a sesgos algorítmicos...",
      "Alineando diagnóstico con el ciclo de Gestión del Conocimiento EAN...",
      "Modelando plan de acción correctivo de 0 a 90 días...",
      "Redactando reporte de consultoría de Inteligencia Artificial...",
    ];

    let i = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      setLoadingStep(steps[i]);
    }, 1800);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectName || "Agente IA Evaluado",
          sector,
          categories: CATEGORIES.map((c) => {
            const qs = QUESTIONS.filter((q) => q.category === c.id);
            return {
              id: c.id,
              name: c.name,
              score: Math.round(qs.reduce((acc, q) => acc + (responses[q.id] || 0), 0) / (qs.length || 1)),
              targetGoal: targets[c.id] || 80,
            };
          }),
          overallStats,
          criticalGaps,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiReport(data.report);
        setLoadedReportId(null);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      setAiReport("Error al contactar al auditor de IA de Gemini. Reintentando...");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!aiReport) return;
    try {
      const newReport: SavedReport = {
        id: Date.now().toString(),
        projectName: projectName || "Agente IA Evaluado",
        sector,
        date: new Date().toLocaleString("es-CO", { 
          timeZone: "America/Bogota",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        overallMaturity: overallStats.activeMaturityScore,
        overallTarget: overallStats.targetMaturityScore,
        gap: overallStats.gap,
        reportText: aiReport,
        responses,
        targets,
      };

      // Filter out duplicates with the same project name and raw report text to keep history clean
      const updated = [newReport, ...savedReports.filter(r => r.projectName !== newReport.projectName || r.reportText !== newReport.reportText)];
      setSavedReports(updated);
      localStorage.setItem("audit_reports", JSON.stringify(updated));
      setLoadedReportId(newReport.id);
      setSaveSuccessMessage("¡Informe de auditoría guardado con éxito en el historial!");
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    } catch (e) {
      console.error("Error al guardar el informe", e);
    }
  };

  const handleLoadReport = (report: SavedReport) => {
    setAiReport(report.reportText);
    setLoadedReportId(report.id);
    if (onRestoreState) {
      onRestoreState({
        responses: report.responses,
        targets: report.targets,
        projectName: report.projectName,
        sector: report.sector,
      });
    }
  };

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Está seguro de que desea eliminar este informe del historial local?")) {
      try {
        const updated = savedReports.filter((r) => r.id !== id);
        setSavedReports(updated);
        localStorage.setItem("audit_reports", JSON.stringify(updated));
        if (loadedReportId === id) {
          setLoadedReportId(null);
        }
      } catch (err) {
        console.error("Error al eliminar el informe", err);
      }
    }
  };

  const cleanPrintAndSave = () => {
    window.print();
  };

  // Simple, polished parsing of markdown elements for the UI report render
  const renderFormattedReport = (text: string) => {
    return text.split("\n").map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-sky-700 mt-6 mb-2 tracking-wide uppercase font-mono border-b border-slate-200 pb-1.5 label-print">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h5 key={idx} className="text-xs font-bold text-indigo-700 mt-4 mb-2 tracking-wide font-mono label-print">
            {line.replace("#### ", "")}
          </h5>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-sm font-bold text-slate-950 mt-8 mb-3 tracking-wider font-mono uppercase bg-slate-50 px-3 py-1.5 rounded border-l-3 border-sky-500 label-print">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const item = line.substring(2);
        // Highlight bold in lists
        if (item.includes("**")) {
          return (
            <li key={idx} className="text-xs text-slate-650 text-slate-600 ml-4 list-disc mb-1 leading-relaxed">
              {parseBoldText(item)}
            </li>
          );
        }
        return (
          <li key={idx} className="text-xs text-slate-650 text-slate-600 ml-4 list-disc mb-1 leading-relaxed">
            {item}
          </li>
        );
      }
      if (line.trim().startsWith("1. ") || line.trim().startsWith("2. ") || line.trim().startsWith("3. ") || line.trim().startsWith("4. ") || line.trim().startsWith("5. ")) {
        return (
          <p key={idx} className="text-xs text-slate-650 text-slate-600 ml-2 mb-1 leading-relaxed font-sans">
            {parseBoldText(line)}
          </p>
        );
      }
      if (line.trim() === "") return <div key={idx} className="h-2" />;

      return (
        <p key={idx} className="text-xs text-slate-650 text-slate-600 mb-2 leading-relaxed font-sans">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split("**");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-slate-900 font-bold">{part}</strong>;
      }
      // Check code backticks
      if (part.includes("`")) {
        const subParts = part.split("`");
        return subParts.map((sp, j) => {
          if (j % 2 === 1) {
            return (
              <code key={j} className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-sky-750 text-sky-700 border border-slate-200">
                {sp}
              </code>
            );
          }
          return sp;
        });
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* Strategic Actions Panel */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center bg-gradient-to-r from-sky-50 to-indigo-50/50">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5 text-center md:text-left">
            <Sparkles className="w-4.5 h-4.5 text-sky-500 animate-pulse" /> Consultoría Estratégica con IA Gemini
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed text-center md:text-left">
            Genera un informe analítico integral y personalizado. Alineará tus puntajes de auditoría y brechas frente a planes de acción detallados de 90 días bajo el marco de la Universidad EAN de Colombia.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={generateAIAdvisory}
            disabled={!hasAnswers || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold font-mono transition shadow-lg shadow-sky-500/10 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generar Informe IA
              </>
            )}
          </button>

          {aiReport && (
            <button
              onClick={handleSaveReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition shadow-lg shadow-emerald-500/10 border border-emerald-700 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Guardar Informe
            </button>
          )}

          <button
            onClick={cleanPrintAndSave}
            disabled={!hasAnswers}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold font-mono transition border border-slate-700 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Exportar / Imprimir
          </button>
        </div>
      </div>

      {/* Toast Alert Success notification */}
      <AnimatePresence>
        {saveSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-medium shadow-xs"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Reports History Panel */}
      {savedReports.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm no-print">
          <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-500" /> Historial de Auditorías Locales ({savedReports.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Autoguardado en LocalStorage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleLoadReport(report)}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  loadedReportId === report.id
                    ? "bg-sky-50/50 border-sky-400 shadow-xs ring-1 ring-sky-300"
                    : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <h4 className="text-xs font-black text-slate-800 line-clamp-1">{report.projectName}</h4>
                    <span className="shrink-0 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold font-mono text-[9px] border border-sky-100">
                      C: {report.overallMaturity}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mb-2.5 line-clamp-1">{report.sector}</p>
                  
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{report.date}</span>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-slate-200/65 pt-3 mt-3 justify-end items-center">
                  <span className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 mr-auto">
                    -{report.gap}% Gap
                  </span>
                  <span className="text-[10px] font-bold text-sky-600 hover:text-sky-700 font-mono">
                    {loadedReportId === report.id ? "✓ Activo" : "Cargar"}
                  </span>
                  <button
                    onClick={(e) => handleDeleteReport(report.id, e)}
                    className="p-1 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Eliminar "
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="p-12 rounded-2xl bg-white border border-[#E2E8F0] shadow-md flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
          <p className="text-xs font-bold text-slate-900 font-mono uppercase tracking-widest animate-pulse">
            AUDITORÍA IA EN PROGRESO
          </p>
          <p className="text-xs text-sky-600 mt-1 font-mono">{loadingStep}</p>
        </div>
      )}

      {/* Render the report either AI or basic preview */}
      <div id="print-area" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden text-left no-shadow-print">
        {/* Printable Watermark Logo */}
        <div className="absolute top-6 right-6 flex items-center gap-1.5 opacity-20 pointer-events-none">
          <ShieldCheck className="w-5 h-5 text-sky-500" />
          <span className="text-xs font-mono font-bold text-slate-750 text-slate-900">AUDIT_AGENT</span>
        </div>

        {/* Report Corporate Header */}
        <div className="border-b border-slate-200 pb-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-mono text-[9px] uppercase tracking-widest font-bold border border-sky-100">
              Auditoría Algorítmica y del Conocimiento
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none mb-2">
            INFORME DE EVALUACIÓN Y CIERRE DE BRECHAS ESTRATÉGICAS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-4">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              <div>
                <p className="text-[10px] text-slate-500 font-mono uppercase">PROYECTO</p>
                <p className="font-extrabold text-slate-800">{projectName || "Agente de IA"}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-[10px] text-slate-500 font-mono uppercase">SECTOR</p>
                <p className="font-extrabold text-slate-800">{sector}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-[10px] text-slate-500 font-mono uppercase">FECHA DE AUDITORÍA</p>
                <p className="font-extrabold text-slate-800">{new Date().toISOString().split("T")[0]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Local Strategy Advisory or AI Content */}
        <div className="space-y-4">
          {aiReport ? (
            <div className="prose max-w-none text-xs text-slate-800">
              {renderFormattedReport(aiReport)}
            </div>
          ) : (
            <div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-xs text-slate-650 text-slate-600 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 mb-0.5">Vista Previa del Informe de Consultoría</p>
                  <p className="leading-relaxed">
                    Presione el botón <strong>&quot;Generar Informe IA&quot;</strong> situado arriba para invocar el motor de razonamiento de Gemini. Esto evaluará tus gaps en inyección de prompts, mitigación de sesgos, explicabilidad algorítmica y el flujo EAN organizadamente.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-3 mt-4">
                    1. Estado de la Gobernanza Tecnológica
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    La evaluación del proyecto <strong>{projectName || "Sin Nombre"}</strong> dentro del sector <strong>{sector}</strong> revela un Índice Global de Madurez Actual del <strong>{overallStats.activeMaturityScore}%</strong>, enfrentando una brecha absoluta promedio del <strong>{overallStats.gap}%</strong> frente a la meta estratégica promedio establecida en <strong>{overallStats.targetMaturityScore}%</strong>.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-3 mt-4">
                    2. Resumen Estratégico de Auditoría Algorítmica
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 shadow-xs">
                      <p className="font-bold text-sky-700 flex items-center gap-1.5 mb-2">
                        <BookmarkCheck className="w-4 h-4" /> Gobernanza de Sesgos & Datos
                      </p>
                      <p className="text-slate-500 leading-relaxed text-[11px]">
                        Implementación de revisiones de sesgo previas al despliegue. Configurar de forma mandatoria un framework técnico que realice sanidad de entradas estructuradas y anonimice PII.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 shadow-xs">
                      <p className="font-bold text-indigo-700 flex items-center gap-1.5 mb-2">
                        <BookmarkCheck className="w-4 h-4" /> Defensas de Ciberseguridad IA
                      </p>
                      <p className="text-slate-500 leading-relaxed text-[11px]">
                        Resguardar al agente frente a Prompt Injection activo utilizando validadores de moderado de salida en el backend (ej. Llama Guard), previniendo jailbreaks críticos corporativos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="gaps-list-container print:break-after-page">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-3 mt-4">
                    3. Listado de Control de Gaps Estratégicos Identificados
                  </h3>
                  <div className="space-y-2 text-xs">
                    {criticalGaps.length === 0 ? (
                      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-110 border-emerald-100 text-emerald-850 text-emerald-800 text-center font-medium">
                        No se detectaron brechas graves abiertas. El agente se encuentra optimizado.
                      </div>
                    ) : (
                      criticalGaps.slice(0, 5).map((gap, i) => (
                        <div key={gap.id} className="p-3 rounded-lg bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] shadow-xs">
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-sky-550 text-sky-600 mt-0.5 font-bold">0{i+1}.</span>
                            <div>
                              <p className="font-bold text-slate-900 leading-normal">{gap.name}</p>
                              <p className="text-slate-400 font-mono text-[10px] mt-0.5 font-normal">Ciclo EAN: {gap.phase}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 sm:self-center font-mono">
                            <span className="text-slate-500">Puntaje: <strong className="text-slate-800">{gap.current}%</strong></span>
                            <span className="text-indigo-650 text-indigo-600">Meta: <strong>{gap.target}%</strong></span>
                            <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 font-bold rounded text-[10px]">-{gap.gap}%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Footer */}
        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between text-[10px] font-mono text-slate-400">
          <p>EVALUADOR DE AGENTES IA &copy; {new Date().getFullYear()} - INFORME EAN & AUDITORÍA</p>
          <p className="mt-1 sm:mt-0">ESTRICTAMENTE CONFIDENCIAL / TOMA DE DECISIONES</p>
        </div>
      </div>
    </div>
  );
}
