/**
 * Construye los prompts que se envían al modelo de lenguaje.
 *
 * Esta capa contiene el conocimiento del dominio (educación médica, simulación clínica)
 * y es independiente del proveedor de IA que se use detrás.
 */

export interface ProtocolPromptParams {
  topic: string;
  fidelity: string;
  studentLevel: string;
}

export type SecondaryActionType = 'summarize' | 'suggest' | 'quiz';

export interface SecondaryActionParams {
  actionType: SecondaryActionType;
  protocol: {
    topic: string;
    casoClinico: { resumenDelCaso: string };
    objetivosAprendizaje: { especificos: string[] };
  };
}

/**
 * Prompt para generar un protocolo de simulación clínica completo.
 */
export const buildProtocolPrompt = ({
  topic,
  fidelity,
  studentLevel,
}: ProtocolPromptParams): string => {
  return `
Actúa como un experto de clase mundial en educación médica y diseño de simulación clínica, con profundo conocimiento de los estándares de INACSL y SSH.

Tu tarea es crear un protocolo de simulación clínica completo y basado en evidencia sobre el tema "${topic}" para "${studentLevel}" con un nivel de fidelidad "${fidelity}".

Principios a seguir:
1. **Ingeniería Pedagógica Inversa:** Comienza con los objetivos de aprendizaje y diseña todos los componentes hacia atrás para cumplirlos.
2. **Fases de Simulación:** El protocolo debe estructurarse claramente en Pre-briefing, Escenario y Debriefing.
3. **Pre-briefing Robusto:** Presta especial atención a:
   - **Seguridad Psicológica:** Establece un entorno seguro para el aprendizaje.
   - **Contrato de Ficción:** Define responsabilidades de participantes y facilitador.
4. **Diseño del Escenario:** Clínicamente coherente, relevante y con progresión lógica.
5. **Debriefing Efectivo:** Sugiere un modelo (PEARLS, GAS) y preguntas guía reflexivas.
6. **Adaptabilidad y EDI:** Considera equidad, diversidad e inclusión.

Devuelve la respuesta como un único objeto JSON que se ajuste estrictamente al esquema proporcionado. No incluyas texto ni markdown fuera del objeto JSON. El contenido debe estar en español y ser clínicamente preciso.
  `.trim();
};

/**
 * Prompts para acciones secundarias sobre un protocolo ya generado.
 */
const secondaryPrompts: Record<SecondaryActionType, (protocol: SecondaryActionParams['protocol']) => string> = {
  summarize: (protocol) =>
    `Resume el siguiente protocolo de simulación en un párrafo conciso y claro para una rápida visión general:\n\nTema: ${protocol.topic}\nResumen del caso: ${protocol.casoClinico.resumenDelCaso}\nObjetivos: ${protocol.objetivosAprendizaje.especificos.join(', ')}`,

  suggest: (protocol) =>
    `Basado en el tema "${protocol.topic}", sugiere 3 variaciones o complicaciones interesantes para este escenario clínico (ej. una comorbilidad inesperada, un fallo de equipo, un familiar difícil). Formato: lista HTML <ul>.`,

  quiz: (protocol) =>
    `Basado en los objetivos de aprendizaje: "${protocol.objetivosAprendizaje.especificos.join('; ')}", crea un breve quiz de 3 preguntas de opción múltiple con la respuesta correcta indicada. El formato de salida debe ser HTML, utilizando <div> para cada pregunta y listas <ul> para las opciones.`,
};

/**
 * Construye el prompt para una acción secundaria.
 */
export const buildSecondaryActionPrompt = ({
  actionType,
  protocol,
}: SecondaryActionParams): string => {
  return secondaryPrompts[actionType](protocol);
};
