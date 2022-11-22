
// 컨텐츠 scroll 공통 효과
AOS.init({
  easing: 'ease-in-out-sine'
});

// 아코디언 공통 스크립트
const accor_tit = document.querySelectorAll(".acc_tit_area");
accor_tit.forEach((accorTit) => {
  accorTit.addEventListener("click", () => {
    if (accorTit.classList.contains("acc-active")) {
      accorTit.classList.remove("acc-active");
    } else {
      const accor_active = document.querySelectorAll(".acc-active");
      accor_active.forEach((active) => {
        active.classList.remove("acc-active");
      });
      accorTit.classList.add("acc-active");
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


// 서브페이지 비쥬얼 글자 에니메이션
window.addEventListener('DOMContentLoaded', function(){
  const titleAnim = document.querySelectorAll(".page-tit-line");
  titleAnim.forEach((e) => {
    if(e.classList.contains("active")){
      console.log("d")
    }else{
      e.classList.add("active")
    }
  })
});
// OVERVIEW 숫자 카운팅
/*
var counted = 0;
$(window).scroll(function() {

  var oTop = $('#counter').offset().top - window.innerHeight;
  if (counted == 0 && $(window).scrollTop() > oTop) {
    $('.count-num').each(function() {
      var $this = $(this),
        countTo = $this.attr('data-count');
      $({
        countNum: $this.text()
      }).animate({
          countNum: countTo
        },
        {
          duration: 2000,
          easing: 'swing',
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
          }

        });
    });
    counted = 1;
  }

});
 */

// Tab Content 
const parentTabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')


const childTabs = document.querySelectorAll('[data-sub-target]')
const subContents = document.querySelectorAll('[data-sub-content]')

parentTabs.forEach(tab => {
tab.addEventListener('click', (e) => {
    e.preventDefault();

    let target = document.querySelector(tab.dataset.tabTarget)

    tabContents.forEach(tabContent => {
    tabContent.classList.remove('active')
    });
    parentTabs.forEach(tab => {
    tab.classList.remove('active')
    });
    target.classList.add('active')
    tab.classList.add('active')
    })
})

childTabs.forEach(tab => {
tab.addEventListener('click', (e) => {
    e.preventDefault();

    let target = document.querySelector(tab.dataset.subTarget)
    console.log(target);
    subContents.forEach(tabContent => {
        tabContent.classList.remove('active')
    });
    childTabs.forEach(tab => {
    tab.classList.remove('active')
    });
    target.classList.add('active')
    tab.classList.add('active')
    })
})