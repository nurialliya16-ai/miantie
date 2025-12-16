/* ================== DATA PRODUK ================== */
const products = [
  { id: 1, name: "Bingka Original", image: "./images/bingkaoriginal.png", price: 5000, unit: "PCS" },
  { id: 2, name: "Bingka Chocochip", image: "./images/Bingka-Chocochip.png", price: 6000, unit: "PCS" },
  { id: 3, name: "Bingka Keju", image: "./images/bingka-keju.png", price: 6000, unit: "PCS" },
  { id: 4, name: "Bingka Coklat", image: "./images/bingkacoklat.png", price: 6000, unit: "PCS" },
  { id: 5, name: "Bingka Kismis", image: "./images/Bingka-Kismis.png", price: 6000, unit: "SACKS" },
  { id: 6, name: "Es Mambo Coklat", image: "./images/mambo-coklat.png", price: 1000, unit: "PCS" },
  { id: 7, name: "Es Mambo Taro", image: "./images/mambo-taro.png", price: 1000, unit: "PCS" },
  { id: 8, name: "Es Mambo Strawberry", image: "./images/mambo-strawberry.png", price: 1000, unit: "PCS" },
  { id: 9, name: "Es Mambo Matcha", image: "./images/mambo-matcha.png", price: 1000, unit: "PCS" },
  { id: 10, name: "Es Mambo Blueberry", image: "./images/mambo-blueberry.png", price: 1000, unit: "PCS" },
  { id: 11, name: "Bolu Ketan Original", image: "./images/boluketan-ori.png", price: 15000, unit: "3 PCS" },
  { id: 12, name: "Bolu Ketan Lumer", image: "./images/boluketan-lumer.png", price: 20000, unit: "3 PCS" }
];

/* ================== ELEMENT ================== */
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("searchInput");
const cartCountEl = document.getElementById("cart-count");

/* ================== CART (LOCAL STORAGE) ================== */
const CARTKEY = "miantie_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CARTKEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CARTKEY, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cartCountEl) {
    cartCountEl.innerText = totalQty;
  }
}

function addToCart(product) {
  let cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

/* ================== RENDER PRODUK ================== */
function renderProducts(data) {
  productList.innerHTML = "";

  if (data.length === 0) {
    productList.innerHTML = `
      <div class="col-12 text-center text-muted">
        Produk tidak ditemukan
      </div>
    `;
    return;
  }

  data.forEach(product => {
    productList.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">
            Rp${product.price.toLocaleString("id-ID")}
            <span>/${product.unit}</span>
          </p>
          <button class="btn-pilih" onclick="selectProduct(${product.id})">
            Pilih
          </button>
        </div>
      </div>
    `;
  });
}

/* ================== SEARCH ================== */
searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(keyword)
  );

  renderProducts(filteredProducts);
});

/* ================== PILIH PRODUK ================== */
function selectProduct(id) {
  const product = products.find(p => p.id === id);
  addToCart(product);
  showAddToCartAlert(product.name);
}

function showAddToCartAlert(productName) {
  const alertBox = document.getElementById("cart-alert");

  alertBox.innerText = `✅ ${productName} ditambahkan ke keranjang`;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000); // 2 detik
}


/* ================== INIT ================== */
renderProducts(products);
updateCartCount();