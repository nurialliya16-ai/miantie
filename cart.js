const CART_KEY = "miantie_cart";

/* Ambil data cart */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/* Simpan cart */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* Update badge cart */
function updatecart() {
  const cart = getCart();
  const totalQty = cart.reduce((total, item) => total + (item.qty || 0), 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.innerText = totalQty;
  }
}

/* Tambah qty */
function increaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty += 1;
    saveCart(cart);
    renderCartItems();
    updatecart();
  }
}

/* Kurangi qty */
function decreaseQty(id) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);

  if (!item) return;

  item.qty -= 1;

  // Jika qty 0 =>hapus item
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);
  renderCartItems();
  updatecart();
}

/* Render cart */
function renderCartItems() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cart = getCart();

  if (!cartItems) return;

  cartItems.innerHTML = "";
  let grandTotal = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center text-muted py-4">
        Keranjang masih kosong
      </div>
    `;
    if (cartTotal) cartTotal.innerText = "Rp0";
    return;
  }

  cart.forEach(item => {
    const totalHarga = item.price * item.qty;
    grandTotal += totalHarga;

    cartItems.innerHTML += `
      <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div class="d-flex align-items-center">
          <img src="${item.image}" width="70" class="me-3 rounded">
          <div>
            <h5 class="mb-1">${item.name}</h5>
            <small class="text-muted">
              Rp${item.price.toLocaleString("id-ID")}
            </small>
          </div>
        </div>

        <div class="text-end">
          <div class="fw-bold fs-5 mb-2">
            Rp${totalHarga.toLocaleString("id-ID")}
          </div>

          <div class="d-flex align-items-center justify-content-end gap-2">
            <button class="btn btn-outline-secondary btn-sm"
              onclick="decreaseQty(${item.id})">−</button>

            <span class="fw-bold">${item.qty}</span>

            <button class="btn btn-outline-secondary btn-sm"
              onclick="increaseQty(${item.id})">+</button>
          </div>
        </div>
      </div>
    `;
  });

  /* Total bayar */
  if (cartTotal) {
    cartTotal.innerText = `Rp${grandTotal.toLocaleString("id-ID")}`;
  }
}

/* Jalankan saat halaman dibuka */
document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
  updatecart();
});