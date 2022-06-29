import { login, logout } from "../admin/login.js";

export default function updateDOM() {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const user = localStorage.getItem("user");
  const adminButtons = document.querySelectorAll(".admin-btns");
  const addNewProduct = document.querySelectorAll(".addNewProduct");
  const modalHeader = document.querySelector(".modal-header");
  const userIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="signin mr-3 ml-0" width="24px" height="24px">
  <path d="M0 0h24v24H0z" fill="none" />
  <path
    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>`;

  let pathname = location.href;
  const urlFilename = pathname.substring(pathname.lastIndexOf("/") + 1);

  user === "admin"
    ? adminButtons.forEach((item) => item.classList.add("d-inline-block"))
    : adminButtons.forEach((item) => item.classList.remove("d-inline-block"));
  user === "admin"
    ? addNewProduct.forEach((item) => item.classList.add("d-block"))
    : addNewProduct.forEach((item) => item.classList.remove("d-block"));

  const nodesToBeRemoved = document.querySelectorAll(".account");
  nodesToBeRemoved.forEach((node) => {
    node.remove();
  });

  if (window.innerWidth < 992) {
    dropdownMenu.insertAdjacentHTML(
      "beforebegin",
      '<a href="index.html" data-toggle="modal" data-target="#confirmModal" class="account"></a>'
    );
    $(".dropdown-menu").dropdown("hide");
  } else if (window.innerWidth >= 992) {
    dropdownMenu.insertAdjacentHTML(
      "beforebegin",
      '<a href="index.html" data-toggle="dropdown" class="account" style="position: relative"></a>'
    );
  }

  const account = document.querySelector(".account");
  user
    ? (account.innerHTML = `${user} ${userIconSVG}`)
    : (account.innerHTML = `Sign in ${userIconSVG}`);

  if (localStorage.getItem("user")) {
    modalHeader.classList.add("bg-warning");
    modalHeader.classList.remove("bg-primary");
    modalHeader.classList.remove("text-white");
  } else {
    modalHeader.classList.remove("bg-warning");
    modalHeader.classList.add("bg-primary");
    modalHeader.classList.add("text-white");
  }

  if (urlFilename === "login.html") {
    user === "admin"
      ? (document.title = `PHONEX - ${user}`)
      : (document.title = "PHONEX - Sign in");
  }

  populateDropdown();
}

const toastMessage = document.querySelector(".toast-body");
const toastContainer = document.querySelector(".toast");

export function updateToast(event, type) {
  let id = "";

  event.target.dataset.id ? (id = event.target.dataset.id) : (id = null);
  toastMessage.classList.remove("bg.success", "bg-info", "bg-danger");
  toastContainer.classList.remove("bg.success", "bg-info", "bg-danger");

  if (id) {
    const brand = document.querySelector(`.brand-id-${id}`);
    const model = document.querySelector(`.model-id-${id}`);

    if (type === "added") {
      toastMessage.classList.add("bg-success");
      toastContainer.classList.add("bg-success");
      toastMessage.innerHTML = `You added ${brand.innerText} ${model.innerText} to cart`;
      showNotification();
    } else if (type === "removed") {
      toastMessage.classList.add("bg-info");
      toastContainer.classList.add("bg-info");
      toastMessage.innerHTML = `You removed ${brand.innerText} ${model.innerText} from cart`;
      showNotification();
    } else if (type === "deleted") {
      toastMessage.classList.add("bg-info");
      toastContainer.classList.add("bg-info");

      if ((brand || model) === null) {
        const model = document.querySelector(".modelInput");
        const brand = document.querySelector(".brandInput");
        toastMessage.innerHTML = `You deleted ${brand.value} ${model.value} from the store`;
      } else {
        toastMessage.innerHTML = `You deleted ${brand.innerText} ${model.innerText} from the store`;
      }
      showNotification();
    }
  }

  if (type === "updated") {
    toastMessage.classList.add("bg-success");
    toastContainer.classList.add("bg-success");
    const model = document.querySelector(".modelInput");
    const brand = document.querySelector(".brandInput");
    toastMessage.innerHTML = `You updated ${brand.value} ${model.value} in the store`;
    showNotification();
  }

  if (type === "logout") {
    toastMessage.classList.add("bg-info");
    toastContainer.classList.add("bg-info");
    toastMessage.innerHTML = `You have logged out!`;
    showNotification();
  } else if (type === "emptiedCart") {
    toastMessage.classList.add("bg-info");
    toastContainer.classList.add("bg-info");
    toastMessage.innerHTML = `You emptied cart!`;
    showNotification();
  } else if (type === "loginFail") {
    toastMessage.classList.add("bg-danger");
    toastContainer.classList.add("bg-danger");
    toastMessage.innerHTML = `You entered wrong login information`;
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    emailInput.classList.add("is-invalid");
    passwordInput.classList.add("is-invalid");
    showNotification();
  } else if (type === "loggedIn") {
    toastMessage.classList.add("bg-success");
    toastContainer.classList.add("bg-success");
    toastMessage.innerHTML = `You have logged in`;
    showNotification();
  } else if (type === "addedToStore") {
    toastMessage.classList.add("bg-success");
    toastContainer.classList.add("bg-success");
    const modelInput = document.querySelector(".modelInput");
    const brandInput = document.querySelector(".brandInput");
    toastMessage.innerHTML = `You added ${brandInput.value} ${modelInput.value} to the store`;
    showNotification();
  } else if (type === "needToLogIn") {
    toastMessage.classList.add("bg-danger");
    toastContainer.classList.add("bg-danger");
    toastMessage.innerHTML = `You need to log in first`;
    showNotification();
  }
}

function showNotification() {
  $(".toast").removeClass("d-none").toast({ delay: 2500 }).toast("show");
  setTimeout(function () {
    $(".toast").addClass("d-none");
  }, 3000);
}

let resizeId;

window.addEventListener("resize", function () {
  clearTimeout(resizeId);

  resizeId = setTimeout(updateDOM(), 1000);
});

export function populateDropdown() {
  const modalTitle = document.querySelector(".modal-title");
  const loginSection = document.querySelector(".loginSection");
  const modalBody = document.querySelector(".modal-body");
  const modalFooter = document.querySelector(".modal-footer");
  const accountBtn = document.querySelector(".account");

  if (accountBtn) {
    accountBtn.onclick = () => {
      if (window.innerWidth < 992) {
        updateDOM();
      }

      if (localStorage.getItem("user")) {
        modalTitle.innerHTML = `Log out?`;
        modalBody.innerHTML = `Do you want to log out?`;

        loginSection.innerHTML = `
              <form style="min-width:150px" class="w-100">
            <div class="form-group justify-content-center">
             <p class="font-weight-bold"> You are logged in </p>
           <div class="dropdown-divider"></div>
           <button class="btn btn-sm mt-3 btn-logout btn-danger" data-toggle="dropdown" data-target="#dropDown"
                type="button">Logout</button>
           <button class="btn btn-sm ml-3 mt-3 btn-logout btn-secondary" data-toggle="dropdown" data-target="#dropDown"
                type="button">Close</button>
                   </div>
                </form>`;
        modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary " data-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary shadow-none modalLogout" data-dismiss="modal">Yes</button>;
          `;
        const logoutBtn = document.querySelector(".btn-logout");
        logoutBtn ? (logoutBtn.onclick = (event) => logout(event)) : null;

        const logoutModalButton = document.querySelector(".modalLogout");
        logoutModalButton
          ? (logoutModalButton.onclick = (event) => logout(event))
          : null;
      } else {
        $(".dropdown-menu").click(function (e) {
          e.stopPropagation(e);
        });
        loginSection.innerHTML = `          
              <form style="min-width: 300px; margin: 0 auto;" class="loginForm" novalidate>
                <div class="form-group col-3 col-sm-12">
                  <label for="exampleInputEmail1" class="font-weight-bold">Email address</label>
                  <input type="email" class="form-control" id="email" aria-describedby="emailHelp" value="admin@admin.com">
                </div>
                <div class="form-group col-3 col-sm-12">
                  <label class="font-weight-bold" for="exampleInputPassword1">Password</label>
                  <input type="password"  class="form-control" id="password" value="Test1234">
              <button class="btn btn-sm mt-4 btn-logout-dropdown btn-primary shadow-none"
                type="button">Login</button>
              <button class="btn btn-sm mt-4 ml-3 btn-logout-dropdown btn-secondary" data-toggle="dropdown" data-target="#dropDown"
                type="button">Close</button>
                </div>
       </form>   `;

        const loginBtn = document.querySelector(".btn-logout-dropdown");

        loginBtn.onclick = (event) => {
          $(".account").dropdown("show");
          login(event);
        };
        modalTitle.innerHTML = "Do you wish to log in?";

        modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary shadow-none modalLogin" type="submit" form="modalForm">Yes</button>;
          `;
        modalBody.innerHTML = `<form style="min-width: 300px; margin: 0 auto;" class="loginForm" id="modalForm" novalidate>
      <div class="form-group">
        <label class="font-weight-bold" for="exampleInputEmail1">Email address</label>
        <input type="emailModal" class="form-control" id="emailModal" aria-describedby="emailHelp" value="">
                </div>
        <div class="form-group">
          <label class="font-weight-bold" for="exampleInputPassword1">Password</label>
          <input type="text" class="form-control" id="passwordModal" value="">
        </div>
       </form>`;

        const email = document.querySelector("#emailModal");
        const password = document.querySelector("#passwordModal");

        let emailModalValue;
        let passwordModalValue;

        email.oninput = (event) => (emailModalValue = event.target.value);
        password.oninput = (event) => (passwordModalValue = event.target.value);

        const loginModalButton = document.querySelector(".modalLogin");

        loginModalButton.onclick = (event) => {
          console.log(event);
          login(event, email, password);
        };
      }
    };
  }
}
