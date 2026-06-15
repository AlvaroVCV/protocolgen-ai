import type { Protocol } from '../types';

const API_BASE = '/api';

interface GenerateProtocolParams {
  topic: string;
  fidelity: string;
  studentLevel: string;
}

interface SecondaryActionParams {
  actionType: 'summarize' | 'suggest' | 'quiz';
  protocol: Protocol;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `Error ${response.status}: ${response.statusText}`);
  }
  return (await response.json()) as T;
};

export const generateProtocol = async ({
  topic,
  fidelity,
  studentLevel,
}: GenerateProtocolParams): Promise<Protocol> => {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, fidelity, studentLevel }),
  });

  return handleResponse<Protocol>(response);
};

export const performSecondaryAction = async ({
  actionType,
  protocol,
}: SecondaryActionParams): Promise<string> => {
  const response = await fetch(`${API_BASE}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, protocol }),
  });

  const data = await handleResponse<{ html: string }>(response);
  return data.html;
};
