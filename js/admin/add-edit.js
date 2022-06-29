import { baseURL } from "../util/url.js";
import { initializePill } from "../cart/showCartNumber.js";
import updateDOM, { updateToast } from "../util/updateDOM.js";
import deleteItem from "./delete-entry.js";

const productURL = baseURL + "products/";

initializePill();
updateDOM();

let id = "";
let item = "";

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
params.get("id") ? id = params.get("id") : id = "";
item = params.get("item");

let url = id ? productURL + id : productURL;
let formContainsError = false;
let brandInputError, modelInputError, priceInputError, descriptionInputError, uploadInputError = "";
let hasUploaded = false;

const form = document.querySelector("form");
const checkbox = document.querySelector(".featured");
const imgInput = document.querySelector(".imgInput");
const brandInput = document.querySelector(".brandInput");
const modelInput = document.querySelector(".modelInput");
const descInput = document.querySelector(".descInput");
const priceInput = document.querySelector(".priceInput");
const imgContainer = document.querySelector(".uploadedPicture");
const buttonContainer = document.querySelector(".adminFormButtons");
const modalBody = document.querySelector(".modal-body");
const modalTitle = document.querySelector(".modal-title");
const pageTitle = document.querySelector("h2");

id ? callAPISingle(url) : null;

item ? imgContainer.src = "images/placeholder.png" : null;
form.style.display = "none";
pageTitle.innerHTML = `Add new item`
document.title = `PHONEX - Add new item`

async function callAPISingle(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();

    brandInput.value = result.brand;
    modelInput.value = result.model;
    priceInput.value = result.price;
    descInput.value = result.description;
    imgContainer.src = result.image?.url;
    
    result.featured === true ? checkbox.click() : null;
    hasUploaded = true;
    pageTitle.innerHTML = `Update ${result.brand} ${result.model}`
    document.title = `PHONEX - Update ${result.brand} ${result.model}`

  } catch (error) {
   
  }
}

window.setTimeout(() => {
  form.style.display = "block";
  drawFormButtons();
}, 500);


async function add(event) {
  event.preventDefault();

  checkbox.checked ? (checkbox.value = true) : (checkbox.value = false);

  const data = {
    brand: brandInput.value,
    model: modelInput.value,
    price: priceInput.value,
    description: descInput.value,
    featured: checkbox.value,
  };

  const formData = new FormData();

  if (imgInput.value !== "") {

    formData.append(
      `files.${imgInput.name}`,
      imgInput.files[0],
      imgInput.files[0].name
    );
  }

  formData.append("data", JSON.stringify(data));

  const token = localStorage.getItem("token");

  let submissionMethod = "";

  if (id !== null) {
    submissionMethod = "PUT";
  }

  if (item === "new") {
    submissionMethod = "POST";
  }

  const options = {
    method: submissionMethod,
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    validateForm();

    if (!formContainsError) {
    
      const response = await fetch(
        url,
        options
      );

      const result = await response.json();
           
        if (submissionMethod === "POST") {
        
          buttonContainer.innerHTML = `<button class="btn btn-primary shadow-none submitBtn data-id="${result.id}" type="button">Update</button>`;
          item = "added new item";
          id = result.id;
          drawFormButtons();
          url = productURL + id;
          pageTitle.innerHTML = `Update ${result.brand} ${result.model}`
          document.title = `PHONEX - Update ${result.brand} ${result.model}`
          updateToast(event, "addedToStore");
          imgContainer.alt = `${result.brand} ${result.model}`;
          
        } else if (submissionMethod === "PUT"){
          updateToast(event, "updated");
        } 
        
        if(response.status === 401){
            updateToast(event, "needToLogIn");
          }    
        }
        

  } catch (error) {
  

  }
}


imgInput.onchange = (event) => {

  const selectedFile = event.target.files[0];

  const reader = new FileReader();

  reader.onload = function (event) {
    if (isFileImage(selectedFile)) {
      imgContainer.src = event.target.result;
      hasUploaded = true;
      imgInput.classList.remove("is-invalid");
    } else {
      imgInput.classList.add("is-invalid");
      hasUploaded = false;
    }
  };
  reader.readAsDataURL(selectedFile);

}

function isFileImage(file) {
  return file && file['type'].split('/')[0] === 'image';
}


function validateForm() {

  const inputs = document.querySelectorAll(".form-control");

  inputs.forEach(input => {

    if (input.classList.contains("brandInput")) {
      if (input.value === "") {
        input.classList.add("is-invalid");
        brandInputError = true;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        brandInputError = false;
      }

    }

    if (input.classList.contains("modelInput")) {
      if (input.value === "") {
        input.classList.add("is-invalid");
        modelInputError = true;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        modelInputError = false;
      }

    }

    if (input.classList.contains("descInput")) {
      if (input.value === "") {
        input.classList.add("is-invalid");
        descriptionInputError = true;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        descriptionInputError = false;
      }

    }

    if (input.classList.contains("priceInput")) {
      const reg = /^[+-]?[1-9][1-9]*|0$/;

      if (reg.test(input.value) && input.value > 0) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        priceInputError = false;
      } else {
        input.classList.add("is-invalid");
        priceInputError = true;
      }

    }

    if (input.classList.contains("imgInput")) {
      if (hasUploaded) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        uploadInputError = false;
      } else {
        input.classList.add("is-invalid");
        uploadInputError = true;
      }
    }
  });

  (brandInputError || modelInputError || priceInputError || descriptionInputError || uploadInputError) === true ? formContainsError = true : formContainsError = false;

}

function drawFormButtons() {
  if (id) {
    buttonContainer.innerHTML = `<button class="btn btn-primary b-inline-block shadow-none submitBtn" type="button" data-id="${id}"> Update</button>
                                <a href="product-details.html?id=${id}" <button class="btn b-inline-block ml-3 btn-sm btn-success shadow-none" type = "button">View</button></a>
            <button class="btn btn-danger btn-sm b-inline-block ml-3 btn-delete" data-id="${id}" data-toggle="modal" data-single="single" data-target="#confirmModal" type="button">Delete</button>`;

    const deleteItemBtn = document.querySelector(".btn-delete");
    deleteItemBtn.onclick = (event) => {

      const brand = document.querySelector(`.brandInput`);
      const model = document.querySelector(`.modelInput`);

      modalBody.innerHTML = `Are you sure you want to delete ${brand.value} ${model.value} from store ? `;
      modalTitle.innerHTML = `Delete item ? `;
      
      const confirmAction = document.querySelector(".confirmAction");
      confirmAction.onclick = () => {
        deleteItem(event)
          .then(result => result === 200 ? setTimeout(() => { location.href = "products.html" }, 3000) : null);
      }
    }
  } else {
    buttonContainer.innerHTML = `<button class="btn btn-primary shadow-none submitBtn data-id="${id}" type="button">Submit</button>`;
  }

  const submitFormBtn = document.querySelector(".submitBtn");
  submitFormBtn.onclick = (event) => {
    add(event);
  }

}