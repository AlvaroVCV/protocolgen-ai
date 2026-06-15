import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateProtocol, performSecondaryAction } from '../../services/protocolService';
import type { Protocol } from '../../types';

describe('protocolService', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockProtocol: Protocol = {
    topic: 'Shock Séptico',
    level: 'médico interno',
    fidelity: 'alta',
    poblacionObjetivo: 'Internos de medicina',
    objetivosAprendizaje: { general: 'Reconocer shock séptico', especificos: ['Identificar signos'] },
    competencias: ['Razonamiento clínico'],
    conocimientosPrevios: ['Fisiopatología'],
    materialesPreparacion: ['Lectura'],
    casoClinico: {
      resumenDelCaso: 'Paciente con fiebre e hipotensión',
      historiaPaciente: 'Antecedente de neumonía',
      signosVitales: {
        frecuenciaCardiaca: '110 lpm',
        presionArterial: '85/50 mmHg',
        frecuenciaRespiratoria: '24 rpm',
        saturacionOxigeno: '92%',
        temperatura: '38.5°C',
      },
      presentacionInicial: 'Somnoliento',
    },
    entornoYSimulador: {
      tipoDeSimulador: 'Maniquí alta fidelidad',
      configuracionDelEntorno: 'Urgencias',
      justificacionFidelidad: 'Requiere manejo dinámico',
      moulage: 'Sudoración',
    },
    roles: {
      estudiantes: '3 internos',
      facilitador: 'Guía el escenario',
      pacienteEstandarizadoConfederado: 'Familiar del paciente',
    },
    guionDetallado: {
      estadoInicial: 'Paciente estable',
      progresionDelCaso: 'Deterioro progresivo',
      puntosDeDecisionCriticos: ['Iniciar antibióticos'],
      accionesEsperadas: ['Monitorización'],
      erroresComunesAnticipados: ['Retraso en fluidos'],
      senalesYDistractores: 'Ruido de monitor',
      posiblesDesenlaces: 'Recuperación o deterioro',
    },
    puntosClavePrebriefing: {
      seguridadPsicologica: ['Normalizar errores'],
      contratoDeFiccion: ['Comprometerse'],
      especificosDelEscenario: 'Limitaciones del maniquí',
    },
    puntosClaveDebriefing: {
      temasPrincipales: ['Reconocimiento temprano'],
      metodoSugerido: 'PEARLS',
    },
    instrumentosEvaluacion: 'Rúbrica de evaluación',
    flujogramaTiempos: '30 minutos',
    referencias: ['Referencia 1'],
    notasFacilitador: 'Preparar equipo',
    planPruebaPiloto: 'Pilotar con 2 grupos',
  };

  it('generateProtocol envía la petición correcta y devuelve el protocolo', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProtocol,
    } as Response);

    const result = await generateProtocol({
      topic: 'Shock Séptico',
      fidelity: 'alta',
      studentLevel: 'médico interno',
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Shock Séptico',
        fidelity: 'alta',
        studentLevel: 'médico interno',
      }),
    });
    expect(result).toEqual(mockProtocol);
  });

  it('generateProtocol lanza error si la respuesta no es ok', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Error del servidor' }),
    } as Response);

    await expect(
      generateProtocol({ topic: 'Shock', fidelity: 'media', studentLevel: 'interno' })
    ).rejects.toThrow('Error del servidor');
  });

  it('performSecondaryAction devuelve el HTML recibido', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ html: '<ul><li>Variante 1</li></ul>' }),
    } as Response);

    const result = await performSecondaryAction({ actionType: 'suggest', protocol: mockProtocol });

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType: 'suggest', protocol: mockProtocol }),
    });
    expect(result).toBe('<ul><li>Variante 1</li></ul>');
  });
});
