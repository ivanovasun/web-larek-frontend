import { Component } from "./base/Component";
import { IEvents } from "./base/events";


interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected events: IEvents;
    protected totalPrice: HTMLElement;
    protected btnOrderSucces: HTMLButtonElement;

    constructor(container: HTMLTemplateElement, events: IEvents) {
        super(container);
        this.events = events;

        this.totalPrice = this.container.querySelector('.order-success__description');
        this.btnOrderSucces = this.container.querySelector('.order-success__close');

        this.btnOrderSucces.addEventListener('click', () => {
            this.events.emit('order-succes:close')
        })
    }

    set total(data: number) {
        this.totalPrice.textContent = `Списано ${data} синапсов`;
    }
}