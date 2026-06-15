import React, { useEffect, useRef, useState } from 'react';
import saveAs from 'file-saver';
import { asBlob as htmlToDocxBlob } from 'html-docx-js';
import { useProtocol } from '../hooks/useProtocol';
import type { Protocol, VitalSigns } from '../types';

const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Clipboard: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Book: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  User: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Heart: () => (
    <svg className="mr-3 h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Lungs: () => (
    <svg className="mr-3 h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0a5 5 0 10-7.07 7.07l-3.537 3.536M18.364 5.636a5 5 0 00-7.07-7.07l-3.536 3.536" />
    </svg>
  ),
  Blood: () => (
    <svg className="mr-3 h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3z" />
    </svg>
  ),
  Thermometer: () => (
    <svg className="mr-3 h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Goal: () => (
    <svg className="mr-2 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
};

const getVitalIcon = (key: string): React.ReactNode => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('card') || lowerKey.includes('pulso')) return <icons.Heart />;
  if (lowerKey.includes('resp')) return <icons.Lungs />;
  if (lowerKey.includes('presion') || lowerKey.includes('arterial')) return <icons.Blood />;
  if (lowerKey.includes('temp')) return <icons.Thermometer />;
  return null;
};

interface InfoCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children }) => (
  <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
    <h4 className="mb-3 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
      {icon && <span className="mr-3 h-6 w-6">{icon}</span>}
      {title}
    </h4>
    <div className="prose prose-sm max-w-none space-y-2 text-gray-600 dark:prose-invert dark:text-gray-300">
      {children}
    </div>
  </div>
);

interface ResourceListProps {
  title: string;
  icon: React.ReactNode;
  items?: string[] | null;
}

const ResourceList: React.FC<ResourceListProps> = ({ title, icon, items }) => (
  <InfoCard title={title} icon={icon}>
    {items && items.length > 0 ? (
      <ul className="list-inside list-disc space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="italic text-gray-500">No especificado.</p>
    )}
  </InfoCard>
);

interface VitalSignsCardProps {
  vitals?: VitalSigns | null;
}

const VitalSignsCard: React.FC<VitalSignsCardProps> = ({ vitals }) => {
  if (!vitals || typeof vitals !== 'object') {
    return <p className="italic text-gray-500">Signos vitales no especificados.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {Object.entries(vitals).map(([key, value]) => (
        <div key={key} className="flex items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-700/50">
          {getVitalIcon(key)}
          <div>
            <span className="text-sm capitalize text-gray-500 dark:text-gray-400">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

interface GenericViewProps {
  data: unknown;
  title: string;
}

const GenericView: React.FC<GenericViewProps> = ({ data, title }) => {
  if (data === null || data === undefined) return null;
  if (typeof data === 'string') {
    return (
      <InfoCard title={title}>
        <p>{data}</p>
      </InfoCard>
    );
  }
  return (
    <InfoCard title={title}>
      <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre>
    </InfoCard>
  );
};

interface ClinicalCaseViewProps {
  data?: Protocol['casoClinico'] | null;
}

const ClinicalCaseView: React.FC<ClinicalCaseViewProps> = ({ data }) => {
  if (!data) return null;
  return (
    <div>
      <InfoCard title="Resumen del Caso" icon={<icons.Clipboard className="h-5 w-5" />}>
        <p>{data.resumenDelCaso}</p>
      </InfoCard>
      <InfoCard title="Historia del Paciente" icon={<icons.Book className="h-5 w-5" />}>
        <p>{data.historiaPaciente}</p>
      </InfoCard>
      <InfoCard title="Presentación Inicial" icon={<icons.User className="h-5 w-5" />}>
        <p>{data.presentacionInicial}</p>
      </InfoCard>
      <InfoCard title="Signos Vitales" icon={<icons.Heart />}>
        <VitalSignsCard vitals={data.signosVitales} />
      </InfoCard>
    </div>
  );
};

interface ObjectivesViewProps {
  data?: Protocol['objetivosAprendizaje'] | null;
}

const ObjectivesView: React.FC<ObjectivesViewProps> = ({ data }) => {
  if (!data) return null;
  return (
    <div>
      <InfoCard title="Objetivo General" icon={<icons.Goal />}>
        <p>{data.general}</p>
      </InfoCard>
      <ResourceList title="Objetivos Específicos" icon={<icons.Goal />} items={data.especificos} />
    </div>
  );
};

const studentLevels = [
  { value: 'estudiante de pregrado (ciclos básicos)', label: 'Pregrado (Básico)' },
  { value: 'estudiante de pregrado (ciclos clínicos)', label: 'Pregrado (Clínico)' },
  { value: 'médico interno', label: 'Interno' },
  { value: 'médico residente de primer año', label: 'Residente (R1)' },
  { value: 'médico residente de alta especialidad o fellow', label: 'Fellow / Especialista' },
];

const actionLabels: Record<'summarize' | 'suggest' | 'quiz', string> = {
  summarize: 'Resumir',
  suggest: 'Escenarios',
  quiz: 'Evaluación',
};

const ProtocolOutput: React.FC = () => {
  const { currentProtocol, loadingAction, runSecondaryAction, adjustLevel } = useProtocol();
  const [activeTab, setActiveTab] = useState('');
  const [studentLevel, setStudentLevel] = useState('médico interno');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!currentProtocol) return null;

  const protocol = currentProtocol;

  const protocolSections: Record<string, unknown> = {
    'Caso Clínico': protocol.casoClinico,
    Objetivos: protocol.objetivosAprendizaje,
    'Pre-briefing': protocol.puntosClavePrebriefing,
    Guion: protocol.guionDetallado,
    Recursos: protocol.entornoYSimulador,
    Roles: protocol.roles,
    Debriefing: protocol.puntosClaveDebriefing,
    Evaluación: protocol.instrumentosEvaluacion,
    Planificación: {
      Competencias: protocol.competencias,
      'Conocimientos Previos': protocol.conocimientosPrevios,
      'Materiales de Preparación': protocol.materialesPreparacion,
      Tiempos: protocol.flujogramaTiempos,
      'Notas Facilitador': protocol.notasFacilitador,
      'Plan Piloto': protocol.planPruebaPiloto,
      Referencias: protocol.referencias,
    },
  };

  useEffect(() => {
    setActiveTab(Object.keys(protocolSections)[0]);
  }, [protocol]);

  const handleDownload = (format: 'pdf' | 'docx' | 'txt') => {
    if (!contentRef.current) return;
    setIsDropdownOpen(false);

    const printableElement = contentRef.current;
    const originalTitle = document.title;
    document.title = `Protocolo - ${protocol.topic}`;

    if (format === 'pdf') {
      window.print();
    } else if (format === 'docx') {
      const htmlContent = `
        <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${document.title}</title></head><body>
        <h1>Protocolo de Simulación: ${protocol.topic}</h1>
        ${printableElement.innerHTML}
        </body></html>
      `;
      const blob = htmlToDocxBlob(htmlContent);
      saveAs(blob, `${document.title}.docx`);
    } else if (format === 'txt') {
      const text = printableElement.innerText;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${document.title}.txt`);
    }

    document.title = originalTitle;
  };

  const renderActiveTabContent = () => {
    const data = protocolSections[activeTab];
    if (!data) return <p className="p-4 text-center">Seleccione una pestaña para ver el contenido.</p>;

    switch (activeTab) {
      case 'Caso Clínico':
        return <ClinicalCaseView data={protocol.casoClinico} />;
      case 'Objetivos':
        return <ObjectivesView data={protocol.objetivosAprendizaje} />;
      default:
        if (typeof data === 'object' && data !== null) {
          return Object.entries(data).map(([key, value]) => {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            if (Array.isArray(value)) {
              return <ResourceList key={key} title={title} icon={<icons.Goal />} items={value} />;
            }
            return <GenericView key={key} data={value} title={title} />;
          });
        }
        return <GenericView data={data} title={activeTab} />;
    }
  };

  return (
    <section className="animate-fade-in rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <div className="no-print mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row">
        <div className="flex-1">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            2. Protocolo de Simulación Generado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Para: <span className="font-semibold text-primary">{protocol.topic}</span>
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs capitalize dark:bg-gray-600">
              {protocol.fidelity} Fidelidad
            </span>
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs capitalize dark:bg-gray-600">
              {protocol.level}
            </span>
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="focus-ring flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
          >
            <span>Imprimir / Descargar</span>
            <svg
              className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-700">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload('pdf');
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                🖨️ Imprimir / PDF
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload('docx');
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                📄 Word (.docx)
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload('txt');
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                📝 Texto Plano (.txt)
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="no-print mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['summarize', 'suggest', 'quiz'] as const).map((action) => (
          <button
            key={action}
            onClick={() => void runSecondaryAction(action)}
            disabled={!!loadingAction}
            className="focus-ring flex items-center justify-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 disabled:bg-gray-400 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            {loadingAction === action ? '...' : `✨ ${actionLabels[action]}`}
          </button>
        ))}
        <button
          onClick={() => void adjustLevel(studentLevel)}
          disabled={!!loadingAction}
          className="focus-ring flex items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loadingAction === 'adjust' ? '...' : '✨ Ajustar Nivel'}
        </button>
      </div>

      <div className="no-print mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
        <label htmlFor="studentLevelAdjust" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ajustar para Nivel de Estudiante
        </label>
        <select
          id="studentLevelAdjust"
          value={studentLevel}
          onChange={(e) => setStudentLevel(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          {studentLevels.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="no-print mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap overflow-x-auto">
          {Object.keys(protocolSections).map((title) => (
            <button
              key={title}
              onClick={() => setActiveTab(title)}
              className={`focus-ring whitespace-nowrap border-b-2 px-4 py-3 text-sm sm:text-base ${
                activeTab === title
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {title}
            </button>
          ))}
        </nav>
      </div>
      <div ref={contentRef}>{renderActiveTabContent()}</div>
    </section>
  );
};

export default ProtocolOutput;
