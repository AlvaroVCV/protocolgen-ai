import type { ILLMProvider, JSONSchema } from '../types';

export interface KimiProviderConfig {
  apiKey: string;
  baseUrl?: string;
  structuredModel?: string;
  textModel?: string;
}

/**
 * Implementación de `ILLMProvider` para la API de Kimi (Moonshot).
 *
 * La API de Kimi es compatible con el formato de OpenAI, por lo que este provider
 * utiliza `fetch` directamente contra el endpoint de chat completions.
 *
 * Documentación: https://platform.moonshot.cn/docs
 */
export class KimiProvider implements ILLMProvider {
  readonly name = 'Kimi';
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly structuredModel: string;
  private readonly textModel: string;

  constructor(config: KimiProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://api.moonshot.cn/v1';
    this.structuredModel = config.structuredModel ?? 'moonshot-v1-32k';
    this.textModel = config.textModel ?? 'moonshot-v1-8k';
  }

  private async chatCompletion({
    model,
    prompt,
    requireJson = false,
  }: {
    model: string;
    prompt: string;
    requireJson?: boolean;
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
        temperature: 0.2,
        ...(requireJson && { response_format: { type: 'json_object' } }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error de Kimi (${response.status}): ${error}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content ?? '';
  }

  private schemaToJson(schema: JSONSchema, indent = 0): string {
    const pad = ' '.repeat(indent);
    const lines: string[] = [];

    if (schema.description) {
      lines.push(`${pad}// ${schema.description}`);
    }
    lines.push(`${pad}{`);

    for (const [key, prop] of Object.entries(schema.properties)) {
      const required = schema.required?.includes(key) ? ' (requerido)' : ' (opcional)';
      if (prop.type === 'object') {
        lines.push(`${pad}  "${key}": ${required}`);
        lines.push(this.schemaToJson(prop, indent + 4));
      } else if (prop.type === 'array') {
        lines.push(`${pad}  "${key}": [${prop.description ? ` // ${prop.description}` : ''}`);
        if (prop.items.type === 'object') {
          lines.push(this.schemaToJson(prop.items, indent + 4));
        } else {
          lines.push(`${pad}      "${prop.items.type}"`);
        }
        lines.push(`${pad}  ]`);
      } else {
        lines.push(`${pad}  "${key}": "${prop.type}"${required}${prop.description ? ` // ${prop.description}` : ''}`);
      }
    }

    lines.push(`${pad}}`);
    return lines.join('\n');
  }

  async generateStructured<T>(prompt: string, schema: JSONSchema): Promise<T> {
    const schemaDescription = this.schemaToJson(schema);
    const fullPrompt = `${prompt}\n\nDevuelve ÚNICAMENTE un objeto JSON válido que se ajuste exactamente a este esquema:\n\n${schemaDescription}\n\nNo incluyas explicaciones, markdown ni texto fuera del JSON.`;

    const text = await this.chatCompletion({
      model: this.structuredModel,
      prompt: fullPrompt,
      requireJson: true,
    });

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      // Fallback: intenta extraer JSON de una respuesta con texto adicional.
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]) as T;
        } catch {
          // Ignorar y lanzar el error original más descriptivo.
        }
      }
      console.error('Failed to parse JSON response from Kimi:', text);
      throw new Error('La respuesta de Kimi no contenía un JSON válido.');
    }
  }

  async generateText(prompt: string): Promise<string> {
    return this.chatCompletion({ model: this.textModel, prompt });
  }
}
