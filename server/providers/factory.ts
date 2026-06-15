import type { ILLMProvider } from './types';

export type SupportedProvider = 'openai-compatible' | 'gemini';

export interface ProviderFactoryConfig {
  provider: SupportedProvider;
  apiKey: string;
  /** Solo requerido para providers autoalojados o endpoints personalizados. */
  baseUrl?: string;
}

/**
 * Crea una instancia del proveedor de IA configurado.
 *
 * Para agregar un nuevo proveedor:
 * 1. Crea su implementación de `ILLMProvider` en `server/providers/<nombre>/`.
 * 2. Añade un caso aquí con importación dinámica si requiere dependencias opcionales.
 * 3. Añade el nombre a `SupportedProvider`.
 *
 * Las importaciones dinámicas evitan que el proyecto dependa de bibliotecas
 * específicas que el usuario no vaya a utilizar.
 */
export const createProvider = async (config: ProviderFactoryConfig): Promise<ILLMProvider> => {
  switch (config.provider) {
    case 'openai-compatible': {
      const { OpenAIProvider } = await import('./openai/provider');
      return new OpenAIProvider({ apiKey: config.apiKey, baseUrl: config.baseUrl });
    }

    case 'gemini': {
      const { GeminiProvider } = await import('./gemini/provider');
      return new GeminiProvider({ apiKey: config.apiKey });
    }

    default:
      // TypeScript fuerza el manejo de todos los valores de SupportedProvider,
      // pero mantenemos un fallback defensivo.
      throw new Error(`Proveedor de IA no soportado: ${String(config.provider)}`);
  }
};
