import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { createProvider, type SupportedProvider } from './providers/factory';
import { ProtocolGenerator } from './core/protocolGenerator';
import type { Protocol } from '../types';

const app = express();
const PORT = process.env.PORT ?? 3001;

/**
 * Configuración del proveedor de IA.
 *
 * LLM_PROVIDER puede ser:
 * - 'openai-compatible' (por defecto, usa fetch nativo, sin dependencias extra)
 * - 'gemini' (requiere instalar @google/genai como dependencia opcional)
 *
 * Para agregar más proveedores, mira `server/providers/factory.ts`.
 */
const LLM_PROVIDER = (process.env.LLM_PROVIDER ?? 'openai-compatible') as SupportedProvider;
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL;

if (!LLM_API_KEY) {
  console.error('Error: se requiere LLM_API_KEY (o GEMINI_API_KEY para compatibilidad).');
  process.exit(1);
}

const startServer = async () => {
  const provider = await createProvider({
    provider: LLM_PROVIDER,
    apiKey: LLM_API_KEY,
    baseUrl: LLM_BASE_URL,
  });

  const protocolGenerator = new ProtocolGenerator(provider);

  console.log(`Usando proveedor de IA: ${provider.name}`);

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  interface GenerateRequest {
    topic: string;
    fidelity: string;
    studentLevel: string;
  }

  interface ActionRequest {
    actionType: 'summarize' | 'suggest' | 'quiz';
    protocol: Protocol;
  }

  const isGenerateRequest = (body: unknown): body is GenerateRequest => {
    const b = body as Record<string, unknown>;
    return (
      typeof b.topic === 'string' &&
      b.topic.trim().length > 0 &&
      typeof b.fidelity === 'string' &&
      typeof b.studentLevel === 'string'
    );
  };

  const isActionRequest = (body: unknown): body is ActionRequest => {
    const b = body as Record<string, unknown>;
    return (
      (b.actionType === 'summarize' || b.actionType === 'suggest' || b.actionType === 'quiz') &&
      typeof b.protocol === 'object' &&
      b.protocol !== null
    );
  };

  /**
   * POST /api/generate
   * Genera un protocolo de simulación clínica completo.
   */
  app.post('/api/generate', async (req: Request, res: Response) => {
    try {
      if (!isGenerateRequest(req.body)) {
        res.status(400).json({ error: 'Petición inválida. Se requieren topic, fidelity y studentLevel.' });
        return;
      }

      const { topic, fidelity, studentLevel } = req.body;
      const protocol = await protocolGenerator.generateProtocol({ topic, fidelity, studentLevel });
      res.json(protocol);
    } catch (error) {
      console.error('Error en /api/generate:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: message });
    }
  });

  /**
   * POST /api/action
   * Ejecuta una acción secundaria sobre un protocolo generado.
   */
  app.post('/api/action', async (req: Request, res: Response) => {
    try {
      if (!isActionRequest(req.body)) {
        res.status(400).json({ error: 'Petición inválida. Se requieren actionType y protocol.' });
        return;
      }

      const { actionType, protocol } = req.body;
      const html = await protocolGenerator.performSecondaryAction({ actionType, protocol });
      res.json({ html });
    } catch (error) {
      console.error('Error en /api/action:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: message });
    }
  });

  /**
   * GET /api/health
   * Endpoint de verificación de que el servidor está funcionando.
   */
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', provider: provider.name });
  });

  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
  });
};

void startServer();
