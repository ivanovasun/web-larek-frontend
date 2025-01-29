import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
    counter: number;
    locked: boolean;
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _catalog: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = document.querySelector('.header__basket-counter');
        this._basket = document.querySelector('.header__basket');
        this._wrapper = document.querySelector('.page__wrapper');
        this._catalog = document.querySelector('.gallery');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}