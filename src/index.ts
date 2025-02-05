import './scss/styles.scss';
import { AppApi } from './components/AppAPI';
import { Card } from './components/Card';
import { CardsData } from './components/CardsData';
import { EventEmitter } from './components/base/events';
import { BasketData } from './components/BasketData'
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { Basket } from './components/Basket';
import { Modal } from './components/base/Modal';
import { Page } from './components/Page';
import { Form } from './components/base/Form';
import { OrderData } from './components/OrderData';
import { Success } from './components/Success';
import { ICards } from './types';

//создаем все классы
const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const basketArray = new BasketData(events);
const orderDara = new OrderData(events);
const cardsData = new CardsData(events);
const modalContainer = new Modal(document.querySelector('.modal'), events)
const page = new Page(document.body, events)

//все нужные темплейты создаем
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const succesTemplate: HTMLTemplateElement = document.querySelector('#success');
const orderForm = new Form(cloneTemplate(orderTemplate), events);
const cardTemplateCatalog: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardTemplateFull: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');

//создаем формы
const contactsForm = new Form(cloneTemplate(contactsTemplate), events);
const succesPage = new Success(cloneTemplate(succesTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

//получаем карточки с сервера
api.getCards()
    .then((cardsGallery) => {
        cardsData.card = cardsGallery;
        events.emit('initialData: loaded');
    })
    .catch((err) => {
        console.log(err)
    });

//рендерим карточки
events.on('initialData: loaded', () => {
    const cardsArray = cardsData.card.map((card) => {
        const cardInstant = new Card(cloneTemplate(cardTemplateCatalog), events);
        return cardInstant.render(card);
    })
    page.catalog = cardsArray
})

//рендерим выбранную карточку в модалке
events.on('card:select', (data: { cardId: string }) => {
    const { cardId } = data
    const imageSelect = cardsData.getCardById(cardId)
    const cardPreview = new Card(cloneTemplate(cardTemplateFull), events);

    //проверяем, что выбранная карточка не добавлена уже в корзину и устанавливаем состояние кнопки "В корзину"
    basketArray.basketCards.forEach((item) => {
        if (item.id === cardId) {
            cardPreview.valid = false
        }
    })

    //проверяем, что выбранная карточка не является бесценной и устанавливаем состояние кнопки "В корзину"
    if (imageSelect.price === null) {
        cardPreview.valid = false
    }
    modalContainer.render({ catalog: cardPreview.render(imageSelect) })
    modalContainer.open();
})

//добавляем карточку в корзину
events.on('card:submit', (data: { cardId: string }) => {
    const { cardId } = data;
    const cardSelect = cardsData.getCardById(cardId)
    basketArray.addCardInBasket(cardSelect, null);
})

//открываем корзину
events.on('basket:open', () => {
    modalContainer.render({ catalog: basket.render() });
    modalContainer.open();
})

//удалаем карточку из корзины и перерендериваем корзину
events.on('card:delete', (data: { cardId: string }) => {
    const { cardId } = data;
    basketArray.deletCard(cardId, null);
})

//пересчитываем количество товара в корзине при ее изменении и рендерим актуальную корзину
events.on('basket:changed', () => {
    page.counter = basketArray.basketCards.length;
    const cardsInBasket = basketArray.basketCards.map((card, index) => {
        const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events);
        cardInstant.index = index += 1
        return cardInstant.render(card);
    })
    basket.render({ items: cardsInBasket, total: basketArray.getTotalAmount() })
})


//рендерим открытие формы заказа
events.on('order-form: open', () => {
    modalContainer.render({ catalog: orderForm.render() });
})

//сохраняем  значение интупов в информации заказа
events.on('order:input', (data: { valuesObject: Record<string, string> }) => {
    const { valuesObject } = data
    orderDara.address = valuesObject.address;
}
)

//сохраняем способ оплаты 
events.on('paymentmethod:selected', (data: { paymentmethod: string }) => {
    orderDara.payment = data.paymentmethod;

})

//валидируем форму заказа при ее изменении - 1 страница
events.on('order:changed', () => {
    const validInfo = orderDara.validEventOrder();
    orderForm.setvalid(validInfo.valid, validInfo.error);
})

//рендерим 2 страницу заказа - контактные данные
events.on('order:submit', () => {
    modalContainer.render({
        catalog: contactsForm.render()
    })
})

//сохраняем значение инпутов в информации заказа
events.on('contacts:input', (data: { valuesObject: Record<string, string> }) => {
    const { valuesObject } = data
    orderDara.email = valuesObject.email;
    orderDara.phone = valuesObject.phone;
})

//валидируем форму заказа при ее изменении - 2 страница
events.on('contacts:changed', () => {
    const validInfo = orderDara.validEventcontacts()
    contactsForm.setvalid(validInfo.valid, validInfo.error)
})

//отправляем данные заказа на сервер, рендерим модалку успешного заказа, обнуляем всю информацию, что необходимо
events.on('contacts:submit', () => {
    let totalAmountFinall = 0
    const cardsInOrder: string[] = []
    //добавляем в заказ нужные id карточки из модели корзины
    basketArray.basketCards.forEach((card) => cardsInOrder.push(card.id))
    api.setOrderInfo({
        payment: orderDara.payment,
        email: orderDara.email,
        phone: orderDara.phone,
        address: orderDara.address,
        total: basketArray.getTotalAmount(),
        items: cardsInOrder,
    })
        .then((answerOrder) => {
            totalAmountFinall = answerOrder.total
            modalContainer.render({ catalog: succesPage.render({ total: totalAmountFinall }) })
            basketArray.resetBasket();
            orderDara.clearAll();
            page.counter = basketArray.basketCards.length;
            orderForm.clearForm();
            contactsForm.clearForm();
        })
        .catch((err) => {
            console.log(err)
        })
})

//закрытие модалки
events.on('order-succes:close', () => {
    modalContainer.close();
})

//запрещаем прокрутку страницы при открытой модалки
events.on('modal:open', () => {
    page.locked = true;
});

//разрешаем прокрутку страницы при открытой модалки
events.on('modal:close', () => {
    page.locked = false;
});
