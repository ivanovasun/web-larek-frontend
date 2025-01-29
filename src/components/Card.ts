import { ICards } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export class Card extends Component<ICards> {
    protected events: IEvents;
    protected deletBtn?: HTMLButtonElement;
    protected buyBtn: HTMLButtonElement;
    protected cardBtnGallery?: HTMLButtonElement;
    protected cardImg: HTMLImageElement;
    protected cardTitle: HTMLElement;
    protected cardText: HTMLElement;
    protected cardCategory: HTMLElement;
    protected cardPrice: HTMLElement;
    protected cardId: string;
    protected cardIndex: HTMLElement;


    constructor(protected container: HTMLTemplateElement, events: IEvents) {
        super(container);
        this.events = events;

        if (this.container.classList.contains('basket__item')) {
            this.deletBtn = this.container.querySelector('.basket__item-delete');
            this.deletBtn.addEventListener('click', () =>
                this.events.emit('card:delete', { card: this })
            );
            this.cardIndex = this.container.querySelector('.basket__item-index');
        }
        if (this.container.classList.contains('card_full')) {
            this.buyBtn = this.container.querySelector('.card__button-buy');
            this.buyBtn.addEventListener('click', () =>
                this.events.emit('card:submit', { card: this, isSelected: this.isSelected() })

            );
        }
        if (this.container.classList.contains('gallery__item')) {
            this.container.addEventListener('click', () =>
                this.events.emit('card:select', { card: this })
            );
        }

        this.cardImg = this.container.querySelector('.card__image');
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardText = this.container.querySelector('.card__text');
        this.cardCategory = this.container.querySelector('.card__category');
        this.cardPrice = this.container.querySelector('.card__price');
    }

    isSelected() {
        this.buyBtn.classList.toggle('card__button-buy_inactive')
        if (this.buyBtn.classList.contains('card__button-buy_inactive')) {
            this.buyBtn.disabled = true;
        }
    }

    set valid(value: boolean) {
        this.buyBtn.disabled = !value;
    }

    set id(id: string) {
        this.cardId = id;
    }

    get id() {
        return this.cardId;
    }

    set title(title: string) {
        this.cardTitle.textContent = title;
        if (this.cardImg) {
            this.cardImg.alt = this.cardTitle.textContent
        }
    }

    set image(src: string) {
        if (this.cardImg) {
            this.cardImg.src = src
        }
    }

    set description(description: string) {
        if (this.cardText) {
            this.cardText.textContent = description
        };
    }

    set category(category: string) {
        if (this.cardCategory) {
            this.cardCategory.textContent = category
        }
    }

    set price(price: number) {
        if (price === null) {
            this.cardPrice.textContent = 'Бесценно';
        } else {
            this.cardPrice.textContent = `${price} синапсов`;
        }
    }

    set index(value: number) {
        this.cardIndex.textContent = String(value);
    }
}