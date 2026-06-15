<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ProtocolGen AI

Aplicación web para generar protocolos de simulación clínica con inteligencia artificial. Diseñada siguiendo estándares de INACSL/SSH, con énfasis en seguridad psicológica, contrato de ficción, ingeniería pedagógica inversa y equidad, diversidad e inclusión (EDI).

**Arquitectura desacoplada:** la capa de negocio no depende de ningún proveedor de IA en particular. Puedes usar Gemini, OpenAI, Anthropic, Ollama, LM Studio o cualquier otro modelo implementando una interfaz sencilla.

---

## ⚠️ Importante: seguridad de la API key

**La clave de API nunca debe exponerse en el frontend.** Este proyecto incluye un backend Express (`server/`) que es el único que accede a la clave. El frontend se comunica con el backend a través de `/api/generate` y `/api/action`.

---

## 🛠️ Tecnologías

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Backend:** Express, TypeScript
- **IA:** Arquitectura de providers desacoplada (incluye adapter para Gemini y template para OpenAI-compatible)
- **Calidad:** ESLint, Prettier, Vitest, Testing Library

---

## 🚀 Cómo ejecutar en local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:

```env
# Proveedor de IA: gemini | openai-compatible
LLM_PROVIDER=gemini
LLM_API_KEY=tu_api_key_aqui
PORT=3001
```

Para **Gemini**, obtén tu clave en [Google AI Studio](https://aistudio.google.com/app/apikey).

Para un proveedor **OpenAI-compatible** (OpenAI, Azure, Ollama, LM Studio, etc.):

```env
LLM_PROVIDER=openai-compatible
LLM_API_KEY=tu_api_key_aqui
LLM_BASE_URL=http://localhost:11434/v1  # ejemplo para Ollama
```

### 3. Iniciar frontend y backend

```bash
npm run dev
```

Esto ejecuta simultáneamente:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:3000`

El frontend proxya automáticamente las peticiones `/api` al backend.

---

## 📦 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Ejecuta backend y frontend en paralelo |
| `npm run build` | Compila el frontend para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run server` | Ejecuta solo el backend |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige errores de ESLint automáticamente |
| `npm run format` | Formatea el código con Prettier |
| `npm run format:check` | Verifica el formateo con Prettier |
| `npm test` | Ejecuta los tests una vez |
| `npm run test:watch` | Ejecuta los tests en modo watch |

---

## 🏗️ Arquitectura del backend (desacoplada)

```
server/
├── index.ts                 # Entry point: configura el provider y arranca Express
├── providers/
│   ├── types.ts             # Interfaz ILLMProvider: contrato que cumple cualquier IA
│   ├── factory.ts           # Crea el provider según LLM_PROVIDER
│   ├── gemini/
│   │   ├── provider.ts      # Implementación para Google Gemini
│   │   └── schemaConverter.ts  # Adapta nuestro JSON Schema al formato de Gemini
│   └── openai/
│       └── provider.ts      # Template para APIs tipo OpenAI
├── core/
│   ├── protocolSchema.ts    # JSON Schema "fuente de verdad" del protocolo
│   ├── promptBuilder.ts     # Construye los prompts (conocimiento del dominio)
│   └── protocolGenerator.ts # Orquesta generación usando cualquier provider
```

### ¿Cómo funciona?

1. El frontend envía peticiones a `/api/generate` o `/api/action`.
2. `server/index.ts` crea un provider mediante `createProvider()`.
3. `ProtocolGenerator` usa ese provider para generar protocolos o acciones secundarias.
4. Cada provider implementa `ILLMProvider`, por lo que la lógica de negocio no cambia al cambiar de modelo.

---

## 🔌 Cómo agregar un nuevo proveedor de IA

1. **Crea una carpeta** dentro de `server/providers/`:

   ```
   server/providers/miprovider/
   ```

2. **Implementa la interfaz** `ILLMProvider`:

   ```typescript
   import type { ILLMProvider, JSONSchema } from '../types';

   export class MiProvider implements ILLMProvider {
     readonly name = 'MiProvider';

     async generateStructured<T>(prompt: string, schema: JSONSchema): Promise<T> {
       // Llama a tu API y devuelve el objeto parseado
     }

     async generateText(prompt: string): Promise<string> {
       // Llama a tu API y devuelve texto
     }
   }
   ```

3. **Regístralo** en `server/providers/factory.ts`:

   ```typescript
   import { MiProvider } from './miprovider/provider';

   export type SupportedProvider = 'gemini' | 'openai-compatible' | 'miprovider';

   case 'miprovider':
     return new MiProvider({ apiKey: config.apiKey });
   ```

4. **Usa el nuevo provider** en `.env`:

   ```env
   LLM_PROVIDER=miprovider
   LLM_API_KEY=tu_api_key_aqui
   ```

---

## 🧪 Tests

```bash
npm test
```

Incluye tests para:
- El servicio de llamadas al backend (`services/protocolService` del frontend)
- Renderizado básico del formulario (`components/TopicForm`)

---

## 🔒 Medidas de seguridad implementadas

- La API key solo existe en el servidor (`server/index.ts` y `.env`).
- El HTML devuelto por la IA se sanitiza con `DOMPurify` antes de renderizarse.
- Validación básica de entradas en el backend.
- Variables de entorno excluidas del control de versiones (`.gitignore`).

---

## 📝 Notas sobre el despliegue

Para producción, despliega el backend en un servicio serverless (Vercel Functions, Netlify Functions, Cloud Run, Railway, etc.) o en un VPS. El frontend puede desplegarse en Vercel/Netlify configurando el proxy inverso o las variables de entorno de API route.

Recuerda configurar `LLM_PROVIDER` y `LLM_API_KEY` en el entorno de producción.

---

## 📄 Licencia

Privado. Uso educativo y clínico bajo responsabilidad del usuario.
