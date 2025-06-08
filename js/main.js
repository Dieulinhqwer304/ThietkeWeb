import { routes } from "./router.js";
import { loadCartCount } from "./cart.js";

function loadHTML(id, file, route = null) {
  fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error("Không tìm thấy file: " + file);
      return response.text();
    })
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (route && typeof route.function === "function") {
        route.function();
      }
      loadCartCount();
      checkLogin();
    })
    .catch((err) => {
      console.error(err);
    });
}

async function loadPage() {
  let path = window.location.hash.substring(1) || "home";
  if (path.includes("sauthanhtoan")) {
    const url = new URL(window.location.href.replace("#", ""));
    const responseCode = url.searchParams.get("vnp_ResponseCode");
    if (responseCode) {
      if (responseCode === "00") {
        localStorage.removeItem("cart");
        path = "sauthanhtoan"
      } else {
        window.location.href = "#cart";
        return;
      }
    }
  }

  const route = routes[path];

  if (!route) {
    document.title = "Không tìm thấy trang";
    loadHTML("content", "pages/404.html");
    updateActiveNav();
    return;
  }

  document.title = route.title;

  if (route.file) {
    loadHTML("content", route.file, route);
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

function checkLogin() {
  const loginBtn = document.getElementById("login-btn");
  const loginBtnText = document.getElementById("login-btn-text");
  const isLogin = localStorage.getItem("isLogin") === "true";

  if (isLogin) {
    const userEmail = localStorage.getItem("userEmail") || "";
    const username = userEmail.split("@")[0];

    loginBtnText.innerText = `Đăng xuất (${username})`;

    loginBtn.onclick = function (e) {
      e.preventDefault();
      Swal.fire({
        title: "Đăng xuất?",
        text: "Bạn có chắc chắn muốn đăng xuất không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đăng xuất",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("isLogin");
          localStorage.removeItem("userEmail");
          window.location.href = "/";
        }
      });
    };
  } else {
    loginBtnText.innerText = "Đăng nhập";
    loginBtn.href = "./pages/login.html";
    loginBtn.onclick = null; // Bỏ sự kiện đăng xuất nếu có
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (/\/index\.html$/i.test(location.pathname)) {
    const cleanPath = location.pathname.replace(/\/index\.html$/i, "/");
    history.replaceState({}, "", cleanPath);
  }
  loadHTML("header", "components/header.html");
  loadHTML("footer", "components/footer.html");

  loadPage();
});

window.addEventListener("hashchange", loadPage);
