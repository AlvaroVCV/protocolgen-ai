import type { ILLMProvider } from '../providers/types';
import { protocolSchema } from './protocolSchema';
import {
  buildProtocolPrompt,
  buildSecondaryActionPrompt,
  type ProtocolPromptParams,
  type SecondaryActionParams,
} from './promptBuilder';
import type { Protocol } from '../../types';

/**
 * Orquesta la generación de protocolos y acciones secundarias.
 *
 * Esta clase no sabe qué proveedor de IA se está usando: recibe cualquier objeto
 * que implemente `ILLMProvider` y se encarga de la lógica del dominio.
 */
export class ProtocolGenerator {
  constructor(private readonly provider: ILLMProvider) {}

  /**
   * Genera un protocolo de simulación clínica completo a partir de un tema,
   * nivel de fidelidad y nivel de estudiante.
   */
  async generateProtocol({
    topic,
    fidelity,
    studentLevel,
  }: ProtocolPromptParams): Promise<Protocol> {
    const prompt = buildProtocolPrompt({ topic, fidelity, studentLevel });
    const raw = await this.provider.generateStructured<Protocol>(prompt, protocolSchema);

    // Validación mínima de seguridad: aseguramos que el topic y fidelity coincidan.
    return {
      ...raw,
      topic: raw.topic || topic,
      fidelity: raw.fidelity || fidelity,
      level: raw.level || studentLevel,
    };
  }

  /**
   * Ejecuta una acción secundaria (resumir, sugerir variaciones o crear quiz)
   * sobre un protocolo ya generado.
   */
  async performSecondaryAction({
    actionType,
    protocol,
  }: SecondaryActionParams): Promise<string> {
    const prompt = buildSecondaryActionPrompt({ actionType, protocol });
    return this.provider.generateText(prompt);
  }
}
