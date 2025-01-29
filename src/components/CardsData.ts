
import { ICards, ICardsData } from "../types";
import { IEvents } from "./base/events";

export class CardsData implements ICardsData {
    protected _card: ICards[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set card(cards: ICards[]) {
        this._card = cards;
    }

    get card() {
        return this._card;
    }

    getCardById(cardId: string): ICards {
        return this._card.find((item) => item.id === cardId)
    }

    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return
        }
        const selectedCard = this.getCardById(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected')
        }
    }
}