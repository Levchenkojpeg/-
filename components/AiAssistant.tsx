
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import type { ChatMessage, Product, CartItem } from '../types';
import { ChatIcon, SendIcon, CloseIcon, PlusIcon } from './icons';

const ACCENT_COLOR = '#FF6B00'; // Vibrant Orange

const AiIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.197-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.197a2.25 2.25 0 001.423 1.423l1.197.398-1.197.398a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);


const ProductRecommendationCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => {
    return (
        <div className="mt-3 pt-3 flex items-center gap-3 border-t border-white/20">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow min-w-0">
                <p className="font-semibold truncate text-sm text-white">{product.name}</p>
                <p className="text-sm text-gray-400">{product.price} грн</p>
            </div>
            <button
                onClick={() => onAddToCart(product)}
                title="Додати в кошик"
                style={{ backgroundColor: ACCENT_COLOR }}
                className="w-9 h-9 flex items-center justify-center rounded-full text-black hover:opacity-90 transition-opacity flex-shrink-0"
            >
                <PlusIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const ProductRecommendationsGrid: React.FC<{ products: Product[]; onAddToCart: (product: Product) => void }> = ({ products, onAddToCart }) => {
    const displayedProducts = products.slice(0, 4);

    return (
        <div className="mt-3 pt-3 border-t border-white/20">
            <div className="grid grid-cols-2 gap-2">
                {displayedProducts.map(product => (
                    <div key={product.id} className="bg-[#333]/70 rounded-lg p-2 flex flex-col items-center text-center relative group transition-all duration-200 hover:bg-[#444]">
                        <div className="relative w-16 h-16 mb-2">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-md" />
                            <button
                                onClick={() => onAddToCart(product)}
                                title="Додати в кошик"
                                style={{ backgroundColor: ACCENT_COLOR }}
                                className="absolute inset-0 bg-black/60 w-full h-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                            >
                                <PlusIcon className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="h-10 flex items-center px-1">
                             <p className="font-semibold text-xs text-white leading-tight">{product.name}</p>
                        </div>
                        <p className="text-xs font-bold" style={{ color: ACCENT_COLOR }}>{product.price} грн</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface AiAssistantProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    cartItems: CartItem[];
}

const SYSTEM_INSTRUCTION = `Ви — AI-сомельє від URBAN TEA. Ваш стиль — сучасний, лаконічний та точний, як архітектура мегаполіса. Ви звертаєтесь до користувача на "ви". Ваша мета — допомогти обрати чай, що відповідає ритму міського життя.

**Важливо:** У КОЖНІЙ своїй відповіді, незалежно від запиту, ви ПОВИННІ рекомендувати один відповідний товар з каталогу. Для цього ОБОВ'ЯЗКОВО використовуйте інструмент 'findTea'. Ваша відповідь має містити як текстову частину, так і рекомендацію товару. Навіть якщо користувач просто вітається, запропонуйте йому щось, що може його зацікавити.

Використовуйте метафори міста: "Шукаємо напій для спринту по дедлайнах чи для чілу на даху з видом на нічне місто?".

Презентуйте чай як інструмент для сучасного міського жителя: "Для вашого брейншторму ідеально підійде 'Summit Sheng'. Це ваш заряд енергії та ясності, щоб підкорити будь-який проект."

Будьте сучасним гідом у світі чаю. Мова спілкування — українська.`;


const findTeaFunctionDeclaration: FunctionDeclaration = {
    name: 'findTea',
    description: 'Знаходить чай, що відповідає запиту користувача щодо енергії, відпочинку, смаку чи атмосфери.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            searchTerm: {
                type: Type.STRING,
                description: "Ключове слово для пошуку, наприклад: 'енергія', 'розслаблення', 'зігрітися', 'фруктовий', 'деревний'.",
            },
        },
        required: ['searchTerm'],
    },
};

const GREETINGS = [
    'Вітаю в URBAN TEA. Потрібна енергія для дедлайнів чи релакс після робочого дня?',
    'Час для паузи. Який чай допоможе вам зловити дзен у центрі міста?',
    'URBAN TEA на зв\'язку. Допоможу знайти ідеальний напій для вашого ритму.',
    'Шукаєте натхнення? Розкажіть, який настрій, а я підберу чай.'
];

const initialMessage: ChatMessage = {
    id: Date.now(),
    sender: 'ai',
    text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
};


// Helper hook to get the previous value of a state or prop
function usePrevious<T>(value: T): T | undefined {
  // FIX: useRef<T>() is invalid because it requires an initial value for the generic type T. Initialized with undefined and updated type to T | undefined.
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ products, onAddToCart, cartItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);
    const prevCartItems = usePrevious(cartItems);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, messages[messages.length - 1]?.text]);

    // Effect to check for new items in cart and suggest pairings
    useEffect(() => {
        if (!prevCartItems || isLoading) return;

        const currentIds = new Set(cartItems.map(item => item.product.id));
        const prevIds = new Set(prevCartItems.map(item => item.product.id));

        if (currentIds.size > prevIds.size) {
            const newId = [...currentIds].find(id => !prevIds.has(id));
            if (newId) {
                const newItem = cartItems.find(item => item.product.id === newId);
                if (newItem) {
                    getPairingSuggestion(newItem.product);
                }
            }
        }
    }, [cartItems, isLoading]);

    const toggleChat = () => setIsOpen(!isOpen);

    const findTea = (args: { searchTerm?: string }): Product | null => {
        if (!args.searchTerm) return null;
        const term = args.searchTerm.toLowerCase();
        for (const product of products) {
            if (product.name.toLowerCase().includes(term) ||
                product.taste.toLowerCase().includes(term) ||
                product.effect.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term)) {
                return product;
            }
        }
        return null; 
    };

    const getPairingSuggestion = async (product: Product) => {
        setIsOpen(true);
        setIsLoading(true);
    
        const productCatalogString = products
            .filter(p => p.id !== product.id)
            .map(p => p.name)
            .join(', ');
    
        const pairingPrompt = `Користувач додав '${product.name}' в кошик. Проаналізуй цей товар (категорія: ${product.category}, опис: ${product.description}).
    Ось доступний каталог товарів для рекомендації: [${productCatalogString}].
    З цього каталогу, запропонуй 4 найкращих супутніх товари, які доповнять вибір користувача. Не пропонуй товар, який вже додали ('${product.name}').
    Сформулюй коротке, дружнє повідомлення для користувача, яке пояснює твій вибір.
    Поверни результат у форматі JSON. Назви товарів мають ТОЧНО відповідати назвам з каталогу.`;
    
        const pairingResponseSchema = {
            type: Type.OBJECT,
            properties: {
                recommendations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: 'Точна назва одного рекомендованого товару з каталогу.'
                    },
                    description: 'Масив з рівно 4 назв рекомендованих товарів.'
                },
                responseText: {
                    type: Type.STRING,
                    description: 'Короткий супровідний текст для користувача.'
                }
            },
            required: ['recommendations', 'responseText']
        };
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: pairingPrompt }] }],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: pairingResponseSchema,
                }
            });
    
            const jsonResponse = JSON.parse(response.text);
            const { recommendations, responseText } = jsonResponse;
    
            const recommendedProducts: Product[] = (recommendations as string[])
                .map((name: string) => products.find(p => p.name === name))
                .filter((p): p is Product => p !== undefined);
    
            setIsLoading(false);
    
            if (!responseText.trim() || recommendedProducts.length === 0) {
                return;
            }
    
            const aiMessageId = Date.now() + 1;
            setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '', products: recommendedProducts.slice(0, 4) }]);
    
            let charIndex = 0;
            const typingSpeed = 25;
            if (intervalRef.current) clearInterval(intervalRef.current);
    
            intervalRef.current = window.setInterval(() => {
                if (charIndex < responseText.length) {
                    setMessages(prev =>
                        prev.map(msg => msg.id === aiMessageId ? { ...msg, text: responseText.slice(0, charIndex + 1) } : msg)
                    );
                    charIndex++;
                } else {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, typingSpeed);
    
        } catch (error) {
            console.error("Помилка при отриманні рекомендації:", error);
            const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'ai', text: 'Вибачте, сталася помилка при пошуку рекомендації.' };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };


    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const textToSend = userInput.trim();
        if (!textToSend || isLoading) return;

        if (intervalRef.current) clearInterval(intervalRef.current);

        const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: textToSend };
        const currentMessages = [...messages, newUserMessage];
        setMessages(currentMessages);
        
        setUserInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const historyForAPI = currentMessages
                .filter(m => m.text) // Ensure no empty text messages are sent
                .map(msg => ({
                    role: msg.sender === 'ai' ? 'model' : 'user',
                    parts: [{ text: msg.text }]
                }));
            
            let response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: historyForAPI,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    tools: [{ functionDeclarations: [findTeaFunctionDeclaration] }],
                }
            });

            let recommendedProduct: Product | null = null;
            let finalResponseText = '';
            const functionCall = response.functionCalls?.[0];

            if (functionCall && functionCall.name === 'findTea') {
                let product = findTea(functionCall.args);
                if (!product && products.length > 0) {
                    product = products[Math.floor(Math.random() * products.length)];
                }

                recommendedProduct = product;
                const functionResponsePart = { functionResponse: { name: 'findTea', response: { productFound: !!product, name: product?.name } } };
                const historyWithFunctionCall = [ ...historyForAPI, { role: 'model', parts: [{ functionCall }] }, { role: 'tool', parts: [functionResponsePart] } ];
                const toolResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: historyWithFunctionCall, config: { systemInstruction: SYSTEM_INSTRUCTION } });
                finalResponseText = toolResponse.text;
            } else {
                finalResponseText = response.text;
                if (products.length > 0) {
                    recommendedProduct = products[Math.floor(Math.random() * products.length)];
                }
            }
            
            setIsLoading(false);
            if (!finalResponseText.trim()) return;

            const aiMessageId = Date.now() + 1;
            setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '', products: recommendedProduct ? [recommendedProduct] : undefined }]);

            let charIndex = 0;
            const typingSpeed = 25;

            intervalRef.current = window.setInterval(() => {
                if (charIndex < finalResponseText.length) {
                    setMessages(prev =>
                        prev.map(msg => msg.id === aiMessageId ? { ...msg, text: finalResponseText.slice(0, charIndex + 1) } : msg)
                    );
                    charIndex++;
                } else {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, typingSpeed);

        } catch (error) {
            console.error("Помилка при зверненні до Gemini API:", error);
            const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'ai', text: 'Помилка системи. Будь ласка, спробуйте пізніше.' };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleChat}
                style={{ backgroundColor: ACCENT_COLOR }}
                className="fixed bottom-6 right-6 text-black h-16 w-16 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-110 z-50"
                aria-label="Open AI Assistant"
            >
                <ChatIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-[#252525]/80 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right transform scale-100 border border-white/10">
                    <header className="flex items-center justify-between p-4 border-b border-white/10">
                        <h3 className="font-semibold text-lg text-white">AI-гід</h3>
                        <button onClick={toggleChat} className="text-gray-500 hover:text-white">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                    {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0 border border-white/10"><AiIcon className="w-5 h-5" style={{ color: ACCENT_COLOR }}/></div>}
                                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[#333] text-white rounded-br-lg' : 'bg-[#333] text-gray-300 rounded-bl-lg'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        {msg.products && msg.products.length > 0 && (
                                            msg.products.length === 1 ? (
                                                <ProductRecommendationCard product={msg.products[0]} onAddToCart={onAddToCart} />
                                            ) : (
                                                <ProductRecommendationsGrid products={msg.products} onAddToCart={onAddToCart} />
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0 border border-white/10"><AiIcon className="w-5 h-5" style={{ color: ACCENT_COLOR }}/></div>
                                    <div className="max-w-[80%] p-3 rounded-2xl">
                                        <div className="flex items-center justify-center space-x-1.5">
                                            <div style={{ backgroundColor: ACCENT_COLOR }} className="w-2 h-2 rounded-full animate-pulse"></div>
                                            <div style={{ backgroundColor: ACCENT_COLOR }} className="w-2 h-2 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                            <div style={{ backgroundColor: ACCENT_COLOR }} className="w-2 h-2 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                        <div className="relative">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Опишіть ваш запит..."
                                className="w-full pl-4 pr-12 py-3 bg-[#333] border border-white/10 rounded-full focus:outline-none focus:ring-2 transition-shadow text-white placeholder-gray-500"
                                style={{'--tw-ring-color': ACCENT_COLOR} as React.CSSProperties}
                                disabled={isLoading}
                            />
                            <button type="submit" style={{ backgroundColor: ACCENT_COLOR }} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-black w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity" disabled={isLoading || !userInput.trim()}>
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};