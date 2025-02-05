import { createElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasketView {
    items: HTMLElement[],
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        this.events = events;

        this._button.addEventListener('click', () => {
            this.events.emit('order-form: open');
            this.events.emit('order:changed');
        });

        this.items = []
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this._total.textContent = '0 синапсов';
            this._button.disabled = true;
        }
    }

    set total(total: number) {
        this._total.textContent = `${String(total)} синапсов`;
    }
}