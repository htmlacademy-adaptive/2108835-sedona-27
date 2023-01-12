let navMain = document.querySelector('.main-nav');
let navToggle = document.querySelector('.main-nav__toggle');


themeButton.onclick = function() {
  navMain.classList.toggle('main-nav--closed');
  navMain.classList.toggle('main-nav--opened');
};
