// Карточки товаров
export interface ICards {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
}

// Данные заказа
export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
    validEventOrder(): { valid: boolean, error: string };
    validEventcontacts(): { valid: boolean, error: string };
    clearAll(): void;
}

//Данные заказа и пользователя
export interface IOrder extends Partial<IOrderForm> {
    items: string[];
    total: number;
}

export interface IOrderAnswer {
    id: string;
    total: number;
}

// Коллекция карточек, методы для работы с карточками - интерфейс модели данных
export interface ICardsData {
    card: ICards[];
    preview: string | null; //место где хранится ид выбранной карточки
    getCardById(cardId: string): ICards;
}

//Функционал работы корзины - интерфейс модели данных
export interface IBasketData {
    basketCard: TBasketList[];
    deletCard(cardId: string, callback: Function | null): void;
    addCardInBasket(card: Partial<ICards>, callback: Function | null): void;
    getTotalAmount(): number;
    resetBasket(): void;
}

//Действия, которые может производить пользователь в форме заказа - интерфейс модели данных
export interface IOrderData {
    addCardsInOrder(card: TBasketList[]): string[];
    deletCardInOrder(cardId: string): string[];
    clearAll(): void;
}

//Данные для отображения коллекции карточек на главной странице 
export type TCardList = Pick<ICards, 'image' | 'title' | 'category' | 'price'>;

//Данные для отображения выбранных товаров в корзине
export type TBasketList = Pick<ICards, 'id' | 'price' | 'title'>;

export type TPayment = 'cash' | 'card'

export interface IApi {
    getCards: () => Promise<ICards[]>;
    getCardsById: (cardId: string) => Promise<ICards>;
    setOrderInfo: (data: IOrder) => Promise<IOrderAnswer>;
}