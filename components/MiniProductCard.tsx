import React from 'react';
import type { Product } from '../types';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

interface MiniProductCardProps {
  product: Product;
  onClick: () => void;
}

export const MiniProductCard: React.FC<MiniProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="group relative aspect-square bg-[#252525] rounded-xl overflow-hidden border border-white/10 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h3 className="font-semibold text-sm md:text-base truncate">{product.name}</h3>
        <p className="text-sm font-bold" style={{ color: ACCENT_COLOR }}>
          {product.price} грн
        </p>
      </div>
    </div>
  );
};
