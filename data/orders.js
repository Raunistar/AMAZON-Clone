// orders.js
import { products } from "./products.js";

export const orders = JSON.parse(localStorage.getItem("orders")) || [];

// Add order with proper product details
export function addOrder(productId, quantity, deliveryOptionId = "1") {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    console.error("❌ Invalid productId:", productId);
    return;
  }

  const order = {
    orderId: crypto.randomUUID(),
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    quantity: quantity,
    deliveryOptionId: deliveryOptionId,
    datePlaced: new Date().toISOString(),
  };

  orders.unshift(order);
  saveToStorage();
}

// Save orders in localStorage
function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Get all orders
export function getOrders() {
  return orders;
}

// Remove an order by orderId
export function removeOrder(orderId) {
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index > -1) {
    orders.splice(index, 1);
    saveToStorage();
  }
}
