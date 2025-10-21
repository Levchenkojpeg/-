import React, { useState, useEffect } from 'react';
import type { Product, Action } from '../types';
import { CloseIcon, PlusIcon, TrashIcon } from './icons';
import { ProductDetails } from './ProductDetails';

const ACCENT_COLOR = '#FF6B00';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isDevMode: boolean;
  onEditProduct: (product: Product | Partial<Product>) => void;
  dispatch: React.Dispatch<Action>;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, isDevMode, onEditProduct, dispatch }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_PRODUCT', payload: { productId: product.id }});
    onClose();
  };

  const handleEdit = () => {
    onEditProduct(product);
    onClose();
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
        className="bg-[#1D1D1D] text-white rounded-2xl shadow-2xl w-full max-w-4xl relative transform transition-all border border-white/10 max-h-[90vh] flex flex-col md:flex-row"
        onClick={handleModalContentClick}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full md:w-1/2 flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"/>
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{product.name}</h2>
                        <p className="text-md text-gray-400 mb-2">{product.year > 0 ? `${product.category}, ${product.year}` : product.category}</p>
                    </div>
                    {isDevMode && (
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={handleEdit} className="bg-black/60 text-white hover:bg-black w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                            </button>
                            {isConfirmingDelete ? (
                                <div className="flex gap-1 items-center bg-black/80 rounded-full px-2 shadow">
                                    <span className="text-xs font-medium">Точно?</span>
                                    <button onClick={handleDelete} className="text-xs text-red-500 hover:font-bold">Так</button>
                                    <button onClick={() => setIsConfirmingDelete(false)} className="text-xs hover:font-bold">Ні</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsConfirmingDelete(true)} className="bg-black/60 text-red-500 hover:bg-black w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <p className="text-gray-300 mt-4 mb-6">{product.description}</p>
                
                <ProductDetails product={product} />
            </div>

            <div className="flex-shrink-0 mt-8 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center gap-4">
                     <div className="flex items-baseline gap-2 whitespace-nowrap">
                        {product.weight && <p className="text-md text-gray-400">{product.weight}</p>}
                        <p className="text-2xl font-bold" style={{ color: ACCENT_COLOR }}>{product.price} грн</p>
                    </div>
                    <button 
                        style={{ backgroundColor: ACCENT_COLOR }} 
                        onClick={() => onAddToCart(product)}
                        className="flex items-center justify-center gap-2 text-black px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity transform active:scale-95 duration-200"
                    >
                        <PlusIcon className="w-5 h-5"/>
                        <span>Додати в кошик</span>
                    </button>
                </div>
            </div>
        </div>

        <button onClick={onClose} className="absolute -top-3 -right-3 text-gray-300 bg-[#1A1A1A] hover:text-white p-2 rounded-full border border-white/10" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
