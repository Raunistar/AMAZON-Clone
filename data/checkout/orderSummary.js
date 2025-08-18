import { cart, removeFromCart, updateDeliveryOption } from "../cart.js";
import { products } from "../products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../deliveryOptions.js";
import { renderPaymentSummary } from "../checkout/paymentSummary.js";
export function renderOrderSummary() {
  let cartSummaryHtml = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingPdt = products.find((product) => product.id === productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDay, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHtml += `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${
      matchingPdt.id
    }">
      <div class="delivery-date">
        Delivery date:${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingPdt.image}">

        <div class="cart-item-details">
          <div class="product-name">${matchingPdt.name}</div>
          <div class="product-price">${matchingPdt.getPrice()}</div>
          <div class="product-quantity js-product-quantity-${matchingPdt.id}">
            <span>Quantity: <span class="quantity-label">${
              cartItem.quantity
            }</span></span>
            <span class="update-quantity-link link-primary js-update-link"
                  data-product-id="${matchingPdt.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
              matchingPdt.id
            }"
                  data-product-id="${matchingPdt.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
        ${deliveryOptionsHTML(matchingPdt, cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryOptionsHTML(matchingPdt, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDay, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${(deliveryOption.priceCents / 100).toFixed(2)}`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `   <div class="delivery-option js-delivery-option" data-product-id="${
        matchingPdt.id
      }" data-delivery-option-id="${deliveryOption.id}">

            <input type="radio" ${
              isChecked ? "checked" : ""
            } class="delivery-option-input" name="delivery-option-${
        matchingPdt.id
      }">
            <div>
              <div class="delivery-option-date">${dateString}</div>
              <div class="delivery-option-price">${priceString} - Shipping</div>
            </div>
          </div>`;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) container.remove(); // safe remove
      renderPaymentSummary();
    });
  });
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
