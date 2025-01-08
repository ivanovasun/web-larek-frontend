// Карточки товаров
export interface ICards {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number;
}

// Информация о покупателе 
export interface IUserInfo {
paymentMethod: string;
address: string;
email: string;
telephone: string;
}

// Данные заказа
export interface IOrder {
id?: string;
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
deletCard(cardId: string): void;
addCardInBusket(cardID: string):void;
listOfCards: TBasketList[];
}

//Действия, которые может производить пользователь в форме заказа - интерфейс модели данных
export interface UserInfoData { 
resetData():void;
choosePaymentAdress(data:TAdressPayment): void;
chooseEmailPhone(data:TEmailPhone): void;
}

// Данные для отображения коллекции карточек на главной странице 
export type TCardList = Pick<ICards,  'image' | 'title'| 'category' | 'price'>;

// Данные для отображения выбранных товаров в корзине
export type TBasketList= Pick<ICards, 'title' | 'price' | 'id'>;

// Данные пользователя: вид оплаты, адресс
export type TAdressPayment = Pick<IUserInfo, 'paymentMethod' | 'address'>;

// Данные пользователя: емейл, телефон
export type TEmailPhone = Pick< IUserInfo, 'email' | 'telephone'>;
