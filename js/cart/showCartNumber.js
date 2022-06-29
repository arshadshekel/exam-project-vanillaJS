import { getCart } from "./cartFunctions.js";


const cartPillContainer = document.querySelector(".cart-pill");

export function updatePill(cartLength) {

    if (cartLength === 0) {
      
        cartPillContainer.style.display = "none";
    } else {
        
        cartPillContainer.style.display = "inline";
    }

    cartPillContainer ? cartPillContainer.innerHTML = cartLength : null;
}

export function initializePill() {
    const cartLengthInitial = getCart().length;
    if (cartLengthInitial === 0) {
        
        cartPillContainer.style.display = "none";
    } else {
 
        cartPillContainer.style.display = "inline";
    }

  
    cartPillContainer ? cartPillContainer.innerHTML = cartLengthInitial : null;
}
