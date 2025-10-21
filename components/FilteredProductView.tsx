import React, { useState } from 'react';
import type { Product, Action } from '../types';
import { MiniProductCard } from './MiniProductCard';
import { ProductDetailModal } from './ProductDetailModal';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

interface FilteredProductViewProps {
  products: Product[];
  isDevMode: boolean;
  onEditProduct: (product: Product | Partial<Product>) => void;
  onAddToCart: (product: Product) => void;
  dispatch: React.Dispatch<Action>;
  onAddNewProduct: () => void;
}

export const FilteredProductView: React.FC<FilteredProductViewProps> = ({ products, isDevMode, onEditProduct, onAddToCart, dispatch, onAddNewProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <MiniProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
         {isDevMode && (
             <div className="flex items-center justify-center aspect-square border-2 border-dashed border-gray-700 rounded-xl p-4">
                <button onClick={onAddNewProduct} style={{backgroundColor: ACCENT_COLOR}} className={`text-black px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-full font-bold hover:opacity-90 transition-opacity transform active:scale-95 duration-200`}>
                    + Додати
                </button>
            </div>
         )}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          isDevMode={isDevMode}
          onEditProduct={onEditProduct}
          dispatch={dispatch}
        />
      )}
    </section>
  );
};
