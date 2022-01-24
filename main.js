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
        let button = document.createElement("button")
        button.classList = "btn btn-primary"
        button.innerHTML = "Выбрать"
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

    renderRestaurants(filterBase(AU, district, type, discount), 1);
}

function filterBase(AU, district, type, discount) {
    filteredBase = [];
    for (let i = 0; i < base.length; i++) {
        if ((AU == base[i].admArea || AU == "Не выбрано") &&
            (district == base[i].district || district == "Не выбрано") &&
            (type == base[i].typeObject || type == "Не выбрано") &&
            (discount == base[i].typeObject || discount == "Не выбрано")) {

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
    let dishes = document.querySelectorAll(".dish");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://sets.std-1558.ist.mospolytech.ru/sets.json");
    xhr.responseType = "json";
    xhr.onload = function () {
        let data = this.response
        for (let i = 0; i < data.length; i++) {
            dishes[i].querySelector("img").src = data[i]["path-to-img"];
            dishes[i].querySelector("h2").src = data[i]["name"];
            dishes[i].querySelector("p").src = data[i]["description"];
        }
    }
    xhr.send();

}

let base;
let filteredBase;

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
    };
    xhr.send();

    document.querySelector(".pagination").onclick = pageBtnHandler;
    document.querySelector("#filter").onclick = filterBtnHandler;
}
























// var myModal = document.querySelector("#confirm-order")
// var myInput = document.querySelector("#place-order")

// myModal.addEventListener('shown.bs.modal', function () {
//     myInput.focus()
// })