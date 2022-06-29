import { updatePill } from "./showCartNumber.js";

function addToCart(event) {
  const id = event.target.dataset.id;

  let currentCart = getCart();

  if (currentCart.length === 0) {
    const obj = { id: id, amount: 1 };
    currentCart.push(obj);

  } else {
    const obj = { id: id, amount: 1 };

    let foundObject = currentCart.find((element) => element.id === id);
    
    foundObject ? foundObject.amount = foundObject.amount + 1 : currentCart.push(obj);

  }
  saveToCart(currentCart);
  const cartLength = currentCart.length;
  updatePill(cartLength);

}

function saveToCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getCart() {
  const cart = localStorage.getItem("cart");

  return cart === null ? [] : JSON.parse(cart);
}

export function removeFromCart(id) {
  let currentCart = getCart();

  const cart = currentCart.filter((item) => item.id !== id);

  saveToCart(cart);
  const cartLength = cart.length;
  updatePill(cartLength);
}

export function clearCart() {
  localStorage.removeItem("cart");

  updatePill(0);
}

export function changeAmount(id, amount) {

  let currentCart = getCart();

  let foundObject = currentCart.find((element) => element.id === id);

  foundObject ? foundObject.amount = amount : null;

  saveToCart(currentCart);
  const cartLength = currentCart.length;
  updatePill(cartLength);
}

export default addToCart;
