import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
// import "../backend/backend-practice.js";
loadProducts(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
