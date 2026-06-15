import React, { createContext, useCallback, useState } from 'react';
import { generateProtocol, performSecondaryAction } from '../services/protocolService';
import type { Protocol } from '../types';

export type LoadingAction = 'generate' | 'adjust' | 'summarize' | 'suggest' | 'quiz' | null;

interface ModalState {
  isVisible: boolean;
  title: string;
  message: string;
}

interface ProtocolContextValue {
  currentProtocol: Protocol | null;
  loadingAction: LoadingAction;
  modal: ModalState;
  generate: (topic: string, fidelity: string, studentLevel: string, isAdjustment?: boolean) => Promise<void>;
  runSecondaryAction: (actionType: 'summarize' | 'suggest' | 'quiz') => Promise<void>;
  adjustLevel: (studentLevel: string) => Promise<void>;
  showModal: (title: string, message: string) => void;
  closeModal: () => void;
}

export const ProtocolContext = createContext<ProtocolContextValue | null>(null);

interface ProtocolProviderProps {
  children: React.ReactNode;
}

const INITIAL_MODAL: ModalState = { isVisible: false, title: '', message: '' };

export const ProtocolProvider: React.FC<ProtocolProviderProps> = ({ children }) => {
  const [currentProtocol, setCurrentProtocol] = useState<Protocol | null>(null);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [modal, setModal] = useState<ModalState>(INITIAL_MODAL);

  const showModal = useCallback((title: string, message: string) => {
    setModal({ isVisible: true, title, message });
  }, []);

  const closeModal = useCallback(() => {
    setModal(INITIAL_MODAL);
  }, []);

  const generate = useCallback(
    async (topic: string, fidelity: string, studentLevel: string, isAdjustment = false) => {
      const action: LoadingAction = isAdjustment ? 'adjust' : 'generate';
      setLoadingAction(action);

      try {
        const protocol = await generateProtocol({ topic, fidelity, studentLevel });
        setCurrentProtocol(protocol);
      } catch (error) {
        console.error('Error generating protocol:', error);
        const message = error instanceof Error ? error.message : String(error);
        showModal('Error de Generación', `La IA no pudo generar el protocolo. Detalle: ${message}`);
      } finally {
        setLoadingAction(null);
      }
    },
    [showModal]
  );

  const runSecondaryAction = useCallback(
    async (actionType: 'summarize' | 'suggest' | 'quiz') => {
      if (!currentProtocol) return;

      setLoadingAction(actionType);
      try {
        const html = await performSecondaryAction({ actionType, protocol: currentProtocol });
        const titles: Record<typeof actionType, string> = {
          summarize: 'Resumen',
          suggest: 'Variaciones sugeridas',
          quiz: 'Evaluación (Quiz)',
        };
        showModal(`Resultado: ${titles[actionType]}`, html);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        showModal('Error de IA', message);
      } finally {
        setLoadingAction(null);
      }
    },
    [currentProtocol, showModal]
  );

  const adjustLevel = useCallback(
    async (studentLevel: string) => {
      if (!currentProtocol) return;
      await generate(currentProtocol.topic, currentProtocol.fidelity, studentLevel, true);
    },
    [currentProtocol, generate]
  );

  return (
    <ProtocolContext.Provider
      value={{
        currentProtocol,
        loadingAction,
        modal,
        generate,
        runSecondaryAction,
        adjustLevel,
        showModal,
        closeModal,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};
