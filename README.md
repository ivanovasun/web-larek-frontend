# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Карточки товаров
```
export interface ICards {
id: string;
description?: string;
image?: string;
title: string;
category?: string;
price: number | null;
}
```

Информация о заказе 
```
export interface IOrderForm {
payment: string;
email: string;
phone: string;
address: string;
}
```

Данные заказа и пользователя
```
export iinterface IOrder extends IOrderForm {
items: string[];
total: number;
}
```

Коллекция карточек 
```
export interface ICardsData {
card: ICards[];
preview: string | null; //место где хранится ид выбранной карточки
getCardById(cardId: string): ICards;
}
```

Данные для отображения коллекции карточек на главной странице
```
export type TCardList = Pick<ICards,  'image' | 'title'| 'category' | 'price'>;
```

Данные для отображения выбранных товаров в корзине
```
export type TBasketList= Pick<ICards, 'title' | 'price' | 'id'>;
```

Данные пользователя: вид оплаты, адресс
```
export type TAdressPayment = Pick<IUserInfo, 'paymentMethod' | 'address'>;
```

Данные пользователя: емейл, телефон
```
export type TEmailPhone = Pick< IUserInfo, 'email' | 'telephone'>;
```

## Архитектура приложения 

Код приложения разделен на 3 слоя в соответсвии с парадигмой MVP, а именно:
- слой данных - отвечает за хранение и изменение данных
- слой отображения - отвечает за отображения данных на странице
- презентер - отвечает за связь между слоем данных и слоем отображения

### Базовый код

#### Класс API 
Данный класс содержит в себе логику отправки запросов на сервер. В коснутрукцию передается адрес сервера, прописанный в константе, и переданный в аргументе ендпоинт с заголовком запросов и выбранным методом.

Методы:
- `GET` - передает гет запрос на эндопинт (параметр при вызове метода) и возвращает промис с данными 
- `POST` - выполняет отправку данных, преобразованных в JSON, на переданный ендпоинт (параметр при вызове метода)

#### Класс EventEmitter (брокер событий)

Класс используется в презентере для обработки событий и в слоях для генерации событий.\
Используемые методы класса описаны в интерфейсе IEvents, а именно: 
- `on` - установить обработчик на событие
- `emit` - инициировать событие с данными
- `trigger` - возвращает функцию, при вызове которой инициализурется требуемое в параметрах событие 

В классе также прописаны методы:
- `off` - снять обработчик с события
- `onAll` - установить обработчики на все события
- `offAlll` - снять обработчики со всех событий

#### Класс Component<T>
Класс с базовой логикой для всех классов отображения, в него в конструктор передается контейнер, внутри которого уже идет отрисовка и поиск всех элементов отображения. Дженерик в типе - так как у каждого класса отображения свой тип данных, с которыми он работает 
В классе есть следующий метод:
- render - для отрисовки карточки
 
### Слой данных
Все классы для хранения и изменения данных.

#### Класс CardsData
Класс отвечает за хранение и логику работы с данными карточек.\
В полях класса харняться данные, а именно:
- _card: ICardsInitial; - массив объектов карточек
- _preview: string | null - id карточки, выбранной для просмотра в модальном окне
- events - экземпляр класса `EventEmitter`, используется для запуска событий при изменении массива карточек

В классе есть следующий метод:
- getCardById(cardId: string): ICards - возвращает карточку по ее id
-сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс BasketData
Отвечает за хранение и логику работы с данными карточек товара, что находятся в корзине.

Поля:
- _listOfCards: TBasketList[] - список карточек, добавленных в корзину
- events - экземпляр класса `EventEmitter`, используется для запуска событий при изменении массива карточек, хранящихся в корзине

В классе есть следующие методы:
- deletCard(cardId: string, callback: Function | null): TBasketList[] - удаляет карточку товара из корзины, если передан колбэк, то исполняет его после удаления, если нет, то запускает событие изменения массива 
- addCardInBasket(card: Partial<ICards>, callback: Function | null): TBasketList[] - добавляет карточку в корзину по ее id, выполняет колбэк после добавления, если передан, если не передан, то вызывает событие измененния массива
- countTotalAmount(card: TBasketList[]): number | null - метод рассчета стоимости всех карточек товара, добавленных в корзину, возвращает null, когда добавлен бесценный товар
- resetBasket() - сбрасывает список карточек, добавленных в корзину до пустого массива
- геттеры для получения списка карточек, добавленных в корзину

#### Класс OrderData 
Отвечает за хранение и логику работы с данными, вводимыми пользователем при оформлении заказа.
Поля:
- _paymentMethod: string - метод оплаты выбранный пользователем
- _address: string - введенный адрес пользователя
- _email: string - введенный емейл пользователя
- _telephone: string - введенный телефон пользователя
- _items: string[] - массив id выбранных к заказу карточек
- _total: number - общая цена заказа
- events: IEvents - экземпляр класса `EventEmitter`, используется для запуска событий при изменении массива карточек, хранящихся в заказе

В классе есть следующие методы:
- addCardsInOrder(card: TBasketList[]): string[] - добавить id карточки в заказ, возращает массив из id выбранных для заказа картчек
- deletCardInOrder(cardId: string): string[] - удалить id карточки из заказа, возращает обновленный массив из id выбранных для заказа картчек
- sclearAll() - очищает все поля класса
- сеттеры и геттеры - для сохранения и получения данных заказа


### Слой отображения
Все классы для отображения внутри определенного DOM-элемента передаваемых в них данных.

#### Базовый класс Component 
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик прнимается тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в парамнетре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

#### Класс Modal 
Отвечает за отображение модальных окон, подставляя в модальное окно данные, имеющиеся в темплейте данной модалки. Класс используется для отображения модалок на странице сайта. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа. Родительским для него является - класс Component

Поля класса содержат элементы разметки элементов модалки + events - экземпляр класса `EventEmitter`, используется для запуска событий при изменении модалки

В классе есть следующие методы:
- open(): void - открытие модалього окна
- close(): void - закрытие модалього окна
- handleEscUp(evt: KeyboardEvent) - закрытие модального окна по Escape
- render(data: ICardsContainer): HTMLElement - добавляет контент в модальное окно в соответсвие с темплейтом
- сеттер - для добавления элементов в контейнер, отвечающий за наполнение модалки

#### Класс Card
Отвечает за отображение карточки, подставляя в карточку данные, имеющиеся в темплейте данной карточки. Класс используется для отображения карточек на странице сайта. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события. Родительским для него является - класс Component


Поля класса содержат элементы разметки элементов карточки для всех темплейтов карточки + - events - экземпляр класса `EventEmitter`, используется для запуска событий при совершении действий с карточками

В классе есть следующие методы:
- сеттеры для заполнения полей карточки и для валидации кнопки "В корзину" в соответсвующем темплейте
- метод render используется в версии родительского класса Component 
- геттер id возвращает уникальный id карточки
- isSelected(): void - устанавливает состояние кнопки В корзину" в соответсвующем темплейте

#### Класс Basket
Отвечает за отображение корзины. Родительским для него является - класс Component.

Поля класса содержат элементы разметки корзины + - events - экземпляр класса `EventEmitter`, используется для запуска событий при изменении корзины

В классе есть следующие методы:
- сеттеры для установки отображения выбранных карточек в корзине и установки общей цены
- метод render используется в версии родительского класса Component 

#### Класс Page
Отвечает за отображение элементов страницы. Родительским для него является - класс Component

Поля класса содержат элементы разметки главной страницы (кнопку корзины, счетчки добавленных элементов в коризну, место вывода карточек с сервера) + events - экземпляр класса `EventEmitter`, используется для запуска событий при совершении действий с интеркативными эелементами

В классе есть следующие методы:
- сеттеры для отображения необходимых данных
- метод render используется в версии родительского класса Component 

#### Класс Success
Отвечает за отображение контента успешного оформления заказа. Родительским для него является - класс Component

Поля класса содержат элементы темплейта для отображения контента успешного оформления заказа + events - экземпляр класса `EventEmitter`, используется для запуска событий при совершении действий с интеркативными эелементами

В классе есть следующие методы:
-сеттер для установки общей суммы заказа

### Слой коммуникационный
Отвечает за коммуникацию приложения с внешними устройствами и приложениями 

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

В классе есть следующие методы:
- getCards(): Promise<ICards[]> - получаем данные карточек с сервера
- getCardsById(cardId: string): Promise<ICards> - получаем данные карточки по ее id с сервера
- setOrderInfo(data: IOrder): Promise<IOrderAnswer> - посылаем на сервер данные заказа

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `src\index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `src\index.ts`\
В `src\index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*

*События изменения данных (генерируются классами моделями данных)*
- `initialData: loaded` - загрузка карточек с сервера
- `card:selected` - выбор открываемой в модальном окне картинки карточки
- `card:submit` - событие, генерируемое при нажатии "В коризну" в модальном окне карточки товара
- `basket:changed` - изменение массива карточек товаров, хранящихся в корзине

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `order-form: open` - событие, генерируемое при нажатии кнопки "Оформить" в корзине 
- `order:input` - ввод данных пользователем 
- `paymentmethod:selected` - выбран способ оплаты
- `order:submit` - событие, отвечающее за статус (активная/не активная) кнопки "Далее" в модальном окне заказа: способ оплаты и адрес
- `contacts:input` - ввод данных пользователем 
- `contacts:submit` - событие, генерируемое при нажатии "Оплатить" в модальном окне заказа: емейл и телефон
- `order-succes:close` - событие, генерируемое при нажатии "За новыми покупками!" в модальном окне успешного заказа
- `modal:open` - модалка открыта
- `modal:close` - модалка закрыта
- `basket:open` - открыта корзина заказа
- `card:delete` - удалена карточка из заказа 
