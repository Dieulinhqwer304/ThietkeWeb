// Load header từ file riêng
document.addEventListener("DOMContentLoaded", function () {
    fetch("components/header.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("header-placeholder").innerHTML = data;
      });
  });
  