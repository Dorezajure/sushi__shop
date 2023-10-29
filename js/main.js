const items = [
    {
        id: 1,
        title: "Калифорния хит",
        price: 300,
        weight: 180, 
        itemInBox: 6, 
        img: 'california-hit.jpg',
        counter: 1
    }, 
    {
        id: 2,
        title: "Калифорния темпура",
        price: 250,
        weight: 205, 
        itemInBox: 6, 
        img: 'california-tempura.jpg',
        counter: 1
    }, 
    {
        id: 3,
        title: "Филадельфия",
        price: 320,
        weight: 230, 
        itemInBox: 6, 
        img: 'philadelphia.jpg',
        counter: 1
    },
    {
        id: 4,
        title: "Запеченный ролл Калифорния",
        price: 230,
        weight: 182, 
        itemInBox: 6, 
        img: 'zapech-california.jpg',
        counter: 1
    }
]

const state = {
    items: items,
    cart: []
}

const productsContainer = document.querySelector("#productsMainContainer");
const cartItemsContainer = document.querySelector("#cartItemsHolder");
const cartEmptyNotification = document.querySelector("#cartEmpty");
const cartTotalContainer = document.querySelector("#cartTotal");
const makeOrderContainer = document.querySelector("#makeOrder");

const renderItem = function(item) {
    // Шаблон для верстки
    const markup = `
    <div class="col-md-6">
        <div class="card mb-4" data-productid="${item.id}">
            <img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
            <div class="card-body text-center">
                <h4 class="item-title">${item.title}</h5>
                <p><small class="text-muted">${item.itemInBox} шт.</small></p>

                <div class="details-wrapper">
                    <div class="items">
                        <div class="items__control" data-click="minus">-</div>
                        <div class="items__current" data-count>${item.counter}</div>
                        <div class="items__control" data-click="plus">+</div>
                    </div>

                    <div class="price">
                        <div class="price__weight">${item.weight}г.</div>
                        <div class="price__currency">${item.price} ₽</div>
                    </div>
                </div>

                <button type="button" class="btn btn-block btn-outline-warning" data-click="addToCart">+ в корзину</button>
                
            </div>
        </div>
    </div>`;

    productsContainer.insertAdjacentHTML("beforeend", markup);
}

// Функция для рендера товара в корзине 
const renderItemInCart = function(item) {
    
    // Шаблон для верстки
	const markup = `
		<div class="cart-item" data-productid="${item.id}">
			<div class="cart-item__top">
				<div class="cart-item__img">
					<img src="img/roll/${item.img}" alt="${item.title}">
				</div>
				<div class="cart-item__desc">
					<div class="cart-item__title">${item.title}</div>
					<div class="cart-item__weight">${item.itemInBox} шт. / ${item.weight}г.</div>
					<div class="cart-item__details">
						<div class="items items--small">
							<div class="items__control" data-click="minus">-</div>
							<div class="items__current" data-count>${item.items}</div>
							<div class="items__control" data-click="plus">+</div>
						</div>
						<div class="price">
							<div class="price__currency">${item.price} ₽</div>
						</div>
					</div>
				</div>
			</div>
		</div>`; 

    cartItemsContainer.insertAdjacentHTML("beforeend", markup);
}

//При помощи метода forEach проходим по массивую items и через функцию renderItems выводим все карточки на страницу
state.items.forEach(renderItem);

//Функция для работы плюсом и минусом 
const itemUpdateCounter = function(id, type) {
    // Проходит по массиву в поиске подходящего id (удолетворяющего условию)
    const itemIndex = state.items.findIndex(function(element){
        if(element.id == id){
            return true;
        }
    });

    let count = state.items[itemIndex].counter;

    if(type == "minus") {
        // Проверка на исключение отрицательного значения
        if(count - 1 > 0) {
            count--;
            state.items[itemIndex].counter = count;
        } 
    }

    if(type == "plus") {
        count++;
        state.items[itemIndex].counter = count;
    }
}

const itemUpdateViewCounter = function(id){
    // Проходит по массиву в поиске подходящего id (удолетворяющего условию)
    const itemIndex = state.items.findIndex(function(element){
        if(element.id == id){
            return true;
        }
    })

    // Здесь значение счетчика из состояния нашего приложения
    const countToShow = state.items[itemIndex].counter;

    // Обновим значение счетчика в разметке
        // Найдем в разметке в разметке где находится счетчик
    const currentProduct = productsContainer.querySelector('[data-productid="' + id + '"]')
    const counter = currentProduct.querySelector("[data-count]");

    // Обновить размер счетчика в разметку
    counter.innerText = countToShow;
}

const checkCart = function() {
    if(state.cart.length > 0) {
        cartEmptyNotification.style.display = "none";
        cartTotal.style.display = "block";
        makeOrderContainer.style.display = "block";
    } else { 

    }

}

const addToCart = function(id) {
    const itemIndex = state.items.findIndex(function(element){
        if(element.id == id){
            return true;
        }
    });

    // Создаем некий объект которым будет наполнятся корзина
    const newItem = {
        id: state.items[itemIndex].id,
        title: state.items[itemIndex].title,
        price: state.items[itemIndex].price,
        weight: state.items[itemIndex].weight, 
        itemInBox: state.items[itemIndex].itemInBox, 
        img: state.items[itemIndex].img,
        items: state.items[itemIndex].counter
    }

    // Запушим в корзину
    state.cart.push(newItem);

    // Используем для сброса счетчика между + и - когда нажали на добавление в корзину
    state.items[itemIndex].counter = 1;
    itemUpdateViewCounter(id);


    cartItemsContainer.innerHTML = "";
    state.cart.forEach(renderItemInCart);

    // Функция для проверки корзины
    checkCart();
}

productsContainer.addEventListener("click", function(e){
    //Объект, который полностью описывает событие
    const id = e.target.closest("[data-productid]").dataset.productid;

    // Отслеживание плюс и минус
    if(e.target.closest('[data-click="minus"]')) {
        itemUpdateCounter(id, "minus");
        itemUpdateViewCounter(id);
    } else if(e.target.closest('[data-click="plus"]')) {
        itemUpdateCounter(id, "plus");
        itemUpdateViewCounter(id);
    } else if(e.target.closest('[data-click="addToCart"]')) {
        addToCart(id);
    }
})
