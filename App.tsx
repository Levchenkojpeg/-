import React, { useState, useMemo, useEffect, useReducer, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryScroller } from './components/CategoryScroller';
import { ProductGrid } from './components/ProductGrid';
import { Mission } from './components/Mission';
import { AiAssistant } from './components/AiAssistant';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import type { Product, CartItem, AppContent, Action } from './types';
import { Editable } from './components/Editable';
import { ProductModal } from './components/ProductModal';
import { FilteredProductView } from './components/FilteredProductView';
import { DEFAULT_CONTENT } from './database';
import { ExportDataModal } from './components/ExportDataModal';

const LOCAL_STORAGE_KEY = 'urbanTeaContent';

// The usePrevious hook has been removed as it's no longer needed in this file.

function appContentReducer(state: AppContent, action: Action): AppContent {
  switch (action.type) {
    case 'SET_CONTENT':
      return action.payload;
    case 'UPDATE_HERO':
      return { ...state, hero: { ...state.hero, [action.payload.key]: action.payload.value } };
    case 'UPDATE_LEVEL_CONFIG':
      return { ...state, levelConfig: { ...state.levelConfig, [action.payload.level]: { ...state.levelConfig[action.payload.level], [action.payload.key]: action.payload.value } } };
    case 'UPDATE_MISSION':
      return { ...state, mission: action.payload.value };
    case 'SAVE_PRODUCT':
      const productToSave = action.payload.product;
      let newProducts: Product[];
      if ('id' in productToSave && productToSave.id) {
        newProducts = state.products.map(p => p.id === productToSave.id ? {...p, ...productToSave} as Product : p);
      } else {
        const newProductWithId = { ...productToSave, id: Date.now() } as Product;
        newProducts = [...state.products, newProductWithId];
      }
      return { ...state, products: newProducts };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload.productId) };
    case 'RESET_CONTENT':
      if (window.confirm("Ви впевнені, що хочете скинути всі зміни до початкових? Цю дію не можна буде скасувати.")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return DEFAULT_CONTENT;
      }
      return state;
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [appContent, dispatch] = useReducer(appContentReducer, DEFAULT_CONTENT);
  const [selectedCategory, setSelectedCategory] = useState<string>('Усі');
  const [editingProduct, setEditingProduct] = useState<Product | Partial<Product> | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const productsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedContent) {
        dispatch({ type: 'SET_CONTENT', payload: JSON.parse(savedContent) });
      }
    } catch (error) {
      console.error("Failed to load content from localStorage", error);
    }
  }, []);

  useEffect(() => {
    // If in developer mode, save content changes to localStorage immediately.
    // This ensures that edits persist across page reloads while editing.
    if (isDevMode) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appContent));
      } catch (error) {
          console.error("Failed to save content to localStorage", error);
      }
    }
  }, [isDevMode, appContent]);
  
  const handleScrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductSave = (product: Product | Partial<Product>) => {
    dispatch({ type: 'SAVE_PRODUCT', payload: { product } });
    setEditingProduct(null);
  };
  
  const handleAddNewProduct = (level: number) => {
    setEditingProduct({
        name: "Новий продукт",
        category: selectedCategory !== 'Усі' ? selectedCategory : "Пуер",
        year: new Date().getFullYear(),
        country: "Країна походження",
        description: "Короткий опис товару",
        taste: "Опис смаку",
        effect: "Опис ефекту",
        history: "Історія товару",
        image: "https://images.unsplash.com/photo-1594631252845-69272b635481?q=80&w=1287&auto=format&fit=crop",
        price: 100,
        level: level,
        weight: "50 г",
    });
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === product.id);
        if (existingItem) {
            return prevItems.map(item =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
      setCartItems(prevItems => {
          if (newQuantity <= 0) {
              return prevItems.filter(item => item.product.id !== productId);
          }
          return prevItems.map(item =>
              item.product.id === productId ? { ...item, quantity: newQuantity } : item
          );
      });
  };

  const categories = useMemo(() => ['Усі', ...Array.from(new Set(appContent.products.map(p => p.category)))], [appContent.products]);
  
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Усі') {
      return appContent.products;
    }
    return appContent.products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, appContent.products]);

  const productsByLevel = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const level = product.level || 1;
      (acc[level] = acc[level] || []).push(product);
      return acc;
    }, {} as Record<number, Product[]>);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen font-sans bg-[#1A1A1A] text-[#E0E0E0]">
      <Header cartItems={cartItems} onCartClick={() => setIsCartOpen(!isCartOpen)} />
      <Hero 
        isDevMode={isDevMode} 
        content={appContent.hero}
        onContentChange={(key, value) => dispatch({ type: 'UPDATE_HERO', payload: { key, value } })}
        onScrollToProducts={handleScrollToProducts}
      />
      <main ref={productsRef}>
        <div className="container mx-auto px-4 md:px-8">
            <CategoryScroller 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
        </div>

        <div className="container mx-auto px-4 md:px-8">
           {selectedCategory === 'Усі' ? (
             Object.keys(appContent.levelConfig)
              .sort((a, b) => Number(a) - Number(b))
              .map((levelStr) => {
                  const level = Number(levelStr);
                  const products = productsByLevel[level] || [];
                  const ACCENT_COLOR = '#FF6B00';
                  return (
                  <section key={level} className="py-16 md:py-24">
                      <div className="mb-12 max-w-3xl">
                          <Editable 
                              as="h3" 
                              isEditing={isDevMode} 
                              onSave={(value) => dispatch({ type: 'UPDATE_LEVEL_CONFIG', payload: { level, key: 'title', value } })}
                              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
                          >
                              {appContent.levelConfig[level]?.title || `Level ${level}`}
                          </Editable>
                          <Editable
                              as="p"
                              isEditing={isDevMode}
                              onSave={(value) => dispatch({ type: 'UPDATE_LEVEL_CONFIG', payload: { level, key: 'description', value } })}
                              className="text-gray-400 text-lg"
                          >
                              {appContent.levelConfig[level]?.description || ''}
                          </Editable>
                      </div>
                      
                      {products.length > 0 ? (
                          <ProductGrid 
                              products={products}
                              isDevMode={isDevMode}
                              onEditProduct={setEditingProduct}
                              dispatch={dispatch}
                              onAddToCart={handleAddToCart}
                          />
                      ) : (
                         <div className="text-center py-12">
                              {isDevMode ? (
                                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-8">
                                      <p className="text-gray-500 mb-4">Тут поки що порожньо.</p>
                                      <button onClick={() => handleAddNewProduct(level)} style={{backgroundColor: ACCENT_COLOR}} className={`text-black px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity transform active:scale-95 duration-200`}>
                                          + Додати товар
                                      </button>
                                  </div>
                              ) : (
                                  <p className="text-gray-500">Товари в цій категорії відсутні.</p>
                              )}
                          </div>
                      )}

                       {isDevMode && products.length > 0 && (
                          <div className="text-center mt-12">
                              <button onClick={() => handleAddNewProduct(level)} style={{backgroundColor: ACCENT_COLOR}} className={`text-black px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity transform active:scale-95 duration-200`}>
                                  + Додати товар до {appContent.levelConfig[level]?.title}
                              </button>
                          </div>
                      )}
                  </section>
                  )
              })
           ) : (
            <FilteredProductView
              products={filteredProducts}
              isDevMode={isDevMode}
              onEditProduct={setEditingProduct}
              onAddToCart={handleAddToCart}
              dispatch={dispatch}
              onAddNewProduct={() => handleAddNewProduct(1)} // Default to level 1 for new products from filtered view
            />
           )}
        </div>

        <Mission 
          isDevMode={isDevMode} 
          missionText={appContent.mission} 
          onMissionChange={(value) => dispatch({ type: 'UPDATE_MISSION', payload: { value } })} 
        />
      </main>
      <AiAssistant products={appContent.products} onAddToCart={handleAddToCart} cartItems={cartItems} />
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems} 
        onUpdateQuantity={handleUpdateCartQuantity} 
      />
      <Footer 
        isDevMode={isDevMode} 
        onToggleDevMode={() => setIsDevMode(!isDevMode)} 
        onReset={() => dispatch({ type: 'RESET_CONTENT' })}
        onExport={() => setIsExportModalOpen(true)}
      />
      {editingProduct && (
        <ProductModal 
            product={editingProduct}
            onSave={handleProductSave}
            onClose={() => setEditingProduct(null)}
        />
      )}
      {isExportModalOpen && (
        <ExportDataModal
          content={JSON.stringify(appContent, null, 2)}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
