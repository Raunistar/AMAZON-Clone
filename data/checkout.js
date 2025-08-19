import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
// import "../backend/backend-practice.js";

//using async and await
async function loadPage(params) {
  try {

    await loadProductsFetch();
    await new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });

  } catch (error) {
    console.log("Unexpected Error. Please Try Again later.");
  }

  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

//using actual promise
/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  }),
]).then((values) => {
  console.log(values);
  renderOrderSummary();
  renderPaymentSummary();
});
*/
