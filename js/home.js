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
  }, 0);
}
