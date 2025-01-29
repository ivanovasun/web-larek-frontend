import { IApi, ICards, IOrder, IOrderAnswer } from "../types";
import { Api, ApiListResponse } from "./base/api";

export class AppApi extends Api implements IApi {
    readonly _cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this._cdn = cdn;
    }

    getCards(): Promise<ICards[]> {
        return this.get(`/product/`).then((card: ApiListResponse<ICards>) => card.items.map((item) => ({
            ...item, image: this._cdn + item.image
        })))
    }

    getCardsById(cardId: string): Promise<ICards> {
        return this.get(`/product/${cardId}`).then((card: ICards) => ({ ...card, image: this._cdn + card.image }));
    }

    setOrderInfo(data: IOrder): Promise<IOrderAnswer> {
        return this.post(`/order`, data).then((res: IOrderAnswer) => res)
    }
}