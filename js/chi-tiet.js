import { addToCart } from "./boardgame.js";
export function renderDetail() {
  const product = JSON.parse(localStorage.getItem("chi-tiet"));
  if (!product) {
    alert("Sản phẩm không tồn tại!");
    return;
  }
  const imgEl = document.querySelector("#chitietsanpham img");
  if (imgEl) imgEl.src = `assets/${product.folder}/${product.image}`;

  if (imgEl) imgEl.alt = product.name;

  const titleEl = document.querySelector("#chitietsanpham .product-title");
  if (titleEl) titleEl.textContent = product.name.toUpperCase();

  const priceEl = document.querySelector("#chitietsanpham .product-price");
  if (priceEl)
    priceEl.textContent = `${
      product.price ? product.price.toLocaleString() : 450000
    }₫`;

  const descEl = document.querySelector("#chitietsanpham .product-description");
  if (descEl) descEl.textContent = product.description;

  const addCart = document.getElementById("addCart");
  const pay = document.getElementById("payment");
  const quantityEl = document.getElementById("quantity");
  const minusBtn = document.getElementById("minusButton");
  const plusBtn = document.getElementById("plusButton");

  let quantity = 1;

  const updateQuantityDisplay = () => {
    if (quantityEl) quantityEl.textContent = quantity;
  };

  if (minusBtn) {
    minusBtn.onclick = () => {
      if (quantity > 1) {
        quantity--;
        updateQuantityDisplay();
      }
    };
  }

  if (plusBtn) {
    plusBtn.onclick = () => {
      quantity++;
      updateQuantityDisplay();
    };
  }

  if (addCart) {
    addCart.onclick = () => {
      addToCart(product, 0, quantity);
    };
  }
  if (pay) {
    pay.onclick = () => {
      addToCart(product, 1, 1);
    };
  }
}
