import { GeminiProvider } from './gemini/provider';
import { OpenAIProvider } from './openai/provider';
import type { ILLMProvider } from './types';

export type SupportedProvider = 'gemini' | 'openai-compatible';

export interface ProviderFactoryConfig {
  provider: SupportedProvider;
  apiKey: string;
  /** Solo requerido para providers OpenAI-compatible autoalojados. */
  baseUrl?: string;
}

/**
 * Crea una instancia del proveedor de IA configurado.
 *
 * Para agregar un nuevo proveedor:
 * 1. Crea su implementación de `ILLMProvider` en `server/providers/<nombre>/`.
 * 2. Importa la clase aquí.
 * 3. Añade un nuevo caso en el `switch`.
 */
export const createProvider = (config: ProviderFactoryConfig): ILLMProvider => {
  switch (config.provider) {
    case 'gemini':
      return new GeminiProvider({ apiKey: config.apiKey });

    case 'openai-compatible':
      return new OpenAIProvider({
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
      });

    default:
      // TypeScript fuerza el manejo de todos los valores de SupportedProvider,
      // pero mantenemos un fallback defensivo.
      throw new Error(`Proveedor de IA no soportado: ${String(config.provider)}`);
  }
};
