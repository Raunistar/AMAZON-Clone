import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
// import "../backend/backend-practice.js";

new Promise((resolve) => {
  loadProducts(() => {
    resolve("value1");
  });

}).then((value) => {
  renderOrderSummary();
  renderPaymentSummary();
});
