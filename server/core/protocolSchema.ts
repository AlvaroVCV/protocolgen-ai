import type { JSONSchema } from '../providers/types';

/**
 * Esquema JSON que define la estructura de un protocolo de simulación clínica.
 *
 * Este esquema es agnóstico al proveedor de IA. Cada adapter (Gemini, OpenAI, etc.)
 * debe convertirlo a su formato nativo antes de enviarlo al modelo.
 */
export const protocolSchema: JSONSchema = {
  type: 'object',
  description: 'Protocolo completo de simulación clínica basado en evidencia.',
  properties: {
    topic: {
      type: 'string',
      description: 'El tema clínico principal del protocolo.',
    },
    level: {
      type: 'string',
      description: 'El nivel de los estudiantes a quienes se dirige.',
    },
    fidelity: {
      type: 'string',
      description: 'El nivel de fidelidad de la simulación.',
    },
    poblacionObjetivo: {
      type: 'string',
      description: 'Descripción de los participantes.',
    },
    objetivosAprendizaje: {
      type: 'object',
      description: 'Objetivos de aprendizaje del escenario.',
      properties: {
        general: {
          type: 'string',
          description: 'El propósito principal del escenario.',
        },
        especificos: {
          type: 'array',
          description: 'De 2 a 4 objetivos SMART.',
          items: { type: 'string' },
        },
      },
      required: ['general', 'especificos'],
    },
    competencias: {
      type: 'array',
      description: 'Competencias a desarrollar/evaluar.',
      items: { type: 'string' },
    },
    conocimientosPrevios: {
      type: 'array',
      description: 'Conocimientos teóricos o prácticos requeridos.',
      items: { type: 'string' },
    },
    materialesPreparacion: {
      type: 'array',
      description: 'Lecturas, videos u otros recursos previos.',
      items: { type: 'string' },
    },
    casoClinico: {
      type: 'object',
      description: 'Caso clínico del escenario.',
      properties: {
        resumenDelCaso: { type: 'string' },
        historiaPaciente: { type: 'string' },
        signosVitales: {
          type: 'object',
          properties: {
            frecuenciaCardiaca: { type: 'string' },
            presionArterial: { type: 'string' },
            frecuenciaRespiratoria: { type: 'string' },
            saturacionOxigeno: { type: 'string' },
            temperatura: { type: 'string' },
            otros: {
              type: 'string',
              description: 'Otros signos vitales relevantes como Glasgow, etc.',
            },
          },
          required: [
            'frecuenciaCardiaca',
            'presionArterial',
            'frecuenciaRespiratoria',
            'saturacionOxigeno',
            'temperatura',
          ],
        },
        presentacionInicial: { type: 'string' },
      },
      required: ['resumenDelCaso', 'historiaPaciente', 'signosVitales', 'presentacionInicial'],
    },
    entornoYSimulador: {
      type: 'object',
      description: 'Configuración del entorno de simulación.',
      properties: {
        tipoDeSimulador: {
          type: 'string',
          description: 'Maniquí de alta/media/baja fidelidad, paciente estandarizado, etc.',
        },
        configuracionDelEntorno: {
          type: 'string',
          description: 'Sala de emergencias, consultorio, etc.',
        },
        justificacionFidelidad: {
          type: 'string',
          description: 'Justificación de los niveles de fidelidad.',
        },
        moulage: {
          type: 'string',
          description: 'Maquillaje o caracterización para simular signos clínicos.',
        },
      },
      required: ['tipoDeSimulador', 'configuracionDelEntorno', 'justificacionFidelidad', 'moulage'],
    },
    roles: {
      type: 'object',
      description: 'Roles de los participantes.',
      properties: {
        estudiantes: {
          type: 'string',
          description: 'Número de participantes y roles asignados.',
        },
        facilitador: {
          type: 'string',
          description: 'Rol durante pre-briefing, escenario y debriefing.',
        },
        pacienteEstandarizadoConfederado: {
          type: 'string',
          description: 'Descripción detallada de su rol y guion.',
        },
      },
      required: ['estudiantes', 'facilitador', 'pacienteEstandarizadoConfederado'],
    },
    guionDetallado: {
      type: 'object',
      description: 'Guion detallado del escenario.',
      properties: {
        estadoInicial: { type: 'string' },
        progresionDelCaso: {
          type: 'string',
          description: 'Secuencia de eventos y cambios en el estado del paciente.',
        },
        puntosDeDecisionCriticos: {
          type: 'array',
          items: { type: 'string' },
        },
        accionesEsperadas: {
          type: 'array',
          items: { type: 'string' },
        },
        erroresComunesAnticipados: {
          type: 'array',
          items: { type: 'string' },
        },
        senalesYDistractores: {
          type: 'string',
          description: 'Pistas o información adicional y elementos distractores.',
        },
        posiblesDesenlaces: {
          type: 'string',
          description: 'Diferentes formas en que puede concluir el escenario.',
        },
      },
      required: [
        'estadoInicial',
        'progresionDelCaso',
        'puntosDeDecisionCriticos',
        'accionesEsperadas',
        'erroresComunesAnticipados',
        'senalesYDistractores',
        'posiblesDesenlaces',
      ],
    },
    puntosClavePrebriefing: {
      type: 'object',
      description: 'Puntos clave del pre-briefing.',
      properties: {
        seguridadPsicologica: {
          type: 'array',
          description: 'Estrategias como la Premisa Básica, normalización de errores.',
          items: { type: 'string' },
        },
        contratoDeFiccion: {
          type: 'array',
          description: 'Responsabilidades del facilitador y del alumno.',
          items: { type: 'string' },
        },
        especificosDelEscenario: {
          type: 'string',
          description: 'Limitaciones del maniquí, aspectos únicos del entorno.',
        },
      },
      required: ['seguridadPsicologica', 'contratoDeFiccion', 'especificosDelEscenario'],
    },
    puntosClaveDebriefing: {
      type: 'object',
      description: 'Puntos clave del debriefing.',
      properties: {
        temasPrincipales: {
          type: 'array',
          items: { type: 'string' },
        },
        metodoSugerido: {
          type: 'string',
          description: 'Ej: PEARLS, GAS, etc.',
        },
      },
      required: ['temasPrincipales', 'metodoSugerido'],
    },
    instrumentosEvaluacion: {
      type: 'string',
      description: 'Listas de cotejo, rúbricas u otras herramientas a utilizar.',
    },
    flujogramaTiempos: {
      type: 'string',
      description: 'Tiempos estimados para Pre-briefing, Escenario y Debriefing.',
    },
    referencias: {
      type: 'array',
      description: 'Fuentes utilizadas para el desarrollo del caso.',
      items: { type: 'string' },
    },
    notasFacilitador: {
      type: 'string',
      description: 'Instrucciones específicas para la preparación del escenario.',
    },
    planPruebaPiloto: {
      type: 'string',
      description: 'Espacio para registrar resultados de pruebas piloto y modificaciones.',
    },
  },
  required: [
    'topic',
    'level',
    'fidelity',
    'poblacionObjetivo',
    'objetivosAprendizaje',
    'competencias',
    'conocimientosPrevios',
    'materialesPreparacion',
    'casoClinico',
    'entornoYSimulador',
    'roles',
    'guionDetallado',
    'puntosClavePrebriefing',
    'puntosClaveDebriefing',
    'instrumentosEvaluacion',
    'flujogramaTiempos',
    'referencias',
    'notasFacilitador',
    'planPruebaPiloto',
  ],
};
