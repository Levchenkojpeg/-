import React from 'react';
import type { Product } from '../types';

interface ProductDetailsProps {
    product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    return (
        <div className="space-y-3 pt-4 border-t border-white/10">
            <div>
                <h4 className="font-semibold text-sm text-gray-300">{product.category === 'Спорядження' ? 'Матеріал' : 'Смак'}</h4>
                <p className="text-sm text-gray-400">{product.taste}</p>
            </div>
            <div>
                <h4 className="font-semibold text-sm text-gray-300">{product.category === 'Спорядження' ? 'Призначення' : 'Ефект'}</h4>
                <p className="text-sm text-gray-400">{product.effect}</p>
            </div>
            <div>
                <h4 className="font-semibold text-sm text-gray-300">Походження</h4>
                <p className="text-sm text-gray-400">{product.country}</p>
            </div>
             <div>
                <h4 className="font-semibold text-sm text-gray-300">Історія</h4>
                <p className="text-sm text-gray-400">{product.history}</p>
            </div>
        </div>
    );
};
