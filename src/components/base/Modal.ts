import { Component } from "./Component";
import { IEvents } from "./events";

interface ICardsContainer {
    catalog: HTMLElement[] | HTMLElement;
}

export class Modal extends Component<ICardsContainer> {
    protected modal: HTMLElement;
    protected events: IEvents;
    protected renderContainer: HTMLElement;
    protected _catalog: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.renderContainer = this.container.querySelector('.modal__content');

        const closeBtnElement = this.container.querySelector('.modal__close');
        closeBtnElement.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('mousedown', (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close();
            }
        });
        this.handleEscUp = this.handleEscUp.bind(this);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:close');
    }

    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }

    set catalog(items: HTMLElement[] | HTMLElement) {
        if (Array.isArray(items)) {
            this.renderContainer.replaceChildren(...items);
        } else {
            this.renderContainer.replaceChildren(items)
        }
    }
}