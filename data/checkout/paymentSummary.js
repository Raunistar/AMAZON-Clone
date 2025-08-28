import { cart } from "../cart.js";
import { getProduct } from "../products.js";
import { getDeliveryOption } from "../deliveryOptions.js";
import { addOrder } from "../orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const estimatedTaxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + estimatedTaxCents;

  const paymentSummaryHTML = `
    <div class="delivery-options-title">
      Choose a delivery option:
    </div>
    <div class="payment-summary">
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (${cart.length}):</div>
        <div class="payment-summary-money">$${(productPriceCents / 100).toFixed(
          2
        )}</div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${(
          shippingPriceCents / 100
        ).toFixed(2)}</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${(
          totalBeforeTaxCents / 100
        ).toFixed(2)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${(estimatedTaxCents / 100).toFixed(
          2
        )}</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${(totalCents / 100).toFixed(
          2
        )}</div>
      </div>

      <button class="place-order-button button-primary js-place-order-btn">
        Place your order
      </button>
    </div>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  document
    .querySelector(".js-place-order-btn")
    .addEventListener("click", () => {
      const now = new Date();

      cart.forEach((item) => {
        addOrder({
          id: crypto.randomUUID(), // unique order ID
          productId: item.productId,
          quantity: item.quantity,
          datePlaced: now.toISOString(),
          deliveryDate: new Date(
            now.getTime() +
              getDeliveryOption(item.deliveryOptionId).deliveryDay *
                24 *
                60 *
                60 *
                1000
          ).toISOString(),
        });
      });

      // Clear cart
      localStorage.removeItem("cart");

      window.location.href = "orders.html";
    });
}
