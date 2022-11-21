// 컨텐츠 scroll 공통 효과
AOS.init({
  easing: 'ease-in-out-sine'
});

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
const showOnPx = 100;
const goTop = document.querySelector("#goTop");

const scrollContainer = () => {
  return document.documentElement || document.body;
};

const goToTop = () => {
  document.body.scrollIntoView({
    behavior: "smooth"
  });
};
document.addEventListener("scroll", () => {
  // console.log("Scroll Height: ", scrollContainer().scrollHeight);
  // console.log("Client Height: ", scrollContainer().clientHeight);

  const scrolledPercentage =
    (scrollContainer().scrollTop / (scrollContainer().scrollHeight - scrollContainer().clientHeight)) * 100;

  if (scrollContainer().scrollTop > showOnPx) {
    goTop.classList.remove("hidden");
  } else {
    goTop.classList.add("hidden");
  }
});

goTop.addEventListener("click", goToTop);
