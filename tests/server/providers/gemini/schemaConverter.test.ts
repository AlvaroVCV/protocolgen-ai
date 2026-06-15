import { describe, it, expect } from 'vitest';
import { Type } from '@google/genai';
import { convertToGeminiSchema } from '../../../../server/providers/gemini/schemaConverter';
import { protocolSchema } from '../../../../server/core/protocolSchema';

describe('convertToGeminiSchema', () => {
  it('convierte el protocolSchema a formato Gemini sin perder propiedades', () => {
    const geminiSchema = convertToGeminiSchema(protocolSchema);

    expect(geminiSchema.type).toBe(Type.OBJECT);
    expect(geminiSchema.properties?.topic?.type).toBe(Type.STRING);
    expect(geminiSchema.properties?.objetivosAprendizaje?.type).toBe(Type.OBJECT);
    expect(geminiSchema.properties?.competencias?.type).toBe(Type.ARRAY);
    expect(geminiSchema.required).toContain('topic');
    expect(geminiSchema.required).toContain('casoClinico');
  });
});
