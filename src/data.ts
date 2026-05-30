import { CategoryInfo, Question } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "auditoria",
    name: "Auditoría Algorítmica",
    icon: "ShieldCheck",
    description: "Evaluación de transparencia de sesgos, explicabilidad técnica, robustez de prompt injection y seguridad de datos sensibles.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "madurez",
    name: "Madurez y Adopción",
    icon: "TrendingUp",
    description: "Evaluación de la confiabilidad ingenieril objetiva del agente de IA y el nivel de apropiación práctica de los usuarios operacionales.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "mercado",
    name: "Expectativas y Viabilidad",
    icon: "Globe",
    description: "Análisis del balance entre expectativas (hype) vs. valor de negocio real, adaptabilidad a la regulación y competitividad técnica.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "conocimiento",
    name: "Gestión del Conocimiento",
    icon: "Network",
    description: "Alineación con el ciclo estratégico de la Universidad EAN: Identificación, Captura, Almacenamiento, Compartir y Aplicación del saber.",
    color: "from-orange-500 to-amber-600",
  },
];

export const QUESTIONS: Question[] = [
  // 1. Auditoría Algorítmica
  {
    id: "aud_transparencia",
    category: "auditoria",
    label: "Transparencia y Explicabilidad",
    desc: "¿Es posible reconstruir y explicar las decisiones y razonamientos del agente de IA al usuario final o auditores regulatorios?",
    levels: [
      { score: 0, title: "Caja Negra Absoluta", description: "No hay registros de trazabilidad sobre cómo procesa el modelo los prompts ni por qué genera ciertas respuestas." },
      { score: 25, title: "Trazabilidad Básica", description: "Se registran los textos de entrada e historial de chats, pero no los parámetros de prompts del sistema ni contextos recuperados." },
      { score: 50, title: "Explicabilidad Parcial", description: "Se incluye guía general del prompt del sistema base y documentación teórica de las fuentes de datos consultadas." },
      { score: 75, title: "Mapeo Semántico", description: "Mecanismo para inspeccionar las fuentes RAG exactas consultadas por el agente de IA para fundamentar cada respuesta generada." },
      { score: 100, title: "Explicabilidad Completa", description: "Mecanismo en tiempo real asistido por Model Cards y plantillas de prompts auditables que explican matemáticamente la veracidad." },
    ],
  },
  {
    id: "aud_sesgos",
    category: "auditoria",
    label: "Mitigación de Sesgos e Imparcialidad",
    desc: "¿Se controlan activamente los sesgos cognitivos, discriminativos o demográficos en el comportamiento cognitivo del agente de IA?",
    levels: [
      { score: 0, title: "Sin Supervisión de Equidad", description: "El agente hereda sesgos inherentes de entrenamiento sin filtros. Respuestas discriminatorias latentes no son medidas." },
      { score: 25, title: "Supervisión Reactiva", description: "Solo se realizan correcciones empíricas urgentes mediante modificación manual de prompts cuando los usuarios reportan quejas." },
      { score: 50, title: "Evaluación Pre-Despliegue", description: "Se realiza un test preliminar de toxicidad y sesgos utilizando bancos de pruebas de ejemplo antes de publicar el modelo." },
      { score: 75, title: "Auditoría Sistemática", description: "Se ejecutan pruebas mensuales con proxies poblacionales y filtros de censura semántica activa de sesgo." },
      { score: 100, title: "Equidad Proactiva y Continua", description: "Monitoreo automatizado con Fairness Toolkits, supervisión humana continua de sesgos e informes abiertos de equidad semántica." },
    ],
  },
  {
    id: "aud_seguridad",
    category: "auditoria",
    label: "Ciberseguridad y Resistencia a Ataques",
    desc: "¿Qué tan resistente es el agente a ataques de Prompt Injection, Jailbreaking, alteración de la memoria semántica o fugas de logs?",
    levels: [
      { score: 0, title: "Vulnerable por Diseño", description: "El usuario puede suplantar las directrices del sistema pidiéndole al agente que ignore sus instrucciones principales o revele información sensible." },
      { score: 25, title: "Filtros Estáticos Simples", description: "Validaciones rudimentarias en la entrada mediante listas negras de palabras clave que son fácilmente eludibles con paráfrasis." },
      { score: 50, title: "Estructuración de Prompts", description: "Uso de delimitadores robustos de datos de usuario en la capa de inferencia y prompts de pre-análisis básicos." },
      { score: 75, title: "Filtro Bidireccional Activo", description: "Modelos independientes (ej. Llama Guard) supervisando las entradas de usuario y salidas del agente en tiempo real." },
      { score: 100, title: "Cúpula de Seguridad Completa", description: "Inmunidad evaluada por Red Teaming frecuente, aislamiento lógico de flujos de código, filtrado de fugas de datos y control de accesos estricto." },
    ],
  },
  {
    id: "aud_privacidad",
    category: "auditoria",
    label: "Privacidad y Sanitización de Datos",
    desc: "¿Cómo se previenen las filtraciones de datos sensibles identificables (PII) recopilados por el agente de IA?",
    levels: [
      { score: 0, title: "Exposición Directa", description: "Toda la conversación, incluyendo datos personales e identificadores sensibles de clientes, se guarda en planos compartidos sin procesar." },
      { score: 25, title: "Acuerdos Corporativos", description: "Se depende exclusivamente de los acuerdos de privacidad del proveedor externo de las LLMs para evitar malas prácticas de resguardo." },
      { score: 50, title: "Saneamiento Manual/Reglas", description: "Se instruye al agente en su prompt de sistema a no solicitar ni retener información delicada de tarjetas o contraseñas." },
      { score: 75, title: "Sanitización Automatizada", description: "Filtros técnicos previos de detección de PII (anonimización vía expresiones regulares y Named Entity Recognition) antes de almacenar logs." },
      { score: 100, title: "Privacidad por Diseño", description: "Sanitización absoluta, almacenamiento de datos encriptado localmente, cero procesamiento externo de PII, y automoderación de borrado rápido." },
    ],
  },

  // 2. Madurez y Adopción
  {
    id: "mad_tecnologica",
    category: "madurez",
    label: "Evolución y Madurez Tecnológica",
    desc: "Evaluación objetiva de la estabilidad del motor cognitivo, porcentaje de alucinaciones y precisión de respuestas.",
    levels: [
      { score: 0, title: "Prototipo Alucinatorio", description: "Modelos básicos sin grounding semántico que alucinan fechas, datos ficticios u operaciones matemáticas constantemente." },
      { score: 25, title: "Grounding Inicial", description: "RAG rudimentario en motores de búsqueda simples con verificaciones manuales ocasionales por revisores internos de la empresa." },
      { score: 50, title: "Validación de Hechos (Fact-Checking)", description: "Procesos dinámicos que guían respuestas citando fuentes. Tasa de respuestas verídicas superior al 80%." },
      { score: 75, title: "Integración Multisistema", description: "Múltiples agentes especializados interactuando con bases estructuradas y guardas activas de verosimilitud de datos." },
      { score: 100, title: "Madurez Cognitiva Óptima", description: "Auto-verificaciones integradas de coherencia semántica, tasa de alucinación virtualmente inexistente y métricas continuas de éxito cognitivo." },
    ],
  },
  {
    id: "mad_adopcion",
    category: "madurez",
    label: "Apropiación y Adopción por Usuarios",
    desc: "¿Qué tan arraigado está el uso práctico cotidiano del agente en la fuerza laboral y los clientes finales?",
    levels: [
      { score: 0, title: "Resistencia e Indiferencia", description: "Los empleados perciben la IA con desconfianza u hostilidad y siguen utilizando métodos manuales analógicos alternativos." },
      { score: 25, title: "Consulta Esporádica", description: "Se utiliza solo de forma voluntaria para tareas informales no integradas en el flujo procedimental oficial." },
      { score: 50, title: "Capacitación Básica", description: "El personal está obligado a usar la IA; entienden el flujo operativo general pero no dominan el Prompt Engineering ni la optimización." },
      { score: 75, title: "Apropiación Colaborativa", description: "Uso diario, propuestas activas de mejora por equipos operacionales y percepción clara de que la IA aumenta la productividad." },
      { score: 100, title: "Cultura Digital Cohesiva", description: "Apropiación absoluta respaldada por retroalimentación cruzada. El agente es un co-equipero indispensable en la empresa." },
    ],
  },

  // 3. Expectativas y Viabilidad
  {
    id: "mer_hype",
    category: "mercado",
    label: "Viabilidad de Negocio vs. Hype del Mercado",
    desc: "¿El agente responde a una justificación financiera objetiva de retorno de inversión o es fruto del furor tecnológico?",
    levels: [
      { score: 0, title: "Moda Tecnológica Pura", description: "Despliegues sin análisis de rentabilidad, con costos de computación desmedidos y sin métricas cuantitativas de éxito." },
      { score: 25, title: "Justificación Cualitativa", description: "Argumentos orientados a la 'innovación de marca' o 'modernidad corporativa' sin estudios de coste-beneficio reales." },
      { score: 50, title: "Retorno Estimado (ROI)", description: "Estudio base de optimización de tiempos o ahorro de personal proyectado a mediano plazo frente al costo de APIs." },
      { score: 75, title: "Sostenibilidad Operativa", description: "Métricas probadas de reducción de errores y descongestión de soporte redundante que cubren el presupuesto tecnológico anual." },
      { score: 100, title: "Rentabilidad Máxima Optimizada", description: "Aumento cuantitativo auditado del flujo de caja o productividad del 35%+, respaldado por arquitectura técnica costo-eficiente." },
    ],
  },
  {
    id: "mer_normativa",
    category: "mercado",
    label: "Resiliencia Normativa y Regulación",
    desc: "¿Está el agente preparado éticamente para adaptarse a las reformas legislativas globales o locales de Inteligencia Artificial?",
    levels: [
      { score: 0, title: "Ignorancia Normativa", description: "No se consideran riesgos de derechos de autor corporativos, normativas de protección del consumidor ni éticas." },
      { score: 25, title: "Conciencia Declarativa", description: "Políticas generales de cumplimiento que no se traducen en controles de código o límites reales de su comportamiento." },
      { score: 50, title: "Adaptación por Prompt", description: "Capacidad de reformar el comportamiento del agente mediante retoques rápidos de directivas éticas en el prompt base." },
      { score: 75, title: "Filtros de Cumplimiento", description: "Aislamiento de bases RAG con contenido bajo Copyright y controles estrictos homologables con normativas de protección." },
      { score: 100, title: "Compliance Dinámico Integrado", description: "Auditoría automatizada permanente, total adaptabilidad legislativa y un proceso de actualización ética documentado." },
    ],
  },
  {
    id: "mer_escalabilidad",
    category: "mercado",
    label: "Escalabilidad y Potencial de Crecimiento",
    desc: "¿Qué tan preparado está el agente para soportar un incremento multiplicador en las demandas operativas simultáneas?",
    levels: [
      { score: 0, title: "Bloqueo Operativo Severo", description: "La infraestructura se bloquea o eleva los tiempos de respuesta al superar unos pocos usuarios simultáneos de consulta regular." },
      { score: 25, title: "Escalado Manual Complejo", description: "La escalabilidad requiere que los desarrolladores aprovisionen servidores o API keys adicionales con altos tiempos de interrupción." },
      { score: 50, title: "Escalado Elástico Cloud", description: "Soporte basado en servicios cloud con auto-escalado de peticiones, aunque expuesto a costes imprevistos elevados." },
      { score: 75, title: "Optimización de Consultas", description: "Caché de consultas semánticas previas, balanceo inteligente y selección dinámica de modelos ligeros para solicitudes simples." },
      { score: 100, title: "Escalabilidad Autogestionada", description: "Costo por consulta optimizado óptimo, tolerancia a fallos distribuida y compatibilidad nativa con concurrencias masivas globales." },
    ],
  },

  // 4. Gestión del Conocimiento (EAN)
  {
    id: "con_identificacion",
    category: "conocimiento",
    label: "Identificación de Fuentes de Conocimiento",
    desc: "¿Se mapeó con rigurosidad qué procesos, manuales y sabiduría interna nutre y alimenta al Agente de IA?",
    levels: [
      { score: 0, title: "Inexistencia de Mapeo", description: "Entrenado de forma desordenada con archivos dispersos guardados sin clasificar, ignorando la ontología corporativa real." },
      { score: 25, title: "Mapeo Selectivo Básico", description: "Se recopilan manuales oficiales básicos en un gestor documental de RAG simple sin examinar la obsolescencia técnica." },
      { score: 50, title: "Gobernanza General de Datos", description: "Hay un inventario básico de qué documentos internos forman parte del contexto que se le provee al agente." },
      { score: 75, title: "Integración de Conocimiento Tácito", description: "Mapeo de la sabiduría informal de los empleados seniors mediante diagramas y flujos de acción inyectados digitalmente en RAG." },
      { score: 100, title: "Ontología Organizacional Completa", description: "Actualización automática de taxonomía de conocimientos, descarte de información obsoleta y gobernanza estricta verificable." },
    ],
  },
  {
    id: "con_captura",
    category: "conocimiento",
    label: "Captura de Conocimiento en Interacción",
    desc: "¿La organización registra activamente el conocimiento emergente a partir de fallas o aportes corregidos por expertos?",
    levels: [
      { score: 0, title: "Cero Captura de Residuos", description: "Las interacciones finales e incidentes no se almacenan para retroalimentación ni asimilación en el sistema central." },
      { score: 25, title: "Log de Errores Crudos", description: "Existen registros de errores caídos del sistema técnico de servidores, pero no de la calidad semántica evaluada del agente." },
      { score: 50, title: "Feedback del Usuario Básica", description: "Inclusión del botón 'Me gusta/No me gusta' que notifica fallas genéricas a un buzón sin sistematización alguna." },
      { score: 75, title: "Comités de Revisión del Saber", description: "Evaluaciones semanales de conversaciones fallidas por personal corporativo para robustecer continuamente las fuentes base." },
      { score: 100, title: "Bucle de Refuerzo Integral (RLHF)", description: "Captura automatizada, clasificación prioritaria de inconsistencias de conocimiento y reentrenamiento semántico asistido por expertos." },
    ],
  },
  {
    id: "con_almacenamiento",
    category: "conocimiento",
    label: "Almacenamiento y Categorización Segura",
    desc: "¿Tiene la empresa una estructura formal y cibersegura de repositorios y bases de embeddings relacionales?",
    levels: [
      { score: 0, title: "Caos Digital Descentralizado", description: "Los modelos de embeddings y orígenes de datos están guardados en servidores locales de desarrolladores externos no controlados." },
      { score: 25, title: "Resguardo Compartido Estándar", description: "Almacenados en carpetas restringidas estándar dentro de servicios cloud comerciales de uso diario." },
      { score: 50, title: "Base de Datos de Vectores (Vector DB)", description: "Base de datos vectorial centralizada y segmentada por permisos de acceso sencillos basados en roles (RBAC)." },
      { score: 75, title: "Gobernanza y Versionado de Embeddings", description: "Versionado continuo y robusto del conocimiento almacenado. Copias de seguridad periódicas cifradas y seguras contra robo semántico." },
      { score: 100, title: "Bóveda Cognitiva Máxima", description: "Repositorio semántico con encriptación avanzada en reposo y tránsito, auditoría de logs inmutables de consulta e indexación en base segura." },
    ],
  },
  {
    id: "con_compartir",
    category: "conocimiento",
    label: "Socialización, Difusión y Capacitación",
    desc: "¿Se comparte activamente la competencia de Prompts y las mejores prácticas operativas con los agentes de IA?",
    levels: [
      { score: 0, title: "Cero Socialización", description: "El agente es reservado o genera recelo en el personal, creyendo silenciosamente que reemplazará sus empleos." },
      { score: 25, title: "Socialización Unilateral", description: "Difusión aislada de correos explicativos con el enlace del bot de IA que carece de tutoriales reales." },
      { score: 50, title: "Capacitaciones Puntuales", description: "Talleres técnicos básicos para que los operarios comprendan la herramienta y compartan dudas generales de su uso." },
      { score: 75, title: "Repositorio de Prompts Compartidos", description: "Creación de una biblioteca de Prompts exitosos probados y redes interdepartamentales de intercambio del conocimiento de uso." },
      { score: 100, title: "Cultura Organizacional Integrada", description: "Academia digital permanente de IA humana y capacitación interactiva frecuente estructurada para empoderar al talento." },
    ],
  },
  {
    id: "con_aplicacion",
    category: "conocimiento",
    label: "Aplicación de Resultados e Integración",
    desc: "Nivel de inserción orgánica del agente en los procesos procedimentales reales y métricas de mejora continua del servicio.",
    levels: [
      { score: 0, title: "Accesorio Visual Aislado", description: "Usado solo como juguete demostrativo. No está conectado a ningún proceso o core funcional clave de la empresa." },
      { score: 25, title: "Uso Complementario Opcional", description: "Integrado superficialmente en soporte que los usuarios consultan únicamente si las vías tradicionales fallan." },
      { score: 50, title: "Conexión a Procesos", description: "Integración con ciertos sistemas mediante webhooks. Apoya la productividad de áreas aisladas con registro manual de resultados." },
      { score: 75, title: "Automatización de Trabajo", description: "Flujos de automatización que inician acciones en el backend según decisiones confirmadas del agente bajo supervisión." },
      { score: 100, title: "Proceso Simbiótico Corporativo", description: "Perfecta integración en workflows empresariales con mediciones automatizadas del impacto estratégico en tiempo real de la organización." },
    ],
  },
];

export const KNOWLEDGE_PHASES_MAP: Record<string, string> = {
  aud_transparencia: "Identificación y Captura de Decisiones",
  aud_sesgos: "Aplicación y Mejora del Modelo Ético",
  aud_seguridad: "Almacenamiento de Embeddings y Ciberseguridad",
  aud_privacidad: "Almacenamiento Seguro del Conocimiento",
  mad_tecnologica: "Identificación de Capacidades Cognitivas",
  mad_adopcion: "Compartir el Conocimiento en Equipos",
  mer_hype: "Aplicación y Retorno Estratégico",
  mer_normativa: "Identificación de Límites Legales",
  mer_escalabilidad: "Almacenamiento y Crecimiento Físico",
  con_identificacion: "Identificación de las Fuentes del Saber",
  con_captura: "Captura Integral del Conocimiento Tácito",
  con_almacenamiento: "Almacenamiento Seguro e Indexación de Datos",
  con_compartir: "Compartir y Socializar en Comunidades de Práctica",
  con_aplicacion: "Aplicación de Conocimiento Integral y Procesos Simbióticos",
};

export const RULE_RECOMMENDATIONS: Record<string, string[]> = {
  auditoria: [
    "Diseñar e implementar una 'Ficha de Modelo' (Model Card) detallando limitaciones del modelo cognitivo.",
    "Establecer auditorías quincenales de prompts e implementar pruebas de entrada robustas ante ataques semánticos directos.",
    "Utilizar un framework de sanitización de datos (ej. pasarelas locales que borren información confidencial mediante expresiones estándar) antes de enviar datos al LLM.",
    "Configurar filtros automatizados y delimitadores rígidamente estructurados en las llamadas de API."
  ],
  madurez: [
    "Implementar un pipeline robusto de Grounding de Datos (RAG avanzado) con verificación cruzada basada en fuentes corporativas oficiales.",
    "Formular tableros técnicos semanales de monitoreo de alucinaciones y registrar la tasa de fallos de la inteligencia de manera formal.",
    "Crear incentivos para la apropiación digital y formar líderes de IA interdepartamentales que promuevan la herramienta."
  ],
  mercado: [
    "Llevar un estudio exhaustivo del Coste Total de Propiedad (TCO) mensual y medir cuantitativamente el retorno frente a métricas operacionales.",
    "Diseñar sistemas de inyección dinámica de reglas reguladoras para asegurar el cumplimiento rápido ante cambios en normativas éticas de IA.",
    "Integrar cachés semánticos (ej. Redis caching) para evitar llamadas redundantes de IA que aumenten el coste operativo innecesariamente."
  ],
  conocimiento: [
    "Establecer un proceso de descarte continuo de información obsoleta de la base de datos RAG para evitar contaminaciones cognitivas del agente.",
    "Implementar un buzón interactivo estructurado (RLHF) que registre errores semánticos corregidos por expertos de la organización.",
    "Diseñar una bóveda segura de embeddings relacionales con encriptación avanzada y versionado estricto continuo.",
    "Capacitar activamente en ingeniería de prompts a todas las áreas e incentivar la creatividad responsable."
  ]
};
