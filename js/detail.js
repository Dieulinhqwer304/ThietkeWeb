export function renderDetail(product) {
  if (!product) {
    alert("Sản phẩm không tồn tại!");
    return;
  }
  const imgEl = document.querySelector("#chitietsanpham img");
  if (imgEl) imgEl.src = `assets/${product.folder}/${product.image}`;

  if (imgEl) imgEl.alt = product.name;

  const titleEl = document.querySelector("#chitietsanpham h1");
  if (titleEl) titleEl.textContent = product.name.toUpperCase();

  const priceEl = document.querySelector("#chitietsanpham .fs-5.fw-bold");
  if (priceEl)
    priceEl.textContent = `${
      product.price ? product.price.toLocaleString() : 450000
    }₫`;

  const descEl = document.querySelector("#chitietsanpham p.text-secondary");
  if (descEl) descEl.textContent = product.description;
}
