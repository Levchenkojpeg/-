import React from 'react';

interface FooterProps {
    isDevMode: boolean;
    onToggleDevMode: () => void;
    onReset: () => void;
    onExport: () => void;
}

const SettingsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

const ResetIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-5.12M20 15a9 9 0 01-14.13 5.12" />
    </svg>
)

const SaveToCodeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

export const Footer: React.FC<FooterProps> = ({ isDevMode, onToggleDevMode, onReset, onExport }) => {
  return (
    <footer className="py-10 px-4 md:px-8 border-t border-white/10 mt-24">
      <div className="container mx-auto text-center text-gray-500 relative">
        <p className="mb-4">&copy; {new Date().getFullYear()} URBAN TEA. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Telegram</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
        </div>
        <div className="absolute -top-2 right-0 flex items-center gap-2">
         {isDevMode && (
            <>
                <button onClick={onExport} title="Зберегти зміни в код" className="bg-green-500/20 text-green-400 hover:bg-green-500/40 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                    <SaveToCodeIcon className="w-5 h-5" />
                </button>
                <button onClick={onReset} title="Скинути до початкових" className="bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                    <ResetIcon className="w-5 h-5" />
                </button>
            </>
         )}
          <button 
            onClick={onToggleDevMode} 
            title="Режим розробника" 
            className={`bg-[#252525] hover:bg-[#333333] w-10 h-10 rounded-full flex items-center justify-center transition-colors`}
            style={{
                color: isDevMode ? ACCENT_COLOR : '#9CA3AF',
            }}
            >
            <SettingsIcon className="w-6 h-6" />
        </button>
      </div>
      </div>
    </footer>
  );
};
