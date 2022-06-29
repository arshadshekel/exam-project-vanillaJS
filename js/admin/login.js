import { initializePill } from "../cart/showCartNumber.js";
import updateDOM, { updateToast } from "../util/updateDOM.js";
import { baseURL } from "../util/url.js";

export async function login(event, email, password) {
  event.preventDefault();
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  let emailModalValue, passwordModalValue;
  email? emailModalValue = email : null;
  password ? passwordModalValue = password : null;

  const loginUrl = baseURL + "auth/local";
  
  let data;
  if ((emailInput.value || passwordInput.value) === "") {
    data = JSON.stringify({
      identifier: emailModalValue.value,
      password: passwordModalValue.value
    })
  } else {
    data = JSON.stringify({
      identifier: emailInput.value,
      password: passwordInput.value,
    });

  };

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(loginUrl, options);
    const result = await response.json();

    $('.account').dropdown('hide');
    $('#confirmModal').modal('hide');
    localStorage.setItem("token", result.jwt);
    localStorage.setItem("user", result.user.username);
    updateToast(event, "loggedIn");
    setTimeout(() => updateDOM(),500);
  } catch (error) {
    $('.account').dropdown('show');
    $('#confirmModal').modal('hide');
    updateToast(event, "loginFail");
    emailInput.classList.add("is-invalid");
    passwordInput.classList.add("is-invalid");
    setTimeout(() => updateDOM(), 500);
  }
}

export function logout(event) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  updateToast(event, "logout");
  initializePill();
  $('.account').dropdown('hide');
  $('#confirmModal').modal("hide");
  setTimeout(() => updateDOM(), 700);
};


