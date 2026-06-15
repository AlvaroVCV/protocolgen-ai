import React from 'react';
import { sanitizeHtml } from '../utils/sanitizeHtml';

interface ModalProps {
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, message, isVisible, onClose }) => {
  if (!isVisible) return null;

  const sanitizedMessage = sanitizeHtml(message);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl transform rounded-xl bg-white p-6 shadow-2xl transition-all animate-fade-in dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <div
          className="prose prose-sm mb-6 max-h-[60vh] overflow-y-auto text-gray-700 dark:prose-invert sm:prose-base dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="focus-ring rounded-lg bg-primary px-4 py-2 text-white transition-colors duration-200 hover:bg-primary-hover"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
