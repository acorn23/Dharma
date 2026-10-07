(function () {
  const homeLink = document.querySelector(
    '.md-tabs__item--active a[href="."]'
  );

  if (homeLink) {
    document.body.classList.add("homepage");
  }
})();
