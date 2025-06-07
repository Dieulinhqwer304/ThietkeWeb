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
      <div class="list-group-item cart-item d-flex justify-content-between align-items-center p-3 mb-3">
        <div class="d-flex align-items-center gap-3">
          <img src="../assets/${item.folder}/${item.image}" alt="${item.name}"
            class="img-fluid rounded" style="width: 80px; height: 80px; object-fit: cover;">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <p class="mb-0">Giá: <strong>${total.toLocaleString()}₫</strong></p>
          </div>
        </div>
        <div class="d-flex align-items-center gap-3">
          <input type="number" class="form-control form-control-sm w-50px quantity-input"
            data-index="${index}" value="${item.quantity}" min="1" />
          <button class="btn btn-sm btn-outline-danger btn-remove" data-index="${index}">
            <i class="bi bi-trash"></i>
          </button>
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

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const paymentUrl = createVnpayUrl(total);
      window.location.href = paymentUrl;
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
  const vnp_Returnurl = window.location.origin + "/#sauthanhtoan"; 
  const vnp_TxnRef = new Date()
    .toISOString()
    .replace(/[-:TZ\.]/g, "")
    .slice(0, 14); // YmdHis
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
