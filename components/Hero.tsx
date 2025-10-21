import React, { useRef } from 'react';
import { Editable } from './Editable';
import { ImageIcon } from './icons';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

interface HeroProps {
  isDevMode: boolean;
  content: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  onContentChange: (key: 'title' | 'subtitle' | 'backgroundImage', value: string) => void;
  onScrollToProducts: () => void;
}


export const Hero: React.FC<HeroProps> = ({ isDevMode, content, onContentChange, onScrollToProducts }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const heroStyle: React.CSSProperties = {
    backgroundImage: `url('${content.backgroundImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onContentChange('backgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <section style={heroStyle} className="relative text-center h-screen flex items-center justify-center overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-black/60"></div>
      
      {isDevMode && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={handleEditImageClick}
            className="absolute top-4 right-4 z-20 bg-black/60 text-white hover:bg-black w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Змінити фонове зображення"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="relative z-10 p-4 flex flex-col items-center">
        <Editable
            as="h2"
            isEditing={isDevMode}
            onSave={(value) => onContentChange('title', value)}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 max-w-3xl tracking-tighter"
        >
          {content.title}
        </Editable>
        <Editable
            as="p"
            isEditing={isDevMode}
            onSave={(value) => onContentChange('subtitle', value)}
            className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-8"
        >
            {content.subtitle}
        </Editable>
        <button 
          onClick={onScrollToProducts}
          style={{ backgroundColor: ACCENT_COLOR }} 
          className="text-black text-lg font-bold px-8 py-4 rounded-full transition-opacity hover:opacity-90 transform active:scale-95"
        >
            до пригод
        </button>
      </div>
    </section>
  );
};
