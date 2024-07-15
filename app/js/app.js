// TPX


// const isTouchDevice = 'ontouchstart' in document.documentElement;
const menuBtn = document.querySelector('.header_menu-btn');
menuBtn.addEventListener('click',function(e) {
    e.preventDefault();
    this.classList.toggle('header_menu-btn-open')
});