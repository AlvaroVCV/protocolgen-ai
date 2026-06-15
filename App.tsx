import React from 'react';
import { ProtocolProvider } from './contexts/ProtocolContext';
import { useProtocol } from './hooks/useProtocol';
import Header from './components/Header';
import TopicForm from './components/TopicForm';
import ProtocolOutput from './components/ProtocolOutput';
import LoadingOverlay from './components/LoadingOverlay';
import Modal from './components/Modal';

const AppContent: React.FC = () => {
  const { currentProtocol, loadingAction, modal, closeModal } = useProtocol();

  return (
    <div className="min-h-screen">
      <LoadingOverlay isVisible={loadingAction === 'generate'} />
      <Modal {...modal} onClose={closeModal} />

      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6">
        <TopicForm />
        {currentProtocol && <ProtocolOutput />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ProtocolProvider>
      <AppContent />
    </ProtocolProvider>
  );
};

export default App;
