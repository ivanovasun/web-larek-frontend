import { IOrderForm } from "../../types";
import { Component } from "./Component";
import { IEvents } from "./events";

export class Form extends Component<IOrderForm> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected inputs: NodeListOf<HTMLInputElement>;
    protected _form: HTMLFormElement;
    protected formName: string;
    protected events: IEvents;
    protected BtnCash: HTMLButtonElement;
    protected BtnCard: HTMLButtonElement;
    protected BtnDiv: HTMLElement;

    constructor(container: HTMLTemplateElement, events: IEvents) {
        super(container);
        this.events = events;

        this._errors = this.container.querySelector('.form__errors');
        this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
        this._form = this.container.querySelector('.form');
        this.formName = this.container.getAttribute('name');
        this._submit = this.container.querySelector('.button[type=submit]');

        this.container.addEventListener('input', () => {
            const valuesObject: Record<string, string> = {};
            this.inputs.forEach((element) => {
                valuesObject[element.name] = element.value;
            });
            this.events.emit(`${this.formName}:input`, { valuesObject });
            this.events.emit(`${this.formName}:changed`);
        })

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.formName}:submit`);
            this.events.emit(`${this.formName}:changed`);
        })

        if (this.formName === 'order') {
            this.BtnDiv = this.container.querySelector('.order__buttons')
            this.BtnCard = this.container.querySelector('.button[name=card]');
            this.BtnCash = this.container.querySelector('.button[name=cash]');
            this.BtnDiv.addEventListener('click', (evt) => {
                if (evt.target !== evt.currentTarget) {
                    let paymentmethod = ''
                    if (evt.target === this.BtnCard) {
                        this.BtnCard.classList.add('button_alt-active');
                        this.BtnCash.classList.remove('button_alt-active');
                        paymentmethod = 'card';
                    } else {
                        this.BtnCard.classList.remove('button_alt-active');
                        this.BtnCash.classList.add('button_alt-active');
                        paymentmethod = 'cash';
                    }
                    this.events.emit(`paymentmethod:selected`, { paymentmethod });
                    this.events.emit(`${this.formName}:changed`)
                }
            })
        }
    }

    setvalid(value: boolean, error: string): void {
        this._submit.disabled = !value;
        this._errors.textContent = error;
    }

    get form() {
        return this._form;
    }

    clearForm() {
        this.inputs.forEach((input) => {
            input.value = ''
        })

        if (this.formName === 'order') {
            if (this.BtnCard.classList.contains('button_alt-active')) {
                this.BtnCard.classList.remove('button_alt-active');
            } else {
                this.BtnCash.classList.remove('button_alt-active');
            }
        }
    }
}