export interface Product {
  id: number;
  category: string;
  name: string;
  year: number;
  country: string;
  description: string;
  taste: string;
  effect: string;
  history: string;
  image: string;
  price: number;
  level: number;
  weight?: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  products?: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type AppContent = {
    hero: {
        title: string;
        subtitle: string;
        backgroundImage: string;
    };
    products: Product[];
    levelConfig: Record<number, { title: string; description: string }>;
    mission: string;
};

export type Action =
  | { type: 'SET_CONTENT'; payload: AppContent }
  | { type: 'UPDATE_HERO'; payload: { key: 'title' | 'subtitle' | 'backgroundImage'; value: string } }
  | { type: 'UPDATE_LEVEL_CONFIG'; payload: { level: number; key: 'title' | 'description'; value: string } }
  | { type: 'UPDATE_MISSION'; payload: { value: string } }
  | { type: 'SAVE_PRODUCT'; payload: { product: Product | Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: { productId: number } }
  | { type: 'RESET_CONTENT' };