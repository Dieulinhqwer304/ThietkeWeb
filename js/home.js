import { addToCart } from "../js/boardgame.js";

export function loadHome() {
  setTimeout(() => {
    if (
      $("#dssanphammois").length &&
      !$("#dssanphammois").hasClass("owl-loaded")
    ) {
      $("#dssanphammois").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 },
        },
      });
    }

    // Gán sự kiện sau khi carousel đã render
    document.querySelectorAll(".product-img").forEach((img) => {
      img.onclick = function () {
        const product = JSON.parse(this.getAttribute("data-product"));
        localStorage.setItem("chi-tiet", JSON.stringify(product));
        window.location.href = "#chi-tiet";
      };
    });

    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
      btn.onclick = function () {
        const product = JSON.parse(this.getAttribute("data-product"));
        addToCart(product, 0, 1);
      };
    });

    document.querySelectorAll(".btn-buy-now").forEach((btn) => {
      btn.onclick = function () {
        const product = JSON.parse(this.getAttribute("data-product"));
        addToCart(product, 1, 1);
      };
    });
  }, 0);
}
