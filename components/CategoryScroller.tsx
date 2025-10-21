import React from 'react';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

interface CategoryScrollerProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="py-8">
      <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              px-6 py-3 rounded-full text-base font-semibold whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A1A1A]
              ${selectedCategory === category
                ? `text-black`
                : 'bg-[#252525] hover:bg-[#333333] text-gray-300 border border-transparent'
              }
            `}
            // FIX: The `ringColor` style property is not valid. Replaced with `--tw-ring-color` CSS variable for Tailwind CSS to correctly set the focus ring color.
            style={{
                backgroundColor: selectedCategory === category ? ACCENT_COLOR : undefined,
                '--tw-ring-color': ACCENT_COLOR
            } as React.CSSProperties}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
