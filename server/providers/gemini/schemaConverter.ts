import { Type } from '@google/genai';
import type { JSONSchema, JSONSchemaProperty } from '../types';

/**
 * Convierte nuestro esquema JSON genérico al formato de schema que espera
 * la SDK de Google Gemini (`@google/genai`).
 */

// Tipo interno usado por la SDK de Gemini para definir schemas.
type GeminiSchema = {
  type: (typeof Type)[keyof typeof Type];
  description?: string;
  properties?: Record<string, GeminiSchema>;
  items?: GeminiSchema;
  required?: string[];
};

const mapType = (type: JSONSchemaProperty['type']): (typeof Type)[keyof typeof Type] => {
  switch (type) {
    case 'string':
      return Type.STRING;
    case 'array':
      return Type.ARRAY;
    case 'object':
      return Type.OBJECT;
    default:
      // Fallback seguro para propiedades desconocidas.
      return Type.STRING;
  }
};

const convertProperty = (property: JSONSchemaProperty): GeminiSchema => {
  const base: GeminiSchema = {
    type: mapType(property.type),
    description: property.description,
  };

  if (property.type === 'object') {
    base.properties = Object.fromEntries(
      Object.entries(property.properties).map(([key, value]) => [key, convertProperty(value)])
    );
    base.required = property.required;
  }

  if (property.type === 'array') {
    base.items = convertProperty(property.items);
  }

  return base;
};

/**
 * Convierte un JSONSchema genérico al schema de Gemini.
 */
export const convertToGeminiSchema = (schema: JSONSchema): GeminiSchema => {
  return {
    type: Type.OBJECT,
    description: schema.description,
    properties: Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [key, convertProperty(value)])
    ),
    required: schema.required,
  };
};
