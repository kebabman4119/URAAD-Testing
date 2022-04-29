// When the user scrolls the page, execute myFunction
window.onscroll = function() {headerScroll()};

// Get the navbar
var navbar = document.getElementById("header");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function headerScroll() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

// SIDEBAR

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("about-side-nav").style.width = "100%";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("about-side-nav").style.width = "0";
}