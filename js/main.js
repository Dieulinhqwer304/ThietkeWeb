import { routes } from "./router.js";
import { loadImage } from "./image.js";
async function loadComponent(selector, url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
    loadImage();

    // Khởi tạo lại Owl Carousel nếu là trang home
    if (url.includes("home.html") && typeof $ !== "undefined") {
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
      }, 0);
    }
  } catch {
    document.querySelector(selector).innerHTML =
      "<p>Không thể tải nội dung.</p>";
  }
}

async function loadPage() {
  const path = window.location.hash.substring(1) || "home";
  const route = routes[path];

  if (!route) {
    document.title = "Không tìm thấy trang";
    loadComponent("#content", "pages/404.html");
    updateActiveNav();
    return;
  }

  document.title = route.title;

  if (route.file) {
    loadComponent("#content", route.file);
  } else {
    document.querySelector("#content").innerHTML = route.content;
  }

  updateActiveNav();
}

function updateActiveNav() {
  const currentPath = window.location.hash;

  document
    .querySelectorAll(".nav-link, .dropdown-content a")
    .forEach((link) => {
      link.classList.remove("active");
    });

  document
    .querySelectorAll(".nav-link, .dropdown-content a")
    .forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
      }
    });
  if (currentPath.startsWith("#boardgame/")) {
    const boardgameLink = document.querySelector(
      '.nav-link[href="#boardgame"]'
    );
    if (boardgameLink) boardgameLink.classList.add("active");
  }

  if (!currentPath || currentPath === "#home" || currentPath === "#") {
    const homeLink = document.querySelector('.nav-link[href="./index.html"]');
    if (homeLink) homeLink.classList.add("active");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (/\/index\.html$/i.test(location.pathname)) {
    const cleanPath = location.pathname.replace(/\/index\.html$/i, "/");
    history.replaceState({}, "", cleanPath);
  }
  loadComponent("#header", "../components/header.html");
  loadComponent("#footer", "../components/footer.html");

  loadPage();
});

window.addEventListener("hashchange", loadPage);
