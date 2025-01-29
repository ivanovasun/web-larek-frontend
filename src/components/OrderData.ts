import { IOrder, TBasketList } from "../types";
import { IEvents } from "./base/events";

export class OrderData implements IOrder {
    protected _total: number;
    protected _items: string[];
    protected _payment: string;
    protected _email: string;
    protected _phone: string;
    protected _address: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._items = [];
    }

    set payment(data: string) {
        this._payment = data;
    }

    get payment() {
        return this._payment
    }

    set email(data: string) {
        this._email = data;
    }
    get email() {
        return this._email
    }

    set phone(data: string) {
        this._phone = data;
    }
    get phone() {
        return this._phone
    }

    set address(data: string) {
        this._address = data;
    }

    get address() {
        return this._address
    }

    set total(data: number) {
        this._total = data;
    }
    get total() {
        return this._total
    }

    addCardsInOrder(card: TBasketList[]): string[] {

        card.forEach((item) => {
            if (!this._items.some((id) => item.id === id)) {
                this._items.push(item.id)
            }
        })
        return this._items
    }

    deletCardInOrder(cardId: string): string[] {
        this._items = this._items.filter(item => item !== cardId)
        return this._items;
    }

    get items() {
        return this._items
    }

    clearAll() {
        this._total = 0;
        this._items = [];
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
    }
}