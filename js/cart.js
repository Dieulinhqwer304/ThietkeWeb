export function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const thanhToan = document.getElementById("thanh-toan");
  const gioHang = document.getElementById("gio-hang");
  const cartList = gioHang.querySelector(".list-group");
  const summaryBox = thanhToan?.querySelector(".summary-box");
  if (!cartList || !summaryBox) return;

  if (cartItems.length === 0) {
    thanhToan.remove();
    gioHang.classList.remove("col-lg-8");
    cartList.innerHTML = `<p class="text-center text-muted">Không có sản phẩm trong giỏ hàng.</p>`;
    return;
  }

  let subtotal = 0;
  cartList.innerHTML = "";

  cartItems.forEach((item, index) => {
    const price = item.price || 0;
    const total = price * item.quantity;
    subtotal += total;
    const productHTML = `
  <div class="list-group-item cart-item p-3 mb-3 border rounded shadow-sm">
    <div class="d-flex justify-content-between align-items-center flex-wrap">
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <a href="#chi-tiet"
           class="d-flex align-items-center gap-3 text-decoration-none text-dark product-link"
           data-item='${JSON.stringify(item)}'>
          <img src="assets/${item.folder}/${item.image}" alt="${item.name}"
            class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
          <div>
            <h6 class="mb-1 fw-semibold" style="font-size: 18px;">${
              item.name
            }</h6>
            <p class="mb-0 text-muted">Giá: <strong class="text-danger">${total.toLocaleString()}₫</strong></p>
          </div>
        </a>
      </div>
      <div class="d-flex align-items-center gap-2 mt-2 mt-md-0">
        <input type="number" class="form-control form-control-sm quantity-input text-center"
          style="width: 70px;" data-index="${index}" value="${
      item.quantity
    }" min="1" />
        <button class="btn btn-sm btn-outline-danger btn-remove" data-index="${index}" title="Xóa sản phẩm">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
`;
    cartList.insertAdjacentHTML("beforeend", productHTML);
  });

  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  summaryBox.innerHTML = `
    <h5 class="fw-bold mb-3">Tổng thanh toán</h5>
    <div class="d-flex justify-content-between">
      <span>Tạm tính:</span>
      <span>${subtotal.toLocaleString()}₫</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <span>Phí vận chuyển:</span>
      <span>${shippingFee.toLocaleString()}₫</span>
    </div>
    <hr />
    <div class="d-flex justify-content-between fw-bold fs-5">
      <span>Tổng:</span>
      <span class="text-danger">${total.toLocaleString()}₫</span>
    </div>
    <button class="btn btn-danger w-100 mt-4 checkout-btn" id="checkout-btn">
      <i class="bi bi-credit-card me-2"></i>Thanh toán ngay
    </button>
  `;

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = parseInt(e.target.dataset.index);
      const newQuantity = parseInt(e.target.value) || 1;
      cartItems[index].quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cartItems));
      renderCart();
      loadCartCount();
    });
  });

  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      cartItems.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      renderCart();
      loadCartCount();
    });
  });

  document.querySelectorAll(".product-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const itemData = this.getAttribute("data-item");
      localStorage.setItem("chi-tiet", itemData);
    });
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  const isLogin = localStorage.getItem("isLogin") === "true";
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!isLogin) {
        Swal.fire({
          icon: "error",
          title: "Thanh toán thất bại",
          text: "Vui lòng đăng nhập để thanh toán!",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đăng nhập",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "pages/login.html";
          }
        });
      } else {
        const paymentUrl = createVnpayUrl(total);
        window.location.href = paymentUrl;
      }
    });
  }
}

export function loadCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    cartCount.innerHTML = totalQuantity;
  }
}

function createVnpayUrl(tongtien) {
  const vnp_TmnCode = "GHHNT2HB";
  const vnp_HashSecret = "BAGAOHAPRHKQZASKQZASVPRSAKPXNYXS";
  const vnp_Url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnp_Returnurl = window.location.href.split("#")[0] + "#sauthanhtoan";
  localStorage.setItem(
    "vnp_Returnurl",
    window.location.origin + window.location.pathname + "#sauthanhtoan"
  );
  localStorage.setItem("vnp_Returnurl2", vnp_Returnurl);

  const vnp_TxnRef = new Date()
    .toISOString()
    .replace(/[-:TZ\.]/g, "")
    .slice(0, 14);
  const vnp_OrderInfo = "Thanh toán hóa đơn phí dịch vụ";
  const vnp_OrderType = "billpayment";
  const vnp_Locale = "vn";
  const vnp_IpAddr = "127.0.0.1";

  let inputData = {
    vnp_Version: "2.0.0",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: tongtien * 100,
    vnp_Command: "pay",
    vnp_CreateDate: vnp_TxnRef,
    vnp_CurrCode: "VND",
    vnp_IpAddr: vnp_IpAddr,
    vnp_Locale: vnp_Locale,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_OrderType: vnp_OrderType,
    vnp_ReturnUrl: vnp_Returnurl,
    vnp_TxnRef: vnp_TxnRef,
  };

  let sortedKeys = Object.keys(inputData).sort();

  let hashData = "";
  let query = "";

  sortedKeys.forEach((key, index) => {
    if (
      inputData[key] !== null &&
      inputData[key] !== undefined &&
      inputData[key] !== ""
    ) {
      if (index > 0) {
        hashData += "&";
        query += "&";
      }
      hashData += key + "=" + inputData[key];
      query +=
        encodeURIComponent(key) + "=" + encodeURIComponent(inputData[key]);
    }
  });

  const vnpSecureHash = sha256(vnp_HashSecret + hashData);

  query += "&vnp_SecureHashType=SHA256&vnp_SecureHash=" + vnpSecureHash;

  return vnp_Url + "?" + query;
}
