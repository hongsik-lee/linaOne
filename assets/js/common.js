// 아코디언 공통 스크립트
const accor_tit = document.querySelectorAll(".acc_tit_area");
accor_tit.forEach((accorTit) => {
  accorTit.addEventListener("click", () => {
    if (accorTit.classList.contains("active")) {
      accorTit.classList.remove("active");
    } else {
      const accor_active = document.querySelectorAll(".active");
      accor_active.forEach((active) => {
        active.classList.remove("active");
      });
      accorTit.classList.add("active");
    }
  });
});

// scroll top button 공통 스크립트

// Get the button:
var scrollToTopBtn = document.getElementById("goTop");
var rootElement = document.documentElement;



// window.onscroll = function() {scrollToTop()};

function scrollToTop() {


  rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

scrollToTopBtn.addEventListener("click", scrollToTop);