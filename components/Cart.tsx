import React, { useMemo } from 'react';
import type { CartItem } from '../types';
import { CloseIcon, CartIcon, PlusIcon, MinusIcon, TrashIcon } from './icons';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity }) => {
    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }, [cartItems]);

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div 
                className={`fixed top-0 right-0 w-full max-w-md h-full bg-[#252525]/90 backdrop-blur-2xl shadow-2xl flex flex-col z-[70] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-white/10`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h3 className="font-semibold text-lg text-white">Спорядження</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <CartIcon className="w-16 h-16 text-gray-700 mb-4" />
                            <p className="text-gray-500">Ваш рюкзак порожній.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            {cartItems.map(item => (
                                <div key={item.product.id} className="flex items-center gap-4 bg-[#333] p-3 rounded-lg">
                                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold truncate text-white">{item.product.name}</p>
                                        <p className="text-sm text-gray-400">{item.product.price} грн</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-white"><MinusIcon className="w-4 h-4"/></button>
                                            <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-white"><PlusIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="font-bold text-white text-lg whitespace-nowrap">{item.product.price * item.quantity} грн</p>
                                        <button onClick={() => onUpdateQuantity(item.product.id, 0)} className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {cartItems.length > 0 && (
                    <footer className="p-4 border-t border-white/10 bg-[#252525]/90 flex-shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg text-gray-300">Всього:</span>
                            <span className="text-xl font-bold text-white">{totalPrice} грн</span>
                        </div>
                        <button 
                            style={{ backgroundColor: ACCENT_COLOR }}
                            className="w-full text-black py-3 rounded-full font-bold hover:opacity-90 transition-opacity transform active:scale-95 duration-200"
                        >
                            Оформити замовлення
                        </button>
                    </footer>
                )}
            </div>
        </>
    );
};