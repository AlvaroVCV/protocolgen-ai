import React, { useState, useEffect } from 'react';
import { useProtocol } from '../hooks/useProtocol';

const fidelityDescriptions: Record<string, string> = {
  alta: 'Usa simuladores avanzados y se enfoca en la toma de decisiones críticas.',
  media: 'Usa maniquíes simples o pacientes estandarizados para practicar algoritmos.',
  baja: 'Enfocado en la comunicación y la discusión, con mínimo equipamiento.',
};

const studentLevels = [
  { value: 'estudiante de pregrado (ciclos básicos)', label: 'Pregrado (Básico)' },
  { value: 'estudiante de pregrado (ciclos clínicos)', label: 'Pregrado (Clínico)' },
  { value: 'médico interno', label: 'Interno' },
  { value: 'médico residente de primer año', label: 'Residente (R1)' },
  { value: 'médico residente de alta especialidad o fellow', label: 'Fellow / Especialista' },
];

const TopicForm: React.FC = () => {
  const { generate, loadingAction } = useProtocol();
  const [topic, setTopic] = useState('');
  const [fidelity, setFidelity] = useState('media');
  const [studentLevel, setStudentLevel] = useState('médico interno');

  const isGenerating = loadingAction === 'generate';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isGenerating) {
      void generate(topic.trim(), fidelity, studentLevel);
    }
  };

  return (
    <section className="no-print mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <div className="mb-6">
        <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          1. Definir el Tema Clínico
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Introduzca la patología, seleccione la fidelidad y la IA generará un protocolo detallado.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Shock Séptico en paciente adulto"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors duration-200 placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
            required
            maxLength={200}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="fidelityLevelSelect"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nivel de Fidelidad
            </label>
            <select
              id="fidelityLevelSelect"
              value={fidelity}
              onChange={(e) => setFidelity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="alta">Alta Fidelidad</option>
              <option value="media">Media Fidelidad</option>
              <option value="baja">Baja Fidelidad</option>
            </select>
            <p className="mt-2 h-4 text-sm text-gray-500 dark:text-gray-400">
              {fidelityDescriptions[fidelity]}
            </p>
          </div>
          <div>
            <label
              htmlFor="studentLevelSelect"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nivel del Estudiante
            </label>
            <select
              id="studentLevelSelect"
              value={studentLevel}
              onChange={(e) => setStudentLevel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {studentLevels.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p className="mt-2 h-4 text-sm text-gray-500 dark:text-gray-400">
              Define el público objetivo.
            </p>
          </div>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="focus-ring flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:bg-primary/50"
          >
            {isGenerating ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <span>✨ Generar con IA</span>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TopicForm;
