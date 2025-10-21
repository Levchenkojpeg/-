import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons';

const ACCENT_COLOR = '#FF6B00';

interface ExportDataModalProps {
  content: string;
  onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({ content, onClose }) => {
  const [copyButtonText, setCopyButtonText] = useState('Скопіювати в буфер');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`import type { AppContent } from './types';\n\nconst ACCENT_COLOR = '#FF6B00';\n\nexport const DEFAULT_CONTENT: AppContent = ${content};`);
    setCopyButtonText('Скопійовано!');
    setTimeout(() => setCopyButtonText('Скопіювати в буфер'), 2000);
  };
  
  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[100] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1D1D1D] text-white rounded-2xl shadow-2xl w-full max-w-2xl relative transform transition-all border border-white/10 max-h-[90vh] flex flex-col"
        onClick={handleModalContentClick}
        role="dialog"
        aria-modal="true"
      >
        <header className="p-6 border-b border-white/10 flex-shrink-0">
          <h2 className="text-xl font-bold">Зберегти зміни в базу</h2>
        </header>
        
        <div className="p-6 overflow-y-auto">
          <p className="text-gray-400 mb-4">Щоб назавжди зберегти ваші зміни, виконайте наступні кроки:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 bg-[#252525] p-4 rounded-lg border border-white/10">
            <li>Натисніть кнопку "Скопіювати в буфер" нижче.</li>
            <li>Відкрийте файл <code className="bg-[#333] px-1 py-0.5 rounded text-sm font-mono" style={{color: ACCENT_COLOR}}>database.ts</code> у вашому редакторі коду.</li>
            <li>Видаліть увесь вміст цього файлу.</li>
            <li>Вставте скопійований код у файл <code className="bg-[#333] px-1 py-0.5 rounded text-sm font-mono" style={{color: ACCENT_COLOR}}>database.ts</code> та збережіть його.</li>
          </ol>
          
          <textarea
            readOnly
            className="w-full h-48 mt-4 p-3 bg-[#252525] border border-white/10 rounded-lg font-mono text-xs focus:outline-none focus:ring-2"
            style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties}
            value={`import type { AppContent } from './types';\n\nconst ACCENT_COLOR = '${ACCENT_COLOR}';\n\nexport const DEFAULT_CONTENT: AppContent = ${content};`}
          />
        </div>

        <footer className="p-6 border-t border-white/10 flex-shrink-0 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-transparent border border-gray-700 text-gray-300 px-6 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-colors">
                Закрити
            </button>
            <button 
                onClick={handleCopy}
                style={{ backgroundColor: ACCENT_COLOR }} 
                className="text-black px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity min-w-[200px]"
            >
                {copyButtonText}
            </button>
        </footer>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
