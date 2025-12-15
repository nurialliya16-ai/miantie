// ========================================
// CART MANAGEMENT JAVASCRIPT
// ========================================

const CART_KEY = "miantie_cart";

// ⭐ FUNGSI 1: Ambil data cart dari localStorage
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// ⭐ FUNGSI 2: Simpan cart ke localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ⭐ FUNGSI 3: Update badge cart (angka di icon cart)
function updatecart() {
  const cart = getCart();
  const totalQty = cart.reduce((total, item) => total + (item.qty || 0), 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.innerText = totalQty;
  }
}

// ⭐ FUNGSI 4: Tambah quantity item
function increaseQty(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty += 1;
    saveCart(cart);
    renderCartItems(); // ⭐ PENTING: Update tampilan
    updatecart(); // ⭐ PENTING: Update badge
  }
}

// ⭐ FUNGSI 5: Kurangi quantity item
function decreaseQty(id) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);

  if (!item) return;

  item.qty -= 1;

  // Jika qty 0 => hapus item
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);
  renderCartItems(); // ⭐ PENTING: Update tampilan
  updatecart(); // ⭐ PENTING: Update badge
}

// ⭐⭐⭐ FUNGSI UTAMA: Render cart items (YANG PALING PENTING!) ⭐⭐⭐
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal"); // ⭐ ID untuk Subtotal
  const cartTotal = document.getElementById("cart-total"); // ⭐ ID untuk Total
  const cart = getCart();

  if (!cartItemsContainer) {
    console.error("Element #cart-items tidak ditemukan!");
    return;
  }

  // Reset isi container
  cartItemsContainer.innerHTML = "";
  let grandTotal = 0;

  // ⭐ Jika cart kosong
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center text-muted py-4">
        Keranjang masih kosong
      </div>
    `;
    if (cartSubtotal) cartSubtotal.innerText = "Rp0";
    if (cartTotal) cartTotal.innerText = "Rp0";
    return;
  }

  // ⭐ Loop setiap item dan render dengan struktur modal BARU
  cart.forEach(item => {
    const totalHarga = item.price * item.qty;
    grandTotal += totalHarga;

    // ⭐ STRUKTUR HTML SESUAI DESAIN MODAL
    cartItemsContainer.innerHTML += `
      <div class="cart-item-modal">
        <div class="item-image-modal">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="item-details-modal">
          <h4 class="item-name-modal">${item.name}</h4>
          <p class="item-variant-modal">Varian: ${item.variant || 'Original'}</p>
        </div>
        <div class="item-price-modal">Rp${totalHarga.toLocaleString("id-ID")}</div>
        <div class="item-quantity-modal">
          <button class="qty-btn-modal" onclick="decreaseQty(${item.id})">-</button>
          <input type="number" value="${item.qty}" readonly>
          <button class="qty-btn-modal" onclick="increaseQty(${item.id})">+</button>
        </div>
      </div>
    `;
  });

  // ⭐⭐⭐ UPDATE SUBTOTAL DAN TOTAL (INI YANG PENTING!) ⭐⭐⭐
  if (cartSubtotal) {
    cartSubtotal.innerText = `Rp${grandTotal.toLocaleString("id-ID")}`;
  }
  if (cartTotal) {
    cartTotal.innerText = `Rp${grandTotal.toLocaleString("id-ID")}`;
  }

  console.log("✅ Cart rendered! Total:", grandTotal); // Debug log
}

// ⭐ FUNGSI 6: Process checkout (tombol Bayar)
function processCheckout() {
  const cart = getCart();
  
  if (cart.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }

  // Get form data
  const paymentMethod = document.querySelector('input[name="payment"]:checked');
  const nama = document.querySelector('.form-control-checkout[placeholder="Masukkan nama"]');
  const alamat = document.querySelector('.form-control-checkout[placeholder="Masukkan alamat"]');
  const kodePos = document.querySelector('.form-control-checkout[placeholder="Ex. 73923"]');
  const kota = document.querySelector('.form-control-checkout[placeholder="Ex. New York"]');
  
  // ⭐ Validation
  if (!nama.value || !alamat.value || !kodePos.value || !kota.value) {
    alert('Mohon lengkapi semua data!');
    return;
  }
  
  // ⭐ Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // ⭐ Prepare order data
  const orderData = {
    items: cart,
    total: total,
    paymentMethod: paymentMethod.value,
    customerInfo: {
      nama: nama.value,
      alamat: alamat.value,
      kodePos: kodePos.value,
      kota: kota.value
    },
    tanggal: new Date().toISOString()
  };
  
  console.log('✅ Order Data:', orderData);
  
  // ⭐ Show success message
  alert(`Pesanan berhasil!\nTotal: Rp${total.toLocaleString("id-ID")}\nMetode: ${paymentMethod.value.toUpperCase()}`);
  
  // ⭐ Clear cart
  localStorage.removeItem(CART_KEY);
  
  // ⭐ Close modal
  const modalElement = document.getElementById('cartpayment');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
    modal.hide();
  }
  
  // ⭐ Refresh cart display
  renderCartItems();
  updatecart();
}

// ⭐⭐⭐ JALANKAN SAAT HALAMAN LOAD (PENTING!) ⭐⭐⭐
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Cart script loaded!");
  renderCartItems(); // Render cart pertama kali
  updatecart(); // Update badge
});


document.getElementById('cartpayment')?.addEventListener('shown.bs.modal', function () {
  console.log("🛒 Modal cart dibuka!");
  renderCartItems(); // Refresh cart saat modal dibuka
});