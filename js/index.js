import addToCart from "./cart/cartFunctions.js";
import { baseURL } from "./util/url.js";
import deleteItem from "./admin/delete-entry.js";
import { initializePill } from "./cart/showCartNumber.js";
import updateDOM, { updateToast } from "./util/updateDOM.js";

const modalBody = document.querySelector(".modal-body");
const modalTitle = document.querySelector(".modal-title");
const modalFooter = document.querySelector(".modal-footer");

const heropic = document.querySelector(".hero-pic");
const featuredContainer = document.querySelector(".featuredList");

const productURL = baseURL + "products/"
const heroURL = baseURL + "home/"

async function callHomeAPI(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    heropic.style.backgroundImage = `url('${result.hero_banner.url}')`;
    updateDOM();
  } catch (error) {
   
  }
}

async function callFeaturedAPI(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    let html = "";

    let featuredArray = [];

    result.forEach((featured) => {
      featured.featured ? featuredArray.push(featured) : "";
    });


    for (let i = featuredArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = featuredArray[i]
      featuredArray[i] = featuredArray[j]
      featuredArray[j] = temp
    }


    featuredArray.forEach((element) => {

      html += ` <div class="col mb-4 id-${element.id}" >
        <div class="text-center product-card-index">
          <div class="card-body ">
            <div class="row flex justify-content-center">
              <div class="col">
                <a href="product-details.html?id=${element.id}"> <img
                  src="${element.image?.formats?.thumbnail.url}"
                  class="product-thumbnail-index" alt="${element.brand} ${element.model}" title="${element.brand} ${element.model}"></a>
                  <div class="admin-btns d-none d-inline-block w-100">
                    <a href="add-edit.html?id=${element.id}"><button
                      class="btn btn-success mt-3 btn-sm d-inline">Edit</button></a>
                    <button class="btn btn-danger btn-sm d-inline btn-delete ml-sm-3 mt-3" data-id="${element.id}" data-toggle="modal"
                      data-target="#confirmModal">Delete</button>
                  </div>
                  </div>
                <div class="col text-left">
                  <p class="product-brand brand-id-${element.id}">${element.brand}</p>
                  <p class="product-model model-id-${element.id}">${element.model}</p>
                  <p class="product-price mt-4">${element.price},-</p>
                  <button class="btn btn-primary shadow-none addToCartProd mt-4" data-id=${element.id}>Add to cart</button>
                </div>
              </div>
              <div class="text-left mt-5 wallOfText"><a href="product-details.html?id=${element.id}">${truncateString(element.description, 200)}</a></div>
              <span>
                <hr></span>
                <a href="product-details.html?id=${element.id}"><button class="btn btn-primary shadow-none mt-3">View ${element.model}</button></a>
              </div>
            </div>
          </div>`;
    });

    featuredContainer.innerHTML = html;



    const addToCartButtons = document.querySelectorAll(".addToCartProd");

    addToCartButtons.forEach(
      (button) => (button.onclick = (event) => {
        addToCart(event);
        updateToast(event, "added");
      })
    );

    const deleteItemArray = document.querySelectorAll(".btn-delete");

    deleteItemArray.forEach(
      (button) =>
        button.onclick = (event) => {
          const id = event.target.dataset.id;

          const brand = document.querySelector(`.brand-id-${id}`);
          const model = document.querySelector(`.model-id-${id}`);

          modalBody.innerHTML = `Are you sure you want to delete ${brand.innerText} ${model.innerText} from store?`;
          modalTitle.innerHTML = `Delete item?`;
         
          modalFooter.innerHTML = `        <button type="button" class="btn btn-secondary " data-dismiss="modal">No</button><button type="button" class="btn btn-primary shadow-none deleteItemIndexFeatured" data-dismiss="modal">Yes</button>
  `;
          
          const confirmAction = document.querySelector(".deleteItemIndexFeatured");

          confirmAction.onclick = () => {
            deleteItem(event)
              .then(result => result === 200 ? updateDOM() : null);
          }
          
        });
    
    updateDOM();
  } catch (error) {
   
  }
}

callHomeAPI(heroURL);
callFeaturedAPI(productURL);
initializePill();
updateDOM();


function truncateString(str, num) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}


