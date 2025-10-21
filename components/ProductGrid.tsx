import React, { useState } from 'react';
import type { Product, Action } from '../types';
import { TrashIcon, PlusIcon, ChevronDownIcon } from './icons';
import { ProductDetails } from './ProductDetails';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

interface ProductCardProps {
  product: Product;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isDevMode: boolean;
  onEdit: (product: Product) => void;
  dispatch: React.Dispatch<Action>;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isExpanded, onToggleExpand, isDevMode, onEdit, dispatch, onAddToCart }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_PRODUCT', payload: { productId: product.id }});
    setIsConfirmingDelete(false);
  };
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="group relative flex flex-col bg-[#252525] rounded-xl overflow-hidden border border-white/10 transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div 
          onClick={handleAddToCartClick}
          style={{ backgroundColor: ACCENT_COLOR }}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 active:scale-90 z-10"
        >
          <PlusIcon className="w-8 h-8 text-black" />
        </div>
        {isDevMode && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="bg-black/60 text-white hover:bg-black w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
            </button>
             {isConfirmingDelete ? (
              <div className="flex gap-1 items-center bg-black/80 rounded-full px-2 shadow">
                  <span className="text-xs font-medium">Точно?</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="text-xs text-red-500 hover:font-bold">Так</button>
                  <button onClick={(e) => { e.stopPropagation(); setIsConfirmingDelete(false); }} className="text-xs hover:font-bold">Ні</button>
              </div>
            ) : (
               <button onClick={(e) => { e.stopPropagation(); setIsConfirmingDelete(true); }} className="bg-black/60 text-red-500 hover:bg-black w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow">
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col cursor-pointer" onClick={onToggleExpand}>
        <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-semibold text-white pr-2">{product.name}</h3>
            <div className="flex items-baseline gap-2 whitespace-nowrap flex-shrink-0">
                {product.weight && <p className="text-sm text-gray-400">{product.weight}</p>}
                <p className="text-lg font-bold" style={{ color: ACCENT_COLOR }}>{product.price} грн</p>
            </div>
        </div>
        <p className="text-sm text-gray-400 mb-3">{product.year > 0 ? `${product.category}, ${product.year}` : product.category}</p>
        <p className="text-sm text-gray-300 min-h-[40px]">{product.description}</p>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 mt-4' : 'max-h-0'}`}>
            <ProductDetails product={product} />
        </div>

        <div className="mt-auto pt-4 flex justify-center">
            <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
};


interface ProductGridProps {
  products: Product[];
  isDevMode: boolean;
  onEditProduct: (product: Product) => void;
  dispatch: React.Dispatch<Action>;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isDevMode, onEditProduct, dispatch, onAddToCart }) => {
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  const handleToggleExpand = (productId: number) => {
    setExpandedProductId(prevId => (prevId === productId ? null : productId));
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          isExpanded={expandedProductId === product.id}
          onToggleExpand={() => handleToggleExpand(product.id)}
          isDevMode={isDevMode}
          onEdit={onEditProduct}
          dispatch={dispatch}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};