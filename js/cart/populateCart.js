import {
  removeFromCart,
  changeAmount,
  getCart,
  clearCart,
} from "./cartFunctions.js";
import { initializePill } from "./showCartNumber.js";
import { baseURL } from "../util/url.js";
import updateDOM, { updateToast } from "../util/updateDOM.js";
let containsError = false;
const cartContainer = document.querySelector(".cartContainer");
let finalPriceUpdate = 0;
const productURL = baseURL + "products/"


async function callAPI(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    const cart = getCart();
    createCards(result, cart);

  } catch (error) {
  
  }
}

initializePill();
updateDOM();

callAPI(productURL);


function createCards(response, cart) {
  let html = "";
  let finalPrice = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<h4 class="text-center my-5">No items in cart</h4>`;
  } else {
    cart.forEach((element) => {
      for (let i = 0; i < response.length; i++) {
        if (response[i].id === parseInt(element.id)) {
          let totalPrice = response[i].price * element.amount;


          html += `<div class="cartItem p-3 mt-3 id-${response[i].id}">
        <div class="row">
            <div class="col-2 d-none d-md-block text-center py-3">
                <img src="${response[i].image?.formats?.thumbnail.url}" class="cart-img" alt="${response[i].model} ${response[i].brand}" title="${response[i].model} ${response[i].brand}">
           </div>
             
           <div class="col-12 col-md-10 pl-md-5 row pr-0 " >
                    <div class="col-12 col-md-6"">
                    <p class="cart-brand brand-id-${response[i].id}">${response[i].brand}</p>
                    <p class="cart-model model-id-${response[i].id} mt-3">${response[i].model}</p>
                    <div class="col pl-0 mt-5 d-none d-md-block" >
                    <button class="btn btn-primary shadow-none btn-sm"><a href="product-details.html?id=${response[i].id}">View</a></button>
                    <button class="btn btn-danger btn-sm ml-4 removeItemFromCart" data-id="${response[i].id}" data-toggle="modal" data-target="#confirmModal")>Remove</button> 
                </div>
                </div>
                <div class="col-12 col-md-6 row row-cols-md-2 pr-0 mt-4 mt-md-0 pl-md-5">
                    <div class="col col-7">
                        <p class="cart-title">Amount</p>

                        
                        <div class="input-group">
                            <input type="number" class="form-control mt-md-4 cartAmount" data-id="${response[i].id}" data-price="${response[i].price}" value="${element.amount}"  min="1">
                         </div>
                         <div class="invalid-feedback">
                          Please enter a valid number
                        </div>

                        

                        </div>
                        <div class="col col-5" >
                            <p class="cart-title pl-3 pl-md-5">Price</p>
                            <p class="cart-title pl-3 pl-md-5 mt-md-5 cart-price cart-id-${response[i].id}" " >${totalPrice},-</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-2 d-md-none"></div>
                <div class="col-12 col-md-10 row pr-0 pl-md-5 mt-5 mt-md-3 d-md-none">
                    <div class="col">
                        <a href="product-details.html?id=${response[i].id}"><button class="btn btn-primary shadow-none btn-sm">View</button></a>
                        <button class="btn btn-danger btn-sm ml-4 shadow-none ml-md-3 removeItemFromCart" data-id="${response[i].id}" data-toggle="modal" data-target="#confirmModal">Remove</button>
                    </div>
                
                </div>
                    
    
            </div>
    
        </div>
    </div>  `;

          finalPrice += totalPrice;
        }
      }
    });

    html += `
  <hr class="mt-5">

  <div class="row d-flex justify-content-end pr-3 ">
      <div>Total: <span class="font-weight-bold ml-3 finalPrice"> ${finalPrice},-</span></div>
  </div>
  <div class="row d-flex justify-content-between px-3 mt-4">
   <button class="btn btn-danger mt-4 clearCart" data-toggle="modal" data-target="#confirmModal">Empty cart</button>
    <button class="btn btn-primary shadow-none mt-4 toCheckout" data-target="#confirmModal">Proceed to checkout</button>
  </div>`;



    cartContainer.innerHTML = html;

    const checkoutBtn = document.querySelector(".toCheckout");
    const modalBody = document.querySelector(".modal-body");
    const modalTitle = document.querySelector(".modal-title");
    const modalFooter = document.querySelector(".modal-footer");
    const emptyCart = document.querySelector(".clearCart");
    const modalHeader = document.querySelector(".modal-header");
    modalHeader.classList.add("bg-warning");
    modalHeader.classList.remove("bg-primary");
    modalHeader.classList.remove("text-white");

    checkoutBtn.onclick = () => {
      modalBody.innerHTML = `Please enter a correct amount`;
      modalTitle.innerHTML = `Enter correct amount`;

      modalHeader.classList.remove("bg-primary", "text-white");
      modalHeader.classList.add("bg-warning");
      modalFooter.innerHTML = `<button type="button" class="btn btn-primary shadow-none toCheckout" data-dismiss="modal">OK</button>`;
      containsError ? $('#confirmModal').modal('show') : null;

    }
    emptyCart.onclick = (event) => {
      modalBody.innerHTML = `Are you sure you want to empty cart?`;
      modalTitle.innerHTML = `Empty cart?`;
      modalHeader.classList.remove("bg-primary", "text-white");
      modalHeader.classList.add("bg-warning");
      
      modalFooter.innerHTML = `<button type="button" class="btn btn-secondary " data-dismiss="modal">No</button>
      <button type="button" class="btn btn-primary shadow-none confirmAction" data-dismiss="modal">Yes</button>
          `;

      const confirmAction = document.querySelector(".confirmAction");
      confirmAction.onclick = () => {
        clearCart();
        updateToast(event, "emptiedCart");
        cartContainer.innerHTML = `<h4 class="text-center my-5">No items in cart</h4>`;
      }
    };

    const removeItemFromCart = document.querySelectorAll(".removeItemFromCart");
    removeItemFromCart.forEach(
      (button) =>
        (button.onclick = (event) => {
          const id = event.target.dataset.id;
          const brand = document.querySelector(`.brand-id-${id}`);
          const model = document.querySelector(`.model-id-${id}`);

          modalTitle.innerHTML = `Remove item from cart?`;
          modalBody.innerHTML = `Are you sure you want to remove ${brand.innerText} ${model.innerText} from cart?`;
          modalHeader.classList.remove("bg-primary", "text-white");
          modalHeader.classList.add("bg-warning");
          modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary " data-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary shadow-none data-id=${id} removeItemFromCart" data-dismiss="modal">Yes</button>`;


          const confirmAction = document.querySelector(".removeItemFromCart");

          confirmAction.onclick = () => {
            updateToast(event, "removed");
            removeFromCart(id);
            const cardID = ".id-" + id;
            document.querySelector(cardID).remove();
            updateTotalPrice();
            const emptyCart = getCart().length;
            emptyCart === 0 ? cartContainer.innerHTML = `<h4 class="text-center my-5">No items in cart</h4>` : null;
          }
        })
    );
  }


  const amountInput = document.querySelectorAll(".cartAmount");

  amountInput.forEach(
    (input) =>
      input.oninput = (event) => {
        let value = event.target.value;
        const id = event.target.dataset.id;
        const price = parseInt(event.target.dataset.price);
        const idString = ".cart-id-" + id;
        const priceContainer = document.querySelector(idString);

        let newTotalPrice = parseInt(value) * price;
        priceContainer.innerHTML = newTotalPrice + ",-";

        const reg = /^[+-]?[1-9][1-9]*|0$/;

        if (reg.test(value) && value > 0) {
          containsError = false;
          input.classList.remove('is-invalid');
          input.parentElement.classList.remove('is-invalid');
          changeAmount(id, parseInt(value));
          priceContainer.innerHTML = newTotalPrice + ",-";
        } else {
          input.classList.add('is-invalid');
          input.parentElement.classList.add('is-invalid');
          containsError = true
          priceContainer.innerHTML = 0 + ",-";
        };
        updateTotalPrice();
      }
  );
}


function updateTotalPrice() {
  const finalPriceContainer = document.querySelector(".finalPrice");
  const priceListArray = document.querySelectorAll(".cart-price");
  finalPriceUpdate = 0;

  priceListArray.forEach((price) => {
    finalPriceUpdate += parseInt(price.innerText);
    finalPriceContainer.innerHTML = finalPriceUpdate + ",-";
  })
}

