/**
 * Tipos base para cualquier proveedor de modelos de lenguaje (LLM).
 *
 * Esta capa de abstracción permite cambiar entre Gemini, OpenAI, Anthropic,
 * modelos locales (Ollama, LM Studio) u otro proveedor sin modificar la lógica
 * de negocio de la aplicación.
 *
 * Para agregar un nuevo proveedor:
 * 1. Crea una carpeta dentro de `server/providers/`.
 * 2. Implementa la interfaz `ILLMProvider`.
 * 3. Registra el proveedor en `server/providers/factory.ts`.
 */

/**
 * Esquema JSON genérico que describe la forma de la respuesta esperada.
 * Cada proveedor es responsable de convertir este esquema a su formato nativo.
 */
export type JSONSchema = {
  type: 'object';
  description?: string;
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
};

export type JSONSchemaProperty =
  | StringSchema
  | ArraySchema
  | ObjectSchema;

interface BaseSchema {
  description?: string;
}

export interface StringSchema extends BaseSchema {
  type: 'string';
}

export interface ArraySchema extends BaseSchema {
  type: 'array';
  items: JSONSchemaProperty;
}

export interface ObjectSchema extends BaseSchema {
  type: 'object';
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
}

/**
 * Interfaz que debe implementar cualquier proveedor de IA.
 */
export interface ILLMProvider {
  /** Nombre legible del proveedor, útil para logs y debugging. */
  readonly name: string;

  /**
   * Genera una respuesta estructurada que cumple con el esquema JSON dado.
   * Útil para forzar al modelo a devolver objetos tipados (por ejemplo, un protocolo).
   */
  generateStructured<T>(prompt: string, schema: JSONSchema): Promise<T>;

  /**
   * Genera una respuesta de texto libre.
   * Útil para resúmenes, sugerencias o HTML que se muestra en un modal.
   */
  generateText(prompt: string): Promise<string>;
}

/**
 * Opciones de configuración comunes para la generación de contenido.
 */
export interface GenerationOptions {
  /** Temperatura del modelo: 0 = más determinista, 1 = más creativo. */
  temperature?: number;
  /** Número máximo de tokens de salida. */
  maxOutputTokens?: number;
}
