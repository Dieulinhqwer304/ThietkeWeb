let toastInstance = null;

function initToast() {
  const toastEl = document.getElementById("liveToast");
  if (!toastEl) {
    console.error("Không tìm thấy phần tử #liveToast");
    return;
  }
  toastInstance = bootstrap.Toast.getOrCreateInstance(toastEl);
}

function showToast(title, message, type = 'info') {
  const toastEl = document.getElementById("liveToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastBody = document.getElementById("toastBody");
  const toastTime = document.getElementById("toastTime");
  const toastIcon = document.getElementById("toastIcon");

  if (!toastEl || !toastTitle || !toastBody || !toastTime || !toastIcon) {
    console.error("Thiếu phần tử Toast trong HTML!");
    return;
  }

  const validTypes = ['primary', 'success', 'danger', 'warning', 'info', 'secondary', 'dark', 'light'];

  const typeIcons = {
    success: "fa-circle-check",
    danger: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
    primary: "fa-circle-check",     
    secondary: "fa-circle",
    dark: "fa-moon",
    light: "fa-sun"
  };

  const visualType = type === 'success' ? 'primary' : type;

  toastEl.classList.remove(...validTypes.map(t => `text-bg-${t}`));
  if (validTypes.includes(visualType)) {
    toastEl.classList.add(`text-bg-${visualType}`);
  }

  toastTitle.textContent = title || "Thông báo";
  toastBody.textContent = message || "Đây là nội dung";
  toastTime.textContent = new Date().toLocaleTimeString();

  toastIcon.className = `fa-solid ${typeIcons[visualType] || "fa-circle-info"} me-2`;

  if (!toastInstance) initToast();
  toastInstance?.show();
}
