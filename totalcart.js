
const CART_KEY = "miantie_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function updatecart() {
  const cart = getCart();
  const totalQty = cart.reduce((total, item) => total + (item.qty || 0), 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.innerText = totalQty;
  }
}

/* Jalankan saat halaman dibuka */
document.addEventListener("DOMContentLoaded", updatecart);
