import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  TrendingUp,
  Globe,
  Network,
  Info,
  Target,
  ArrowRight,
  ArrowLeft,
  Settings,
  Briefcase,
  Layers,
} from "lucide-react";
import { CATEGORIES, QUESTIONS } from "../data";
import { AssessmentResponse, AssessmentTarget, CategoryId, Question } from "../types";

interface AssessmentFormProps {
  responses: AssessmentResponse;
  targets: AssessmentTarget;
  projectName: string;
  sector: string;
  onResponseChange: (questionId: string, score: number) => void;
  onTargetChange: (categoryId: string, target: number) => void;
  onProjectNameChange: (name: string) => void;
  onSectorChange: (sector: string) => void;
}

const ICON_MAP: Record<string, any> = {
  ShieldCheck: ShieldCheck,
  TrendingUp: TrendingUp,
  Globe: Globe,
  Network: Network,
};

const SECTORS = [
  "Servicios Públicos / Gobierno",
  "Fuerzas de Seguridad / Defensa",
  "Educación / Academia",
  "Banca / Finanzas",
  "Salud / Medicina",
  "Tecnología / Software",
  "Comercio / Consultoría",
  "Otro Sector",
];

export default function AssessmentForm({
  responses,
  targets,
  projectName,
  sector,
  onResponseChange,
  onTargetChange,
  onProjectNameChange,
  onSectorChange,
}: AssessmentFormProps) {
  const [activeTab, setActiveTab] = useState<CategoryId>("auditoria");

  // Filter questions for active tab
  const tabQuestions = QUESTIONS.filter((q) => q.category === activeTab);

  // Calculate current progress: how many questions answered
  const totalQuestions = QUESTIONS.length;
  const answeredCount = QUESTIONS.filter((q) => responses[q.id] !== undefined).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Tab navigation helpers
  const tabIds = CATEGORIES.map((c) => c.id);
  const currentTabIndex = tabIds.indexOf(activeTab);

  const nextTab = () => {
    if (currentTabIndex < tabIds.length - 1) {
      setActiveTab(tabIds[currentTabIndex + 1]);
    }
  };

  const prevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabIds[currentTabIndex - 1]);
    }
  };

  // Helper to find the closest matching rubric level
  const getLevelInfo = (question: Question, value: number) => {
    // Exact match or closest lower bound
    const sortedLevels = [...question.levels].sort((a, b) => b.score - a.score);
    const matched = sortedLevels.find((level) => value >= level.score);
    return matched || question.levels[0];
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
      {/* Step 1: Metadata inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-sky-500" /> Nombre del Proyecto / Agente IA
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="ej. Agente de Soporte Técnico EAN, Guard_V1, etc."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans placeholder-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-sky-500" /> Sector de la Organización
          </label>
          <select
            value={sector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-500" /> Progreso de la Evaluación
          </span>
          <span className="text-sky-600 font-bold">{answeredCount} de {totalQuestions} completados ({progressPercent}%)</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 border border-slate-200 p-1.5 rounded-xl">
        {CATEGORIES.map((cat) => {
          const ActiveIcon = ICON_MAP[cat.icon];
          const isSelected = activeTab === cat.id;

          // count answered in this category
          const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
          const catAnswered = catQuestions.filter((q) => responses[q.id] !== undefined).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isSelected
                  ? "bg-[#0F172A] text-white border border-[#1E293B] shadow"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"
              }`}
            >
              <ActiveIcon className={`w-4 h-4 ${isSelected ? "text-sky-400" : "text-slate-400"}`} />
              <div className="text-center md:text-left">
                <p className="whitespace-nowrap">{cat.name}</p>
                <span className="text-[9px] text-slate-400 font-mono font-normal">
                  ({catAnswered}/{catQuestions.length})
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Description of active Tab */}
      <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-550 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-900 mb-0.5">
            Sección: {CATEGORIES.find((c) => c.id === activeTab)?.name}
          </p>
          <p className="leading-relaxed">
            {CATEGORIES.find((c) => c.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {tabQuestions.map((q) => {
              const currentValue = responses[q.id] || 0;
              const level = getLevelInfo(q, currentValue);

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-350 hover:border-slate-350 hover:shadow-xs transition-colors duration-300"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 tracking-wide">{q.label}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{q.desc}</p>
                    </div>
                    {/* Score badge */}
                    <span className="px-2.5 py-1 rounded bg-sky-50 text-sky-700 font-bold text-xs font-mono border border-sky-100 shrink-0">
                      {currentValue}%
                    </span>
                  </div>

                  {/* Range Slider */}
                  <div className="my-6">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="25"
                      value={currentValue}
                      onChange={(e) => onResponseChange(q.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    {/* Tick labels */}
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                      <span>0% (Inexistente)</span>
                      <span>25%</span>
                      <span>50% (Media)</span>
                      <span>75%</span>
                      <span>100% (Óptimo)</span>
                    </div>
                  </div>

                  {/* Adaptive Rubric Level Box */}
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex gap-3 mt-4 items-start transition-all duration-300 box-shadow-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0 mt-1.5 animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-sky-700">
                        Nivel {level.score}%: {level.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {level.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Target setting per Category */}
      <div className="mt-8 p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-110 border-indigo-200 text-indigo-600 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-slate-900 text-left uppercase tracking-wider mb-0.5">
              Establecer Meta Deseada (Target)
            </h4>
            <p className="text-xs text-slate-500 text-left leading-relaxed">
              Define el nivel de aspiración estratégica corporativa para la sección{" "}
              <strong>{CATEGORIES.find((c) => c.id === activeTab)?.name}</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-end">
          <input
            type="range"
            min="50" // Goals should usually be ambitious
            max="100"
            step="10"
            value={targets[activeTab] || 80}
            onChange={(e) => onTargetChange(activeTab, parseInt(e.target.value))}
            className="w-40 sm:w-48 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-505 accent-indigo-500"
          />
          <span className="w-12 text-right text-sm font-mono font-bold text-indigo-700">
            {targets[activeTab] || 80}%
          </span>
        </div>
      </div>

      {/* Bottom Nav indicators */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={prevTab}
          disabled={currentTabIndex === 0}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-800 transition disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>
        <span className="text-[11px] font-mono text-slate-400">
          Sección {currentTabIndex + 1} de {tabIds.length}
        </span>
        <button
          onClick={nextTab}
          disabled={currentTabIndex === tabIds.length - 1}
          className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 hover:text-sky-600 transition disabled:opacity-30 disabled:pointer-events-none"
        >
          Siguiente <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
