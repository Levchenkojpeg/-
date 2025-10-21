import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { CloseIcon, PlusIcon } from './icons';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

interface ProductModalProps {
  product: Product | Partial<Product>;
  onSave: (product: Product | Partial<Product>) => void;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState(product);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumberField = ['price', 'year', 'level'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumberField ? Number(value) : value }));
  };
  
  const handleImageSelect = (imageUrl: string) => {
      setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start z-[100] p-4 pt-16 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#252525]/90 backdrop-blur-2xl text-white rounded-xl shadow-2xl w-full max-w-2xl relative transform transition-all border border-white/10"
        onClick={handleModalContentClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 sm:p-8">
            <h2 id="modal-title" className="text-2xl font-bold text-white mb-6">
                {'id' in formData && formData.id ? 'Редагувати спорядження' : 'Додати спорядження'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Назва</label>
                    <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties} />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">Категорія</label>
                    <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleChange} required className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties} />
                </div>
            </div>

            <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">Країна</label>
                <input type="text" name="country" id="country" value={(formData as Product).country || ''} onChange={handleChange} required className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties} />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Короткий опис</label>
                <textarea name="description" id="description" value={(formData as Product).description || ''} onChange={handleChange} required rows={2} className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties}></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-1">Ціна (грн)</label>
                    <input type="number" name="price" id="price" value={formData.price || ''} onChange={handleChange} required min="0" className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties} />
                </div>
                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-400 mb-1">Вага (напр. 50 г)</label>
                    <input type="text" name="weight" id="weight" value={(formData as Product).weight || ''} onChange={handleChange} className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties} />
                </div>
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-400 mb-1">Рік</label>
                    <input type="number" name="year" id="year" value={formData.year || ''} onChange={handleChange} min="0" max={new Date().getFullYear() + 1} className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties} />
                </div>
            </div>
            <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-400 mb-1">Колекція</label>
                <select name="level" id="level" value={formData.level || 1} onChange={handleChange} required className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties}>
                    <option value={1}>1 - Trail</option>
                    <option value={2}>2 - Basecamp</option>
                    <option value={3}>3 - Summit</option>
                </select>
            </div>


            <div>
                <label htmlFor="taste" className="block text-sm font-medium text-gray-400 mb-1">Смак / Матеріал</label>
                <textarea name="taste" id="taste" value={formData.taste || ''} onChange={handleChange} required rows={2} className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties}></textarea>
            </div>
            <div>
                <label htmlFor="effect" className="block text-sm font-medium text-gray-400 mb-1">Ефект / Призначення</label>
                <textarea name="effect" id="effect" value={formData.effect || ''} onChange={handleChange} required rows={2} className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties}></textarea>
            </div>
            <div>
                <label htmlFor="history" className="block text-sm font-medium text-gray-400 mb-1">Історія</label>
                <textarea name="history" id="history" value={(formData as Product).history || ''} onChange={handleChange} required rows={3} className={`w-full px-3 py-2 bg-[#333] border border-white/10 rounded-lg focus:outline-none focus:ring-2 transition`} style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties}></textarea>
            </div>
            
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Зображення</label>
                <div className="flex items-center gap-4">
                    <img src={formData.image || ''} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                    <div className="flex-1">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <button type="button" onClick={handleFileUploadClick} className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors p-4">
                            <PlusIcon className="w-5 h-5" />
                            <span className="font-medium">Завантажити з пристрою</span>
                        </button>
                    </div>
                </div>
            </div>


            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="bg-transparent border border-gray-700 text-gray-300 px-6 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-colors transform active:scale-95 duration-200">
                Скасувати
                </button>
                <button type="submit" style={{ backgroundColor: ACCENT_COLOR }} className="text-black px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity transform active:scale-95 duration-200">
                Зберегти
                </button>
            </div>
            </form>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};