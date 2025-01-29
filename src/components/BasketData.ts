import { IBasketData, ICards, TBasketList } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
    protected _listOfCards: TBasketList[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._listOfCards = []
    }

    addCardInBasket(card: Partial<ICards>, callback: Function | null): TBasketList[] {
        if (!this._listOfCards.some((item) => item.id === card.id)) {
            this._listOfCards = [{ id: card.id, price: card.price, title: card.title }, ...this._listOfCards];
        }

        if (callback) {
            callback();
        } else {
            this.events.emit('basket:changed');
        }
        
        return this._listOfCards
    }

    deletCard(cardId: string, callback: Function | null): TBasketList[] {
        this._listOfCards = this._listOfCards.filter((item) => item.id !== cardId);

        if (callback) {
            callback();
        } else {
            this.events.emit('basket:changed');
        }
        return this._listOfCards
    }

    countTotalAmount(card: TBasketList[]): number | null {
        this._listOfCards = card
        let totalAmount = 0;
        if (this._listOfCards.length !== 0) {
            for (let i = 0; (this._listOfCards.length - 1) >= i; i++) {
                totalAmount += this._listOfCards[i].price
            }
            return totalAmount;
        } else {
            return totalAmount
        }
    }

    get basketCard() {
        return this._listOfCards
    }

    resetBasket() {
        this._listOfCards = []
    }
}