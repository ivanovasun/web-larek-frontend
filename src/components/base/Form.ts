import { IOrderForm } from "../../types";
import { Component } from "./Component";
import { IEvents } from "./events";


interface IFormState {
    valid: boolean;
    errors: string;
}

export class Form<IOrderForm> extends Component<IFormState> {
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
        })

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.formName}:submit`);
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
                }
            })
        }
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
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

    render(state: Partial<IOrderForm> & IFormState) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}