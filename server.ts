import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT || 3000);

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

async function main() {
  const app = express();
  app.use(express.json());

  // API endpoint for AI Strategic Analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const {
        projectName,
        sector,
        categories,
        overallStats,
        criticalGaps,
      } = req.body;

      // Log parameters safely
      console.log(`Analyzing project: ${projectName || "Unnamed"} (${sector || "N/A"})`);

      const ai = getGeminiClient();

      if (!ai) {
        // Return structured mock/local backup response if API key is not configured yet
        return res.json({
          success: true,
          isAI: false,
          report: `### ⚠️ Consultoría en Modo Local (API Key de Gemini no configurada en Secrets)

El cliente de IA no se ha inicializado porque no se detectó una clave API válida (\`GEMINI_API_KEY\`) en los secretos del entorno. Para habilitar la potencia completa de la consultoría algorítmica impulsada por Gemini, por favor configure su clave API desde el panel **Settings > Secrets**.

Sin embargo, en base a la metodología de **Gestión del Conocimiento de la Universidad EAN** y **Auditoría Algorítmica**, aquí tiene el análisis estructural e instructivo inmediato para el proyecto **${projectName || "Agente de IA"}**:

#### 1. Análisis de Brechas y Situación Actual (${sector || "Sector General"})
* **Índice Global de Madurez y Apropiación:** **${overallStats?.activeMaturityScore || 0}%** (Meta deseada: **${overallStats?.targetMaturityScore || 0}%**)
* **Brecha Absoluta de Conocimiento Organizacional:** **${overallStats?.gap || 0}%** de déficit.

#### 2. Diagnóstico de Gaps Críticos Identificados
${
  criticalGaps && criticalGaps.length > 0
    ? criticalGaps
        .map(
          (gap: any) =>
            `* **Categoría: ${gap.name}**
  * Puntaje Actual: \`${gap.current}%\` | Meta: \`${gap.target}%\` | Brecha: \`-${gap.gap}%\`
  * **Recomendación de Gestión del Conocimiento**: Es prioritario mejorar la transferencia de competencias en esta división. Desarrollar manuales técnicos e implementar logs de auditoría estructurados con regularidad semanal en la fase del ciclo de **${gap.phase || "Identificación y Captura"}.**`
        )
        .join("\n")
    : "* No se detectaron brechas graves. Su agente de IA se encuentra actualmente optimizado y perfectamente integrado al flujo de conocimiento organizacional."
}

#### 3. Auditoría Algorítmica y Mitigación de Riesgos
* **Transparencia y Explicabilidad:** Para cerrar la brecha en transparencia, es mandatorio generar fichas de modelo (Model Cards) y documentar los conjuntos de datos de entrenamiento (Data Cards).
* **Sesgos e Imparcialidad:** Se sugiere implementar pruebas automatizadas mensuales con métricas de equidad demográfica en el agente si procesa decisiones humanas directas.
* **Ciberseguridad y Robustez:** Active salvaguardas perimetrales estrictas ante ataques de inyección de prompts (Prompt Injection) y configure un filtro moderador de entrada y salida (Llama Guard / agentes intermedios).

#### 4. Plan de Acción Recomendado (0-90 días)
1. **Fase 1: Mapeo e Identificación (Días 1-30):** Documentar detalladamente los flujos de toma de decisiones del agente de IA y mapear los repositorios de conocimiento impactados.
2. **Fase 2: Almacenamiento y Estructuración (Días 31-60):** Almacenar los logs del agente bajo la infraestructura de ciberseguridad corporativa. Diseñar capacitaciones específicas para el personal que opera el agente.
3. **Fase 3: Mitigación Algorítmica (Días 61-90):** Ejecutar pruebas de auditoría algorítmica y ajustar parámetros del sistema para reducir falsos positivos/negativos.`,
        });
      }

      // If AI exists, prompt Gemini with the assessment results in detail to get a stellar analysis!
      const systemInstruction = `Eres un auditor algorítmico sénior, consultor de adopción de Inteligencia Artificial y experto en la metodología de Gestión del Conocimiento según la Universidad EAN de Colombia.
Tu labor es brindar un informe de consultoría estratégica y de auditoría altamente detallado, formal, riguroso y en español.
Debes usar tipografía y estructura rica (títulos claros, negritas, bloques de código para ejemplos prácticos o checklists formativas de auditoría).
Enfócate en alinear los resultados de la evaluación con el ciclo de Gestión del Conocimiento (Identificación, Captura, Almacenamiento, Compartir, Aplicación) y las dimensiones clave de la Auditoría Algorítmica (Sesgos, Explicabilidad, Privacidad y Ciberseguridad).`;

      const prompt = `Analiza los siguientes puntajes de evaluación sobre la implementación de un agente de IA:
Proyecto: ${projectName || "Sin Nombre"}
Sector de la Organización: ${sector || "Sector General"}

Estadísticas Generales:
- Madurez Actual Promedio: ${overallStats?.activeMaturityScore || 0}%
- Meta Deseada Promedio: ${overallStats?.targetMaturityScore || 0}%
- Brecha Promedio (Gap): ${overallStats?.gap || 0}%

Detalle por Categorías de la Evaluación:
${JSON.stringify(categories, null, 2)}

Brechas Críticas Detectadas (Gap de mayor a menor):
${JSON.stringify(criticalGaps, null, 2)}

Por favor elabora un informe estratégico detallado con la siguiente estructura:
1. **ANÁLISIS EJECUTIVO Y MAPEO DE MADUREZ**: Diagnóstico general de la implementación del Agente de IA y su nivel de preparación organizacional.
2. **AUDITORÍA ALGORÍTMICA PROFUNDA**: Evaluación técnica detallada de los riesgos asociados (especialmente en Transparencia, Sesgos, Seguridad contra Inyección de Prompts y Privacidad de Datos). Proporciona metodologías de mitigación específicas que el equipo de desarrollo de IA debe seguir.
3. **DIAGNÓSTICO BAJO LA METODOLOGÍA DE GESTIÓN DEL CONOCIMIENTO (EAN)**: Detalla cómo se aplican las 5 fases del ciclo (Identificación, Captura, Almacenamiento, Compartir, Aplicación) en el agente evaluado para garantizar la apropiación del conocimiento en la organización.
4. **PLAN DE ACCIÓN DE BRECHAS (0 - 90 DÍAS)**: Un mapa de ruta dividido en 3 fases mensuales con acciones puntuales, entregables requeridos y roles responsables (p. ej., Auditor de IA, Ingeniero de Datos, Gestor de Conocimiento) para solucionar los gaps estratégicos.
5. **CONCLUSIÓN E INDICADORES DE ÉXITO (KPIs)**: 2 a 3 métricas de rendimiento claves para monitorear el cierre de las brechas.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        success: true,
        isAI: true,
        report: response.text,
      });

    } catch (error: any) {
      console.error("Analysis route error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error interno del servidor",
      });
    }
  });

  // Serve static assets or mount Vite in development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on port ${PORT} (isProduction: ${isProduction})`);
  });
}

main().catch((err) => {
  console.error("Critical server failure:", err);
  process.exit(1);
});
