import { IBasketData, ICards, TBasketList } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
    protected _listOfCards: TBasketList[];
    protected events: IEvents;
    protected fullPrice: number;

    constructor(events: IEvents) {
        this.events = events;
        this._listOfCards = []
    }

    addCardInBasket(card: Partial<ICards>, callback: Function | null): void {
        if (!this._listOfCards.some((item) => item.id === card.id)) {
            this._listOfCards = [{ id: card.id, price: card.price, title: card.title }, ...this._listOfCards];
        }

        if (callback) {
            callback();
        } else {
            this.events.emit('basket:changed');
        }
    }

    deletCard(cardId: string, callback: Function | null): void {
        this._listOfCards = this._listOfCards.filter((item) => item.id !== cardId);

        if (callback) {
            callback();
        } else {
            this.events.emit('basket:changed');
        }
    }

    protected countTotalAmount(): number | null {
        let totalAmount = 0;
        for (let i = 0; (this._listOfCards.length - 1) >= i; i++) {
            totalAmount += this._listOfCards[i].price
        }
        return totalAmount;
    }

    getTotalAmount(): number {
        this.fullPrice = this.countTotalAmount()
        return this.fullPrice
    }

    get basketCards() {
        return this._listOfCards
    }

    resetBasket() {
        this._listOfCards = []
        this.events.emit('basket:changed');
    }
}