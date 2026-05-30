import { useState } from "react";
import {
  ShieldCheck,
  ClipboardList,
  Activity,
  FileCheck2,
  HelpCircle as HelpIcon,
  BookOpen,
  Mail,
  GraduationCap,
  LogOut,
  UserCircle,
} from "lucide-react";

import AssessmentForm from "./components/AssessmentForm";
import GapDashboard from "./components/GapDashboard";
import MaturityGauge from "./components/MaturityGauge";
import ReportExporter from "./components/ReportExporter";
import EanAcademicGuide from "./components/EanAcademicGuide";
import LoginPage from "./components/LoginPage";
import { AssessmentResponse, AssessmentTarget, User } from "./types";
import { QUESTIONS, CATEGORIES } from "./data";

// ── Auth gate ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("auditAgent_user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  function handleLogout() {
    localStorage.removeItem("auditAgent_user");
    setUser(null);
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return <MainApp user={user} onLogout={handleLogout} />;
}

// ── Main application (all hooks live here, never conditionally) ──────────────
function MainApp({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"evaluacion" | "dashboard" | "estrategia" | "guia_ean">("evaluacion");

  const [responses, setResponses] = useState<AssessmentResponse>({
    aud_transparencia: 50,
    aud_sesgos: 25,
    aud_seguridad: 50,
    aud_privacidad: 25,
    mad_tecnologica: 75,
    mad_adopcion: 50,
    mer_hype: 50,
    mer_normativa: 25,
    mer_escalabilidad: 75,
    con_identificacion: 50,
    con_captura: 25,
    con_almacenamiento: 75,
    con_compartir: 25,
    con_aplicacion: 50,
  });

  const [targets, setTargets] = useState<AssessmentTarget>({
    auditoria: 80,
    madurez: 90,
    mercado: 80,
    conocimiento: 85,
  });

  const [projectName, setProjectName] = useState("Agente IA - Asistente de Atención Académica");
  const [sector, setSector] = useState("Educación / Academia");

  const handleResponseChange = (questionId: string, score: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleTargetChange = (categoryId: string, target: number) => {
    setTargets((prev) => ({ ...prev, [categoryId]: target }));
  };

  const overallStats = (() => {
    const categoriesList = ["auditoria", "madurez", "mercado", "conocimiento"];
    let sumCurrent = 0;
    let sumTarget = 0;
    categoriesList.forEach((catId) => {
      const catQuestions = QUESTIONS.filter((q) => q.category === catId);
      const catSum = catQuestions.reduce((acc, q) => acc + (responses[q.id] || 0), 0);
      sumCurrent += catQuestions.length > 0 ? catSum / catQuestions.length : 0;
      sumTarget += targets[catId] || 80;
    });
    return {
      activeMaturityScore: Math.round(sumCurrent / categoriesList.length),
      targetMaturityScore: Math.round(sumTarget / categoriesList.length),
    };
  })();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-sky-500/20 selection:text-sky-900">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none no-print" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none no-print" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <header className="mb-8 p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 no-print text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-xl shadow-md">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono text-sky-400 bg-slate-900/80 px-2.5 py-0.5 rounded border border-sky-500/20 uppercase tracking-widest">
                EAN Gestión del Conocimiento + Auditoría IA
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5 leading-none">
                ◈ AuditAgent <span className="text-sky-400 font-medium">IA</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Maturity badges */}
            <div className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <div className="text-left">
                <p className="text-[9px] text-slate-400 font-mono uppercase">Madurez Global</p>
                <p className="text-xs font-bold text-white font-mono">{overallStats.activeMaturityScore}%</p>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-indigo-400" />
              <div className="text-left">
                <p className="text-[9px] text-slate-400 font-mono uppercase">Meta Corporativa</p>
                <p className="text-xs font-bold text-white font-mono">{overallStats.targetMaturityScore}%</p>
              </div>
            </div>

            {/* User chip + logout */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-[#334155]">
              <UserCircle className="w-3.5 h-3.5 text-green-400" />
              <div className="text-left">
                <p className="text-[9px] text-slate-400 font-mono uppercase">Sesión activa</p>
                <p className="text-xs font-semibold text-white truncate max-w-[140px]">{user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:bg-red-900/40 hover:border-red-500/40 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400" />
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-print">
          {(
            [
              { id: "evaluacion", label: "1. Evaluación Interactiva", icon: <ClipboardList className="w-4 h-4" /> },
              { id: "dashboard", label: "2. Dashboard de Brechas", icon: <Activity className="w-4 h-4" /> },
              { id: "estrategia", label: "3. Informe & Consultoría Especializada", icon: <FileCheck2 className="w-4 h-4" /> },
              { id: "guia_ean", label: "4. Guía EAN (Estudiantes)", icon: <GraduationCap className="w-4 h-4 text-indigo-500" /> },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-sky-500 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="col-span-1 lg:col-span-8 space-y-8">
            {activeTab === "evaluacion" && (
              <AssessmentForm
                responses={responses}
                targets={targets}
                projectName={projectName}
                sector={sector}
                onResponseChange={handleResponseChange}
                onTargetChange={handleTargetChange}
                onProjectNameChange={setProjectName}
                onSectorChange={setSector}
              />
            )}
            {activeTab === "dashboard" && (
              <GapDashboard responses={responses} targets={targets} />
            )}
            {activeTab === "estrategia" && (
              <ReportExporter
                responses={responses}
                targets={targets}
                projectName={projectName}
                sector={sector}
                onRestoreState={(state) => {
                  setResponses(state.responses);
                  setTargets(state.targets);
                  setProjectName(state.projectName);
                  setSector(state.sector);
                }}
              />
            )}
            {activeTab === "guia_ean" && (
              <EanAcademicGuide
                projectName={projectName}
                sector={sector}
                overallMaturityScore={overallStats.activeMaturityScore}
                overallTargetScore={overallStats.targetMaturityScore}
                gapScore={Math.max(0, overallStats.targetMaturityScore - overallStats.activeMaturityScore)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-1 lg:col-span-4 space-y-6 sidebar-print no-print animate-fade-in">
            <MaturityGauge
              score={overallStats.activeMaturityScore}
              target={overallStats.targetMaturityScore}
            />

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-500" /> Resumen de Dimensiones
              </h3>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => {
                  const qs = QUESTIONS.filter((q) => q.category === cat.id);
                  const score = Math.round(
                    qs.reduce((acc, q) => acc + (responses[q.id] || 0), 0) / (qs.length || 1)
                  );
                  const target = targets[cat.id] || 80;
                  const percent = Math.min(100, Math.max(0, (score / target) * 100));
                  return (
                    <div key={cat.id} className="text-xs">
                      <div className="flex justify-between items-center mb-1 text-[11px]">
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                        <div className="font-mono flex items-center gap-2">
                          <span className="text-sky-600 font-bold">{score}%</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-indigo-600 font-semibold">{target}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider font-mono mb-2.5 flex items-center gap-2">
                <HelpIcon className="w-4 h-4 text-indigo-500" /> Metodología EAN
              </h4>
              <p className="leading-relaxed mb-4 text-slate-500">
                La Universidad EAN promueve que la adopción de IA transforme el conocimiento implícito de expertos en sistemas continuos de innovación empresarial.
              </p>
              <div className="space-y-3 text-[11px] leading-relaxed border-t border-slate-200 pt-3.5 text-slate-600">
                {[
                  ["1. Identificación", "Mapear y depurar fuentes para alimentar el RAG de IA de forma estructurada."],
                  ["2. Captura", "Guardar feedback tácito y realizar corrección cruzada semanal (RLHF)."],
                  ["3. Almacenamiento", "Utilizar bóvedas seguras de embeddings vectoriales controlando el Copyright."],
                  ["4. Compartir", "Fomentar una cultura corporativa de Prompt Engineering sin silos de datos."],
                  ["5. Aplicación", "Integrar automatizaciones de IA y medir el beneficio operativo directo."],
                ].map(([title, desc]) => (
                  <div key={title}>
                    <span className="text-slate-900 font-bold block">{title}</span>
                    {desc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between text-xs text-slate-500 font-sans tracking-wide no-print">
          <p>&copy; {new Date().getFullYear()} Plataforma AuditAgent. Universidad EAN, Colombia.</p>
          <div className="flex gap-4 mt-2 sm:mt-0 items-center">
            <a href="mailto:emanuel.ortiz@policia.edu.co" className="hover:text-sky-600 flex items-center gap-1 font-semibold">
              <Mail className="w-3.5 h-3.5" /> Soporte Académico
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
