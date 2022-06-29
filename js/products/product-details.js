import addToCart from "../cart/cartFunctions.js";
import { baseURL } from "../util/url.js";
import deleteItem from "../admin/delete-entry.js";
import { initializePill } from "../cart/showCartNumber.js";
import updateDOM, { updateToast } from "../util/updateDOM.js";

const resultsContainer = document.querySelector(".productDetailContainer");
const featuredContainer = document.querySelector(".featuredList");
const breadcrumb = document.querySelector(".breadcrumb");
const modalBody = document.querySelector(".modal-body");
const modalTitle = document.querySelector(".modal-title");
const modalFooter = document.querySelector(".modal-footer");
const modalHeader = document.querySelector(".modal-header");

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

if (!id) {
  document.location.href = "products.html";
}

const productURL = baseURL + "products/"

async function callProductDetails(id) {
  const singeItem = productURL + id;

  try {
    const response = await fetch(singeItem);
    const result = await response.json();

    document.title = `PHONEX - ${result.brand} ${result.model}`;

    breadcrumb.innerHTML = `
    <li class="breadcrumb-item ml-sm-auto">
       <a href="products.html">Shop</a>
    </li>
    <li class="breadcrumb-item">
       <a href="products.html?brand=${result.brand}">${result.brand}</a>
    </li>
     <li class="breadcrumb-item current mr-sm-auto" aria-current="page">
      ${result.model}
    </li>`;

    resultsContainer.innerHTML = `
      <div class="row py-4">
        <img
          src="${result.image?.url}"
          alt="${result.brand} ${result.model}"
          class="col-12 mb-3 col-md-6 col-lg-6 mainpicture"
          title="${result.brand} ${result.model}"
        />

        <div class="col-12 col-md-12 col-lg-7 ml-lg-auto mt-5 mt-lg-0">
          <h3 class="text-center my-4 mt-md-0 product-detail-brand brand-id-${result.id}">
            ${result.brand}
          </h3>
          <h1 class="text-center my-4 mt-md-0 product-detail-model model-id-${result.id}">
            ${result.model}
          </h1>

          <p class="my-5 wallOfText">${result.description}</p>

          <div class="d-flex justify-content-center justify-content-lg-start">
          <div>
          <p class="my-3">
            Price:
            <span class="price font-weight-bold ml-3">${result.price},-</span>
          </p>
          <button class="btn addToCart btn-primary shadow-none my-5 d-block" data-id="${result.id}">
            Add to cart
          </button>
          <div class="admin-btns d-none">
      
      <a href="add-edit.html?id=${result.id}"><button class="btn btn-success btn-sm my-3 d-inline">Edit</button></a>
      <button class="btn btn-danger btn-sm my-3 ml-3 d-inline btn-delete-productpage-single" data-id="${result.id}" data-single="single" data-toggle="modal" data-target="#confirmModal">Delete</button>
      
      <div>
      <div class=".addNewProduct">
      <a href="add-edit.html?item=new"><button class="btn btn-primary shadow-none btn-sm">Add new item to stock</button></a>
    </div>
      </div>
      </div>
 
      
     
    </div>
        </div>
      </div>`;

    const addToCartButton = document.querySelector(".addToCart");

    addToCartButton.onclick = (event) => {
      addToCart(event);
      updateToast(event, "added");
    };

    const deleteItemSingle = document.querySelector(".btn-delete-productpage-single");

    deleteItemSingle.onclick = (event) => {

      const id = event.target.dataset.id;
      const brand = document.querySelector(`.brand-id-${id}`);
      const model = document.querySelector(`.model-id-${id}`);


      modalBody.innerHTML = `Are you sure you want to delete ${brand.innerText} ${model.innerText} from store?`;
      modalTitle.innerHTML = `Delete item?`;
      modalFooter.innerHTML = `
      <button type="button" class="btn btn-secondary " data-dismiss="modal">No</button>
      <button type="button" class="btn btn-primary shadow-none deleteItemProductSinglePageFeatured" data-dismiss="modal">Yes</button>
        `;
      modalHeader.classList.add("bg-warning");
     
      const confirmAction = document.querySelector(".deleteItemProductSinglePage");
      confirmAction.onclick = () => {
        deleteItem(event)
          .then(result => result === 200 ? location.href = "products.html" : null);
      }
    }

  } catch (error) {
    document.location.href = "/";

  }
  updateDOM();
}

async function callFeaturedAPI(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    let html = "";

    let featuredArray = [];
    const featuredTitle = document.querySelector(".featuredTitle");

    featuredTitle.classList.add("d-none");
    featuredContainer.classList.add("d-none");

    result.forEach((featured) => {
      featured.featured ? featuredArray.push(featured) : "";

    });

    if (featuredArray.length > 1) {
      featuredTitle.classList.remove("d-none");
      featuredContainer.classList.remove("d-none");
    }

    for (let i = featuredArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = featuredArray[i];
      featuredArray[i] = featuredArray[j];
      featuredArray[j] = temp;
    }

    let amountOfCards = 0;

    for (let i = 0; i < featuredArray.length; i++) {
      let hiddenOnMd = "";

      if (i === 3) {
        hiddenOnMd = "d-md-none d-lg-block";
      }

      if (amountOfCards === 4) {
        break;
      }

      if (featuredArray[i].id === parseInt(id)) {
        if (i === featuredArray.length - 1) {
          break;
        } else {
          i++;
        }
      }

         html += `<div class="col  ${hiddenOnMd}  mb-4 id-${featuredArray[i].id}">
        <div class="text-center product-card">
          <div class="card-body">
            <a href="product-details.html?id=${featuredArray[i].id}">
              <p class="product-brand brand-id-${featuredArray[i].id}">${featuredArray[i].brand}</p>
              <p class="product-model model-id-${featuredArray[i].id}">${featuredArray[i].model}</p>
             
            <img src="${featuredArray[i].image?.formats?.thumbnail.url}"
                  class="product-thumbnail"
                  alt="${featuredArray[i].brand} ${featuredArray[i].model}"
                  title="${featuredArray[i].brand} ${featuredArray[i].model}"
                />
           
              <p class="product-price mt-4">${featuredArray[i].price},-</p>
            </a>
            <div class="mt-4">
            <button
              class="btn btn-primary shadow-none addToCartProd"
              data-id="${featuredArray[i].id}"
            >
              Add to cart
              </button>
            </div>

            <div class="admin-btns d-none">
                <a href="add-edit.html?id=${featuredArray[i].id}"><button class="btn mt-3 btn-sm btn-success d-inline">Edit</button></a>
                <button class="btn btn-danger mt-3  ml-3 d-inline btn-sm btn-delete-feat" data-id="${featuredArray[i].id}" data-toggle="modal" data-target="#confirmModal">Delete</button>
            </div>
        
          </div>
        </div>
      </div>`;

      amountOfCards++;
    };

    if (amountOfCards === 2)
      featuredContainer.classList.add("row-cols-sm-2", "row-cols-md-2", "row-cols-lg-2")
    if (amountOfCards === 3)
      featuredContainer.classList.add("row-cols-sm-2", "row-cols-md-3", "row-cols-lg-3")
    if (amountOfCards === 4)
      featuredContainer.classList.add("row-cols-sm-2", "row-cols-md-3", "row-cols-lg-4")

    featuredContainer.innerHTML = html;

    const addToCartButtons = document.querySelectorAll(".addToCartProd");

    addToCartButtons.forEach(
      (button) => (button.onclick = (event) => {
        addToCart(event);
        updateToast(event, "added");
      })
    );

    const deleteItemArray = document.querySelectorAll(".btn-delete-feat");

    deleteItemArray.forEach(
      (button) =>
        (button.onclick = (event) => {
          const id = event.target.dataset.id;
          const brand = document.querySelector(`.brand-id-${id}`);
          const model = document.querySelector(`.model-id-${id}`);


          modalBody.innerHTML = `Are you sure you want to delete ${brand.innerText} ${model.innerText} from store?`;
          modalTitle.innerHTML = `Delete item?`;
          modalHeader.classList.add("bg-warning");
         
          modalFooter.innerHTML = `  <button type="button" class="btn btn-secondary " data-dismiss="modal">No</button><button type="button" class="btn btn-primary shadow-none deleteItemProductSinglePageFeatured" data-dismiss="modal">Yes</button>
          `;
          const confirmAction = document.querySelector(".deleteItemProductSinglePageFeatured");
          confirmAction.onclick = () => {
            deleteItem(event)
              .then(result => result === 200 ? callFeaturedAPI(productURL) : null);
          }
        })
    );
    updateDOM();

  } catch (error) {

  }
}

callProductDetails(id);
callFeaturedAPI(productURL);
initializePill();
updateDOM();




