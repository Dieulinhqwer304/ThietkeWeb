import { imageData } from "../data/image.js";
import { loadCartCount } from "./cart.js";
export async function loadImage() {
  const container = document.getElementById("gamenoibat");
  const hash = window.location.hash;
  const pathParts = hash
    ? hash.replace("#", "").replace(".html", "").split("/")
    : [];
  const pageName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : "";

  const itemsPerPage = 8;
  let currentPage = 1;

  function renderPage(pageData) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const searchTerm =
      document.getElementById("searchInput")?.value?.toLowerCase() || "";
    const filteredItems = pageData.item.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = filteredItems.slice(startIndex, endIndex);

    let bodySection = "";
    currentItems.forEach((product) => {
      bodySection += `
        <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
          <div class="product-card shadow p-3 bg-white rounded-4 overflow-hidden h-100">
           <img
              src="assets/${product.folder}/${product.image}"
              class="product-img mb-3 rounded-4 hover-zoom"
              style="object-fit: cover; width: 100%; height: 220px; cursor: pointer;"
              alt="${product.name ?? ""}"
              data-bs-toggle="modal"
              data-bs-target="#imageModal"
              data-image="assets/${product.folder ?? pageData.folder}/${
        product.image
      }"
            />
            <p class="product-name fw-bold text-gradient-red d-block mb-1 text-center">
              ${product.name ?? ""}
            </p>
            <p class="product-price fw-bold d-block mt-1 text-center">
              <span class="text-gradient-red">${
                product.price ? product.price.toLocaleString() : 450000
              }₫</span>
              <span class="text-dark text-decoration-line-through ms-2"
                >${
                  product.oldPrice ? product.oldPrice.toLocaleString() : 500000
                }₫</span>
            </p>
            <div class="d-flex justify-content-center gap-2 mt-3">
              <a class="add-button btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#addGameModel" href="#">Thêm vào giỏ</a>
              <a href="#cart" class="add-button btn btn-danger">Mua ngay</a>
            </div>
          </div>
        </div>`;
    });

    let paginationHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#">${i}</a>
        </li>`;
    }

    const html = `
      <div class="container-md">
       <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center my-5 gap-4">
          <h1 class="header-font text-gradient-red hover-underline-center m-0">
            ${pageData.name}
          </h1>

          <form id="searchForm" class="search-box d-flex align-items-center rounded-pill shadow-sm px-2" style="background-color: #f8f9fa; max-width: 350px;">
            <input
              id="searchInput"
              type="search"
              class="form-control border-0 bg-transparent px-3 py-2 rounded-pill"
              placeholder="Tìm game..."
              aria-label="Search"
              style="box-shadow: none;"
            />
            <button id="searchButton" class="btn btn-dark d-flex align-items-center justify-content-center rounded-circle ms-2" type="button" style="width: 40px; height: 40px;">
                <i class="bi bi-search"></i>
              </button>
          </form>
        </div>

        ${
          filteredItems.length > 0
            ? ` <div class="container mb-5">
              <div class="row gx-5">${bodySection}</div>
              <nav
                aria-label="Page navigation"
                class="mt-4 d-flex justify-content-center"
              >
                <ul class="pagination" id="pagination">
                  ${paginationHTML}
                </ul>
              </nav>
            </div>`
            : `<p class="text-danger text-center mt-5">
              Không tìm thấy dữ liệu sản phẩm.
            </p>`
        }
      </div>`;
    function addToCart(product) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find((item) => item.name === product.name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      loadCartCount();
      showToast("Thành công", "Thêm vào giỏ hàng thành công!", "success");
    }
    container.innerHTML = html;
    document
      .querySelectorAll(".add-button.btn-outline-dark")
      .forEach((button, index) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const product =
            filteredItems[(currentPage - 1) * itemsPerPage + index];
          addToCart(product);
        });
      });
    document.querySelectorAll(".product-img").forEach((img) => {
      img.addEventListener("click", () => {
        const imageSrc = img.getAttribute("data-image");
        document.getElementById("modalImage").src = imageSrc;
      });
    });
    const searchButton = document.getElementById("searchButton");
    searchButton.onclick = () => {
      currentPage = 1;
      renderPage(pageData);
      container.scrollIntoView({ behavior: "smooth" });
    };
    document.querySelectorAll("#pagination .page-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = parseInt(link.textContent);
        renderPage(pageData);
      });
    });
  }

  if (container) {
    try {
      const data = imageData;
      let pageData;
      if (pathParts && pathParts.includes("boardgame")) {
        pageData = {
          name:
            pathParts.length > 1 ? data[pageName].name : "Danh sách Board Game",
          item: [],
        };
        const dataFill =
          pathParts.length > 1 ? [data[pageName]] : Object.values(data);
        dataFill.forEach((category) => {
          if (category.item && Array.isArray(category.item)) {
            category.item.forEach((item) => {
              pageData.item.push({
                folder: category.folder,
                ...item,
              });
            });
          }
        });
      }
      if (!pageData || !pageData.item || !Array.isArray(pageData.item)) {
        container.innerHTML = `
          <p class="text-danger text-center mt-5">Không tìm thấy dữ liệu sản phẩm.</p>`;
        return;
      }
      renderPage(pageData);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu ảnh:", err);
      container.innerHTML = `<p class="text-danger text-center mt-5">Không tìm thấy dữ liệu sản phẩm.</p>`;
    }
  }
}
