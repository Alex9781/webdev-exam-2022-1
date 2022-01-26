"use strict"

function getFilters(restaurants) {
    let AUs = new Set();
    let districts = new Set();
    let types = new Set();

    for (let restaurant of restaurants) {
        AUs.add(restaurant.admArea);
        districts.add(restaurant.district);
        types.add(restaurant.typeObject);
    }

    renderAUs(AUs);
    renderDistricts(districts);
    renderTypes(types);
}

function renderAUs(AUs) { //AU - administrative unit
    let selector = document.querySelector("#AU");
    for (let AU of AUs) {
        if (AU == null) continue;
        let option = document.createElement("option");
        option.innerHTML = AU;
        selector.appendChild(option);
    }
}
function renderDistricts(districts) {
    let selector = document.querySelector("#district");
    for (let district of districts) {
        if (district == null) continue;
        let option = document.createElement("option");
        option.innerHTML = district;
        selector.appendChild(option);
    }
}
function renderTypes(types) {
    let selector = document.querySelector("#type");
    for (let type of types) {
        if (type == null) continue;
        let option = document.createElement("option");
        option.innerHTML = type;
        selector.appendChild(option);
    }
}

function sortByRating(base) {
    function comp(a, b) {
        return b.rate - a.rate;
    }

    base.sort(comp);
    return base;
}

function renderRestaurants(restaurants, page) {
    let table = document.querySelector("tbody");

    table.innerHTML = '';

    for (let i = page * 20 - 20; i < page * 20; i++) {
        if (restaurants[i] == null) return;
        let restaurant = document.createElement("tr");
        restaurant.id = i;
        let field1 = restaurant.appendChild(document.createElement("td"))
        field1.innerHTML = restaurants[i].name;

        let field2 = restaurant.appendChild(document.createElement("td"))
        field2.innerHTML = restaurants[i].typeObject;

        let field3 = restaurant.appendChild(document.createElement("td"))
        field3.innerHTML = restaurants[i].address;

        let field4 = restaurant.appendChild(document.createElement("td"))
        let button = document.createElement("a")
        button.classList = "btn btn-primary"
        button.innerHTML = "Выбрать"
        button.href = "#menu"
        field4.appendChild(button);

        table.appendChild(restaurant);
    }
}

function pageBtnHandler(event) {
    if (filteredBase.length == 0) return;

    let page = event.target.dataset.page

    if (page) {
        renderRestaurants(filteredBase, page);
    }
    let buttons = document.querySelectorAll(".page-link");
    let maxPage = Math.ceil(filteredBase.length / 20)
    if (page == 1) {
        for (let i = 1; i <= 3; i++) {
            buttons[i].innerHTML = i;
            buttons[i].dataset.page = i;

        }
    }
    else if (page == maxPage) {
        buttons[1].innerHTML = page - 2;
        buttons[1].dataset.page = page - 2;
        buttons[2].innerHTML = page - 1;
        buttons[2].dataset.page = page - 1;
        buttons[3].innerHTML = page;
        buttons[3].dataset.page = page;
    }
    else {
        buttons[1].innerHTML = page - 1;
        buttons[1].dataset.page = page - 1;
        buttons[2].innerHTML = page;
        buttons[2].dataset.page = page;
        buttons[3].innerHTML = page - (-1);
        buttons[3].dataset.page = page - (-1);
    }
}

function filterBtnHandler(event) {
    let form = event.target.closest(".restaurant").querySelector("form");
    let AU = form.elements["AU"].value;
    let district = form.elements["district"].value;
    let type = form.elements["type"].value;
    let discount = form.elements["discount"].value;

    renderRestaurants(filterBase(AU, district, type, discount == "Да" ? true : falseD), 1);
}

function filterBase(AU, district, type, discount) {
    filteredBase = [];
    for (let i = 0; i < base.length; i++) {
        if ((AU == base[i].admArea || AU == "Не выбрано") &&
            (district == base[i].district || district == "Не выбрано") &&
            (type == base[i].typeObject || type == "Не выбрано") &&
            (discount == base[i].socialPrivileges || discount == "Не выбрано")) {

            filteredBase.push(base[i])
        }
    }
    updatePagination();
    return filteredBase;
}

function updatePagination() {
    document.querySelector("#last-pagination").dataset.page = Math.ceil(filteredBase.length / 20)
    let buttons = document.querySelectorAll(".page-link");

    for (let i = 1; i <= 3; i++) {
        buttons[i].innerHTML = i;
        buttons[i].dataset.page = i;
    }

}

function renderSets() {
    let dish = document.querySelector("#card");
    let dishParent = dish.closest(".row");

    for (let i = 0; i < 9; i++) {
        let newDish = document.createElement("div");
        newDish.className = "col";
        newDish.innerHTML = dish.innerHTML;
        dishParent.appendChild(newDish);
    }

    let dishes = document.querySelectorAll(".card");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://161.97.92.112:30003/api/sets");
    xhr.responseType = "json";
    xhr.onload = function () {
        let data = this.response;
        for (let i = 0; i < data.length; i++) {
            dishes[i].querySelector("img").src = data[i]["path-to-img"];
            dishes[i].querySelector("h5").innerHTML = data[i]["name"];
            dishes[i].querySelector("p").innerHTML = data[i]["description"];
            dishes[i].querySelector("h6").innerHTML = filteredBase[0]["set_" + (i + 1).toString()] + "&#8381;";
        }
        setsBase = data;
    }
    xhr.send();

}

function selectBtnHandler(event) {
    let restaurantId = event.target.closest("tr").id;
    currentRestaurant = restaurantId;
    let dishes = document.querySelectorAll(".card");

    for (let i = 0; i < 10; i++) {
        dishes[i].querySelector("h6").innerHTML = filteredBase[restaurantId]["set_" + (i + 1).toString()] + "&#8381;";
    }
}

function changeDishCountHandler(event) {
    let field = event.target.parentElement.querySelector("input");
    if (event.target.innerHTML == "+") field.value = field.value - (-1);
    else if (field.value > 0) field.value = field.value - 1;
    calculateOrderPrice();
}

function modalPageBtnHandler(event) {
    let sets = document.querySelectorAll(".card");
    let count = [];
    let options = [];

    for (let set of sets) {
        count.push(set.querySelector("input").value);
    }
    options[0] = document.querySelector("#twice").checked;
    options[1] = document.querySelector("#warm").checked;

    if (count.every((val) => val == 0)) {
        alert("Корзина пуста", "warning");
    }
    else {
        let fix = document.querySelector("#modal-fix");
        fix.click();
        renderModal(count, options);
    }
}

function renderModal(count, options) {
    let setsList = document.querySelector(".list-group");
    let pattern = document.querySelector(".list-group-item.d-flex.justify-content-between").innerHTML;
    setsList.innerHTML = "";

    for (let i = 0; i < count.length; i++) {
        if (count[i] != 0) {
            let set = document.createElement("li");
            set.classList = "list-group-item d-flex justify-content-between";
            set.innerHTML = pattern;

            count[i] = options[0] ? count[i] * 2 : count[i];

            set.querySelector("img").src = `./img/${i + 1}.jpg`;
            set.querySelectorAll("h6")[0].innerHTML = setsBase[i].name;
            set.querySelector("p").innerHTML = count[i].toString() + "x" + filteredBase[currentRestaurant]["set_" + (i + 1).toString()] + "&#8381;";
            if (options[0]) {
                set.querySelectorAll("h6")[1].innerHTML = count[i] / 2 * filteredBase[currentRestaurant]["set_" + (i + 1).toString()] * 1.6 + "&#8381;"
            }
            else { 
                set.querySelectorAll("h6")[1].innerHTML = count[i] * filteredBase[currentRestaurant]["set_" + (i + 1).toString()] + "&#8381;"; 
            }

            setsList.append(set);
        }
    }

    let optionsContainer = document.querySelector("#options-container");
    optionsContainer.innerHTML = "";

    let firsOption = document.createElement("p");
    firsOption.innerHTML = options[0] ? "+60%" : "Нет";
    optionsContainer.appendChild(firsOption);

    let secondOption = document.createElement("p");
    secondOption.innerHTML = options[1] ? "-30% (Если заказ будет холодным)" : "Нет";
    optionsContainer.appendChild(secondOption);

    document.querySelector("#modal-name").innerHTML = filteredBase[currentRestaurant].name;
    document.querySelector("#modal-AU").innerHTML = filteredBase[currentRestaurant].admArea;
    document.querySelector("#modal-district").innerHTML = filteredBase[currentRestaurant].district;
    document.querySelector("#modal-address").innerHTML = filteredBase[currentRestaurant].address;
    document.querySelector("#modal-rating").innerHTML = filteredBase[currentRestaurant].rate;
}

function alert(message, type) {
    let alertPlaceholder = document.getElementById('liveAlertPlaceholder')

    let wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

    alertPlaceholder.append(wrapper)
}

function modalConfirmOrder(event) {
    alert("Заказ подтверждён", "success")
}

function calculateOrderPrice() {
    orderPrice = 0;
    let sets = document.querySelectorAll(".card");
    let option = document.querySelector("#twice");
    let count = [];

    for (let set of sets) {
        count.push(set.querySelector("input").value);
    }

    for (let i = 0; i < count.length; i++) {
        orderPrice += count[i] * filteredBase[currentRestaurant]["set_" + (i + 1).toString()];
    }

    if (option.checked) orderPrice *= 1.6;

    document.querySelector("#sum").innerHTML = "Итого: " + orderPrice + "&#8381;"
}

let base;
let filteredBase;
let setsBase;
let currentRestaurant = 0;
let orderPrice;

window.onload = function () {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=3ca35cf9-4ed8-4ddf-bbee-c0ea9de1b903");
    xhr.responseType = "json";
    xhr.onload = function () {
        getFilters(this.response);

        base = sortByRating(this.response);
        filteredBase = base;

        renderRestaurants(base, 1);
        updatePagination();
        renderSets();

        document.querySelectorAll(".dish-count").forEach((set) => {
            set.onclick = changeDishCountHandler;
        });

        let inputs = document.querySelectorAll(".form-control.w-25.text-center");
        inputs.forEach((input) => {
            input.addEventListener('change', (event) => {
                if (input.value < 0) input.value = 0;
            });
        });
    };
    xhr.send();

    document.querySelector(".pagination").onclick = pageBtnHandler;
    document.querySelector("#filter").onclick = filterBtnHandler;
    document.querySelector("tbody").onclick = selectBtnHandler;
    document.querySelector("#place-order").onclick = modalPageBtnHandler;
    document.querySelector("#order").onclick = modalConfirmOrder;
    document.querySelector("#twice").addEventListener("change", calculateOrderPrice, false);

}
