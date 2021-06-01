var navigationNoJS = document.querySelector(".navigation--no-js");
var toggleButton = document.querySelector(".navigation__toggle");
var navigationMobile = document.querySelector(".navigation");

navigationNoJS.classList.remove("navigation--no-js");

toggleButton.addEventListener ("click", function() {
  navigationMobile.classList.toggle("navigation--opened");
});
