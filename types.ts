export interface VitalSigns {
  frecuenciaCardiaca: string;
  presionArterial: string;
  frecuenciaRespiratoria: string;
  saturacionOxigeno: string;
  temperatura: string;
  otros?: string;
}

export interface ClinicalCase {
  resumenDelCaso: string;
  historiaPaciente: string;
  signosVitales: VitalSigns;
  presentacionInicial: string;
}

export interface LearningObjectives {
  general: string;
  especificos: string[];
}

export interface EnvironmentAndSimulator {
  tipoDeSimulador: string;
  configuracionDelEntorno: string;
  justificacionFidelidad: string;
  moulage: string;
}

export interface Roles {
  estudiantes: string;
  facilitador: string;
  pacienteEstandarizadoConfederado: string;
}

export interface DetailedScript {
  estadoInicial: string;
  progresionDelCaso: string;
  puntosDeDecisionCriticos: string[];
  accionesEsperadas: string[];
  erroresComunesAnticipados: string[];
  senalesYDistractores: string;
  posiblesDesenlaces: string;
}

export interface Prebriefing {
  seguridadPsicologica: string[];
  contratoDeFiccion: string[];
  especificosDelEscenario: string;
}

export interface Debriefing {
  temasPrincipales: string[];
  metodoSugerido: string;
}

export interface Protocol {
  topic: string;
  level: string;
  fidelity: string;
  poblacionObjetivo: string;
  objetivosAprendizaje: LearningObjectives;
  competencias: string[];
  conocimientosPrevios: string[];
  materialesPreparacion: string[];
  casoClinico: ClinicalCase;
  entornoYSimulador: EnvironmentAndSimulator;
  roles: Roles;
  guionDetallado: DetailedScript;
  puntosClavePrebriefing: Prebriefing;
  puntosClaveDebriefing: Debriefing;
  instrumentosEvaluacion: string;
  flujogramaTiempos: string;
  referencias: string[];
  notasFacilitador: string;
  planPruebaPiloto: string;
}
