import { IOrderForm } from "../types";
import { IEvents } from "./base/events";

export class OrderData implements IOrderForm {
    protected _payment: string;
    protected _email: string;
    protected _phone: string;
    protected _address: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
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


    validEventOrder(): { valid: boolean, error: string } {
        let valid
        let error
        if (this._address && this._payment) {
            valid = true
            error = ''
            return { valid, error }
        } else {
            valid = false
            error = 'Необходимо заполнить адрес и выбрать способ оплаты'
            return { valid, error }
        }
    }

    validEventcontacts(): { valid: boolean, error: string } {
        let valid
        let error
        if (this._email && this._phone) {
            valid = true
            error = ''
            return { valid, error }
        } else {
            valid = false
            error = 'Необходимо заполнить все поля'
            return { valid, error }
        }
    }

    clearAll(): void {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
    }
}