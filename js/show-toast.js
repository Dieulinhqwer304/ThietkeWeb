export function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message position-fixed top-0 end-0 m-4 bg-success text-white px-4 py-2 rounded-3 shadow";
  toast.style.zIndex = "9999";
  toast.innerHTML = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 2000);
}