import { describe, it, expect } from 'vitest';
import { ProtocolGenerator } from '../../../server/core/protocolGenerator';
import type { ILLMProvider } from '../../../server/providers/types';
import type { Protocol } from '../../../types';

/**
 * Provider ficticio que simula una respuesta de IA.
 * Demuestra que ProtocolGenerator funciona con cualquier implementación de ILLMProvider.
 */
class FakeProvider implements ILLMProvider {
  readonly name = 'FakeProvider';

  async generateStructured<T>(): Promise<T> {
    return {
      topic: 'Shock Séptico',
      level: 'médico interno',
      fidelity: 'alta',
      poblacionObjetivo: 'Internos',
      objetivosAprendizaje: { general: 'Reconocer shock', especificos: ['Identificar signos'] },
      competencias: ['Razonamiento'],
      conocimientosPrevios: ['Fisiología'],
      materialesPreparacion: ['Lectura'],
      casoClinico: {
        resumenDelCaso: 'Paciente hipotenso',
        historiaPaciente: 'Neumonía',
        signosVitales: {
          frecuenciaCardiaca: '110',
          presionArterial: '80/50',
          frecuenciaRespiratoria: '24',
          saturacionOxigeno: '92%',
          temperatura: '38.5°C',
        },
        presentacionInicial: 'Somnoliento',
      },
      entornoYSimulador: {
        tipoDeSimulador: 'Maniquí',
        configuracionDelEntorno: 'Urgencias',
        justificacionFidelidad: 'Alta',
        moulage: 'Sudor',
      },
      roles: {
        estudiantes: '3',
        facilitador: 'Guía',
        pacienteEstandarizadoConfederado: 'Familiar',
      },
      guionDetallado: {
        estadoInicial: 'Estable',
        progresionDelCaso: 'Deterioro',
        puntosDeDecisionCriticos: ['Antibióticos'],
        accionesEsperadas: ['Monitorizar'],
        erroresComunesAnticipados: ['Retraso'],
        senalesYDistractores: 'Ruido',
        posiblesDesenlaces: 'Recuperación',
      },
      puntosClavePrebriefing: {
        seguridadPsicologica: ['Normalizar'],
        contratoDeFiccion: ['Comprometerse'],
        especificosDelEscenario: 'Limitaciones',
      },
      puntosClaveDebriefing: {
        temasPrincipales: ['Reconocimiento'],
        metodoSugerido: 'PEARLS',
      },
      instrumentosEvaluacion: 'Rúbrica',
      flujogramaTiempos: '30 min',
      referencias: ['Ref'],
      notasFacilitador: 'Preparar',
      planPruebaPiloto: 'Pilotar',
    } as T;
  }

  async generateText(): Promise<string> {
    return '<ul><li>Variante 1</li></ul>';
  }
}

describe('ProtocolGenerator', () => {
  const generator = new ProtocolGenerator(new FakeProvider());

  it('genera un protocolo usando cualquier provider', async () => {
    const protocol = await generator.generateProtocol({
      topic: 'Shock Séptico',
      fidelity: 'alta',
      studentLevel: 'médico interno',
    });

    expect(protocol.topic).toBe('Shock Séptico');
    expect(protocol.casoClinico.resumenDelCaso).toBe('Paciente hipotenso');
  });

  it('ejecuta acciones secundarias usando cualquier provider', async () => {
    const protocol = await generator.generateProtocol({
      topic: 'Shock Séptico',
      fidelity: 'alta',
      studentLevel: 'médico interno',
    });

    const html = await generator.performSecondaryAction({
      actionType: 'suggest',
      protocol,
    });

    expect(html).toBe('<ul><li>Variante 1</li></ul>');
  });
});
