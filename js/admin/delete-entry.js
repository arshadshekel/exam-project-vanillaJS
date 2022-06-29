import { baseURL } from "../util/url.js";
import { removeFromCart } from "../cart/cartFunctions.js"
import { updateToast } from "../util/updateDOM.js";

export default async function deleteItem(event) {
  event.preventDefault();

  const id = event.target.dataset.id;

  let singleItem = null;

  event.target.dataset.single ? singleItem = event.target.dataset.single : null;

  let url = baseURL + "products/" + id;

  const token = localStorage.getItem("token");
  const options = {
    method: "DELETE",
    body: {},
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
       url,
       options
     );   

    let statusCode = 1;

     if (response.status === 200) {
      if (singleItem) {
        updateToast(event, "deleted");
      } else {
        removeFromCart(id);
        updateToast(event, "deleted");
        const elementID = ".id-" + id;
        document.querySelector(elementID).remove();
      }
      statusCode = 200;
    }  

    return statusCode;

    } catch (error) {
     
    }
  
  }


