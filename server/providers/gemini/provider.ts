import { GoogleGenAI } from '@google/genai';
import type { ILLMProvider, JSONSchema } from '../types';
import { convertToGeminiSchema } from './schemaConverter';

export interface GeminiProviderConfig {
  apiKey: string;
  structuredModel?: string;
  textModel?: string;
  thinkingBudget?: number;
}

/**
 * Implementación de `ILLMProvider` para Google Gemini.
 *
 * Usa `@google/genai` y permite forzar la salida a JSON estructurado
 * mediante `responseSchema` y `responseMimeType`.
 */
export class GeminiProvider implements ILLMProvider {
  readonly name = 'Gemini';
  private readonly client: GoogleGenAI;
  private readonly structuredModel: string;
  private readonly textModel: string;
  private readonly thinkingBudget: number;

  constructor(config: GeminiProviderConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.structuredModel = config.structuredModel ?? 'gemini-2.5-pro';
    this.textModel = config.textModel ?? 'gemini-2.5-flash';
    this.thinkingBudget = config.thinkingBudget ?? 32768;
  }

  async generateStructured<T>(prompt: string, schema: JSONSchema): Promise<T> {
    const response = await this.client.models.generateContent({
      model: this.structuredModel,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: convertToGeminiSchema(schema),
        thinkingConfig: { thinkingBudget: this.thinkingBudget },
      },
    });

    const text = response.text?.trim() ?? '';
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Failed to parse JSON response:', text);
      throw new Error('La respuesta de la IA no contenía un JSON válido.');
    }
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.textModel,
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text ?? '';
  }
}
