import { motion } from "motion/react";
import { Award, Zap } from "lucide-react";

interface MaturityGaugeProps {
  score: number;
  target: number;
}

export default function MaturityGauge({ score, target }: MaturityGaugeProps) {
  const roundedScore = Math.round(score);
  const roundedTarget = Math.round(target);
  const strokeDashoffset = 282.7 - (282.7 * Math.min(score, 100)) / 100;

  // Let's determine descriptive label
  let statusText = "Inicial";
  let statusColor = "text-rose-400";
  let bgGradient = "from-rose-500/10 to-transparent";
  let borderGlow = "shadow-rose-500/20";

  if (score >= 80) {
    statusText = "Optimizado y Apropiado";
    statusColor = "text-emerald-600";
    bgGradient = "from-emerald-50 to-transparent";
    borderGlow = "";
  } else if (score >= 60) {
    statusText = "Gestionado e Integrado";
    statusColor = "text-sky-600";
    bgGradient = "from-sky-50 to-transparent";
    borderGlow = "";
  } else if (score >= 40) {
    statusText = "Definido y Controlado";
    statusColor = "text-amber-600";
    bgGradient = "from-amber-50 to-transparent";
    borderGlow = "";
  } else if (score >= 20) {
    statusText = "Reactivo y Repetitivo";
    statusColor = "text-orange-600";
    bgGradient = "from-orange-50 to-transparent";
    borderGlow = "";
  }

  return (
    <div className={`p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center transition-all duration-500 h-full`}>
      <div className="flex items-center gap-2 mb-4 self-start">
        <Zap className="w-5 h-5 text-sky-500" />
        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase font-mono">
          Índice de Apropiación & Madurez Global
        </h3>
      </div>

      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        {/* Outer background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-100"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Target marker (dotted overlay) if target exists */}
          {target > 0 && (
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-indigo-500/20"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              fill="transparent"
            />
          )}
          {/* Active progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-sky-500"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDashoffset: 282.7 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              strokeDasharray: "282.7",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-4xl font-black tracking-tight text-slate-900 font-mono"
            key={roundedScore}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {roundedScore}%
          </motion.span>
          <span className="text-[11px] font-mono text-slate-500 mt-0.5">
            Meta: {roundedTarget}%
          </span>
        </div>
      </div>

      <div className="text-center mt-3">
        <p className={`text-sm font-black ${statusColor} tracking-wide`}>
          ◈ {statusText}
        </p>
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
          Basado en la integración de auditoría algorítmica y el flujo de gestión del conocimiento organizacional.
        </p>
      </div>

      <div className="mt-5 w-full pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="border-r border-slate-105 border-slate-100 py-1">
          <p className="text-slate-500 font-medium">Brecha</p>
          <p className="text-lg font-black text-slate-800 font-mono mt-0.5">
            {Math.max(0, roundedTarget - roundedScore)}%
          </p>
        </div>
        <div className="py-1">
          <p className="text-slate-500 font-medium">Adopción</p>
          <div className="flex items-center justify-center gap-1 text-emerald-600 mt-1 font-black">
            <Award className="w-3.5 h-3.5" />
            <span className="font-mono">
              {score >= 80 ? "Óptimo" : score >= 50 ? "Estable" : "Acción"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
