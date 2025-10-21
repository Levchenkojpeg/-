import React, { useMemo, useState, useEffect, useRef } from 'react';
import { CartIcon } from './icons';
import type { CartItem } from '../types';

interface HeaderProps {
    cartItems: CartItem[];
    onCartClick: () => void;
}

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

export const Header: React.FC<HeaderProps> = ({ cartItems, onCartClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const totalItems = useMemo(() => {
      return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const prevTotalItems = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 400); // Animation duration
        return () => clearTimeout(timer);
    }
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  return (
    <header className="py-6 px-4 md:px-8 sticky top-0 z-40 bg-[#1A1A1A] border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 
          className="text-3xl md:text-4xl font-normal tracking-widest text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          URBAN TEA
        </h1>
        <nav className="hidden md:flex items-center space-x-8 text-gray-300">
          <a href="#" className="hover:text-white transition-colors duration-300">Каталог</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Концепція</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Контакти</a>
        </nav>
        <div className="flex items-center gap-4">
            <button onClick={onCartClick} className="relative text-gray-300 hover:text-white transition-colors duration-300">
                <CartIcon className="w-7 h-7" />
                {totalItems > 0 && (
                    <div 
                        style={{backgroundColor: ACCENT_COLOR}} 
                        className={`absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ${isAnimating ? 'animate-pop' : ''}`}
                    >
                        {totalItems}
                    </div>
                )}
            </button>
            <button className="md:hidden text-gray-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
        </div>
      </div>
    </header>
  );
};