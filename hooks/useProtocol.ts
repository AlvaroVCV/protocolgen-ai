import { useContext } from 'react';
import { ProtocolContext } from '../contexts/ProtocolContext';

export const useProtocol = () => {
  const context = useContext(ProtocolContext);
  if (!context) {
    throw new Error('useProtocol debe usarse dentro de un ProtocolProvider');
  }
  return context;
};
