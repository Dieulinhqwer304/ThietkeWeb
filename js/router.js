import { loadImage } from "./boardgame.js";
import { renderCart } from "./cart.js";
import { renderDetail } from "./chi-tiet.js";
import { loadHome } from "./home.js";

export const routes = {
  home: {
    title: "Trang chủ",
    file: "pages/home.html",
    function: loadHome,
  },
  introduction: {
    title: "Giới thiệu",
    file: "pages/introduction.html",
  },
  contact: {
    title: "Liên hệ",
    file: "pages/contact.html",
  },
  cart: {
    title: "Giỏ hàng",
    file: "pages/cart.html",
    function: renderCart,
  },
  boardgame: {
    title: "Game Gia Đình",
    file: "pages/boardgame.html",
    function: loadImage,
  },
  "boardgame/game-gia-dinh.html": {
    title: "Game Gia Đình",
    file: "pages/boardgame.html",
    function: loadImage,
  },
  "boardgame/game-nhap-khau.html": {
    title: "Game Nhập Khẩu",
    file: "pages/boardgame.html",
    function: loadImage,
  },
  "boardgame/game-hot.html": {
    title: "Game Hot",
    file: "pages/boardgame.html",
    function: loadImage,
  },
  "boardgame/game-thoi-dai.html": {
    title: "Game Thời Đại",
    file: "pages/boardgame.html",
    function: loadImage,
  },
  "chi-tiet": {
    title: "Nối từ không",
    file: "pages/chi-tiet.html",
    function: renderDetail,
  },
  sauthanhtoan: {
    title: "Sau thanh toán",
    file: "pages/after-payment.html",
  },
};
