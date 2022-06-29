import { baseURL } from "../util/url.js";
import deleteItem from "../admin/delete-entry.js";
import addToCart from "../cart/cartFunctions.js";
import { initializePill } from "../cart/showCartNumber.js";
import updateDOM, { updateToast } from "../util/updateDOM.js";

const productContainer = document.querySelector(".productList");
const brandItems = document.querySelectorAll(".brandList > li");
const priceOrder = document.querySelectorAll(".priceOrder > li");
const modalBody = document.querySelector(".modal-body");
const modalFooter = document.querySelector(".modal-footer");
const modalTitle = document.querySelector(".modal-title");
const productSearch = document.querySelector(".productSearchInput");
const filterByfeaturedInput = document.querySelector("#filterByFeaturedInput");

let filterFeatured = false;

filterByfeaturedInput.onclick = (event) => {
  event.target.checked ? filterFeatured = true : filterFeatured = false;
  filterProducts(productArray, order, brand, search);
}

let productURL = baseURL + "products/"

let productArray = [];

let order = "none";
let brand = "";
let search = "";

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
params.get("brand") ? (brand = params.get("brand")) : (brand = "All");

async function callProductAPI(url, order, brand, search) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    productArray = result;

    filterProducts(productArray, order, brand, search);
    
  } catch (error) {

  }
}

function filterProducts(productArray, order, brand, search) {
  let tempArray = [];

  let html = "";

  if (search !== "") {
    const filteredResults = productArray.filter((item) => {

      if (
        item.brand.toLowerCase().includes(search.toLowerCase()) ||
        item.model.toLowerCase().includes(search.toLowerCase())
      ) {
        return true;
      }
    });
    productArray = filteredResults;
  } else {
    if (brand !== "All") {
      productArray.forEach((item) => {
        if (item.brand.toLowerCase() === brand.toLowerCase()) {
          tempArray.push(item);

        }
      });
      productArray = tempArray;
      tempArray = [];

    }
  }

  if (order === "Ascending") {
    productArray.sort(orderAscending);
  } else if (order === "Descending") {
    productArray.sort(orderDescending);
  }

  filterFeatured ? productArray.forEach((featured) => {
    featured.featured ? tempArray.push(featured) : "";
    productArray = tempArray;
  }) : null;

  productArray.forEach((element) => {
    html += `<div class="col mb-4 id-${element.id}">
        <div class="text-center product-card">
          <div class="card-body">
          <a href="product-details.html?id=${element.id}">
            <p class="product-brand brand-id-${element.id}">${element.brand}</p>
            <p class="product-model model-id-${element.id}">${element.model}</p>
            <img src="${element.image?.formats?.thumbnail.url}" class="product-thumbnail" alt="${element.brand} ${element.model}" title="${element.brand} ${element.model}"/>
            <p class="product-price mt-4">${element.price},-</p>
            </a>
            <button class="btn btn-primary shadow-none addToCartProd mt-4" data-id="${element.id}">Add to cart</button>
              <div class="admin-btns w-100 d-none">
              <a href="add-edit.html?id=${element.id}"><button class="btn btn-success mt-3 btn-sm d-inline">Edit</button></a>
              <button class="btn btn-danger btn-sm mt-3 ml-3 d-inline btn-delete-productpage" data-id="${element.id}" data-toggle="modal" data-target="#confirmModal">Delete</button>
            </div>
          </div>
        </div>
        </div>`;
  });

  productContainer.innerHTML = html;

  const addToCartButtons = document.querySelectorAll(".addToCartProd");

  addToCartButtons.forEach(
    (button) =>
      (button.onclick = (event) => {
        addToCart(event);
        updateToast(event, "added");
      })
  );


  const deleteItemArray = document.querySelectorAll(".btn-delete-productpage");

  deleteItemArray.forEach(
    (button) =>
      button.onclick = (event) => {
        const id = event.target.dataset.id;
        const brand = document.querySelector(`.brand-id-${id}`);
        const model = document.querySelector(`.model-id-${id}`);

        modalBody.innerHTML = `Are you sure you want to delete ${brand.innerText} ${model.innerText} from store?`;
        modalTitle.innerHTML = `Delete item?`;
        modalFooter.innerHTML =  `<button type="button" class="btn btn-secondary " data-dismiss="modal">No</button>
        <button type="button" class="btn btn-primary shadow-none deleteItemProductPage" data-dismiss="modal">Yes</button>
         `;
       
        const confirmAction = document.querySelector(".deleteItemProductPage");

        confirmAction.onclick = () => deleteItem(event);
      }
  )

  updateDOM();
 
}

function orderDescending(a, b) {
  return b.price - a.price;
}
function orderAscending(a, b) {
  return a.price - b.price;
}

callProductAPI(productURL, order, brand, search);
initializePill();
updateDOM();

brandItems.forEach((item) => {
  item.onclick = (event) => {
    brand = event.target.innerHTML;
    brand === "All" ? (order = "None") : (order = "Ascending");
    search = "";

    callProductAPI(productURL, order, brand, search);
  };
});

priceOrder.forEach((item) => {
  item.onclick = (event) => {
    order = event.target.innerHTML;

    callProductAPI(productURL, order, brand, search);
  };
});

productSearch.onkeyup = function (event) {
  search = event.target.value;

  callProductAPI(productURL, order, brand, search);
};


