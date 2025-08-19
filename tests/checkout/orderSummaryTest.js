import { renderOrderSummary } from "../../data/checkout/orderSummary.js";
import { loadFromStorage, cart } from "../../data/cart.js";
import { loadProducts, loadProductsFetch } from "../../data/products.js";
describe("test suite: renderOrderSummary", () => {
  //product id's variable
  const pdtId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const pdtId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";
  //Hook
  beforeAll((done) => {
    loadProductsFetch().then(() => {
      done();
    });
  });
  beforeEach(() => {
    spyOn(localStorage, "setItem");
    document.querySelector(".js-tests-container").innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
    `;

    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: pdtId1,
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: pdtId2,
          quantity: 1,
          deliveryOptionId: "2",
        },
      ]);
    });
    loadFromStorage();
    renderOrderSummary();
  });
  //first test
  it("displays the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2
    );
    expect(
      document.querySelector(`.js-product-quantity-${pdtId1}`).textContent
    ).toContain("Quantity: 2");
    expect(
      document.querySelector(`.js-product-quantity-${pdtId2}`).textContent
    ).toContain("Quantity: 1");
    document.querySelector(".js-tests-container").innerHTML = "";
  });
  //second test
  it("removes a product", () => {
    document.querySelector(`.js-delete-link-${pdtId1}`).click();
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      1
    );
    expect(document.querySelector(`.js-cart-item-container-${pdtId1}`)).toEqual(
      null
    );
    expect(
      document.querySelector(`.js-cart-item-container-${pdtId2}`)
    ).not.toEqual(null);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(pdtId2);
    document.querySelector(".js-tests-container").innerHTML = "";
  });
});
