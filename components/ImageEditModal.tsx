import React from 'react';
import type { Product } from '../types';
import { CloseIcon } from './icons';

// NOTE: This component is a placeholder for a future image editing feature.
// It is not currently wired into the application logic.

interface ImageEditModalProps {
  product: Product;
  onClose: () => void;
  // onSave: (newImageUrl: string) => void;
}

export const ImageEditModal: React.FC<ImageEditModalProps> = ({ product, onClose }) => {
  
  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[100] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#252525]/90 backdrop-blur-2xl text-white rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all border border-white/10"
        onClick={handleModalContentClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-modal-title"
      >
        <div className="p-6">
          <h2 id="image-modal-title" className="text-xl font-bold text-white mb-4">
            {product.name}
          </h2>
          
          <div className="aspect-square bg-[#1A1A1A] rounded-lg overflow-hidden mb-6">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>

          <div className="text-center">
            <p className="text-gray-400">Image editing functionality coming soon.</p>
          </div>

        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
