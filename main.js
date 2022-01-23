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

window.onload = function() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=3ca35cf9-4ed8-4ddf-bbee-c0ea9de1b903");
    xhr.responseType = "json";
    xhr.onload = function () {
        getFilters(this.response);
    };
    xhr.send();
}
























// var myModal = document.querySelector("#confirm-order")
// var myInput = document.querySelector("#place-order")

// myModal.addEventListener('shown.bs.modal', function () {
//     myInput.focus()
// })