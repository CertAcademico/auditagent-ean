import { useState, FormEvent } from "react";
import { ShieldCheck, GraduationCap, Mail, User, AlertCircle, Lock } from "lucide-react";
import { User as UserType } from "../types";

const ALLOWED_DOMAIN = "universidadean.edu.co";

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!name.trim() || name.trim().length < 3) return "Ingresa tu nombre completo (mínimo 3 caracteres).";
    if (!email.trim()) return "Ingresa tu correo institucional.";
    const emailLower = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) return "Correo electrónico no válido.";
    if (!emailLower.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return `Solo se permiten correos @${ALLOWED_DOMAIN}.`;
    }
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user: UserType = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("auditAgent_user", JSON.stringify(user));
      onLogin(user);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blur backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header card */}
        <div className="mb-6 p-6 bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-lg text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-xl shadow-md">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-[10px] font-bold font-mono text-sky-400 uppercase tracking-widest mb-1">
            EAN Gestión del Conocimiento + Auditoría IA
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ◈ AuditAgent <span className="text-sky-400 font-medium">IA</span>
          </h1>
          <p className="text-slate-400 text-xs mt-2">Plataforma académica · Universidad EAN</p>
        </div>

        {/* Login form card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Acceso Estudiantes</h2>
              <p className="text-[11px] text-slate-500">Usa tu correo institucional EAN</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. María García López"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`usuario@${ALLOWED_DOMAIN}`}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-sm font-bold shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Ingresar a la plataforma
                </>
              )}
            </button>
          </form>

          {/* Domain notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            Solo se admiten correos <span className="font-mono font-semibold text-slate-700">@{ALLOWED_DOMAIN}</span>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-5">
          &copy; {new Date().getFullYear()} Universidad EAN · Colombia
        </p>
      </div>
    </div>
  );
}
