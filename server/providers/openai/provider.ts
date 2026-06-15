import type { ILLMProvider, JSONSchema } from '../types';

export interface OpenAIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  structuredModel?: string;
  textModel?: string;
}

/**
 * Ejemplo de implementación de `ILLMProvider` para APIs compatibles con OpenAI.
 *
 * Puedes usar este archivo como plantilla para integrar OpenAI, Azure OpenAI,
 * Ollama, LM Studio o cualquier otro servicio con formato de chat completion.
 *
 * NOTA: Para usar este provider en producción, instala la SDK oficial:
 *   npm install openai
 * o completa la implementación de fetch según la API que vayas a consumir.
 */
export class OpenAIProvider implements ILLMProvider {
  readonly name = 'OpenAI-compatible';
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly structuredModel: string;
  private readonly textModel: string;

  constructor(config: OpenAIProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://api.openai.com/v1';
    this.structuredModel = config.structuredModel ?? 'gpt-4o';
    this.textModel = config.textModel ?? 'gpt-4o-mini';
  }

  private async chatCompletion({
    model,
    prompt,
    responseFormat,
  }: {
    model: string;
    prompt: string;
    responseFormat?: { type: 'json_object' | 'json_schema'; json_schema?: unknown };
  }): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        ...(responseFormat && { response_format: responseFormat }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error de OpenAI-compatible (${response.status}): ${error}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content ?? '';
  }

  async generateStructured<T>(prompt: string, _schema: JSONSchema): Promise<T> {
    // OpenAI soporta JSON mode. Para JSON Schema estricto se recomienda
    // `response_format: { type: 'json_schema', json_schema: {...} }` en modelos como gpt-4o.
    const text = await this.chatCompletion({
      model: this.structuredModel,
      prompt: `${prompt}\n\nResponde únicamente con un objeto JSON válido.`,
      responseFormat: { type: 'json_object' },
    });

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Failed to parse JSON response:', text);
      throw new Error('La respuesta de la IA no contenía un JSON válido.');
    }
  }

  async generateText(prompt: string): Promise<string> {
    return this.chatCompletion({ model: this.textModel, prompt });
  }
}
