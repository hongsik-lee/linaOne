
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
}

goTop.addEventListener("click", goToTop);

// 서브페이지 비쥬얼 글자 에니메이션
window.addEventListener("DOMContentLoaded", function () {
    const titleAnim = document.querySelectorAll(".page-tit-line");
    const visualBgAnim = document.querySelectorAll(".visual-sec");

    titleAnim.forEach((e) => {
        if (e.classList.contains("active")) {
            console.log("d");
        } else {
            e.classList.add("active");
        }
    });

    visualBgAnim.forEach((e) => {
        if (e.classList.contains("active")) {

        } else {
            e.classList.add("active");
        }
    });
});

// OVERVIEW 숫자 카운팅
$(window).scroll(function () {
    const oTop = $("#counter").offset().top - window.innerHeight;
    if ($(window).scrollTop() > oTop) {
        const $countNum = $('.count-num');
        
        $countNum.each((index, elem) => {
            if(!$(elem).hasClass('count-finished')) {
                increaseNumberAnimation(elem, 1000);
            }
        });
    }
});


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
    });
});

childTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();

        let target = document.querySelector(tab.dataset.subTarget);
        subContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        });
        childTabs.forEach(tab => {
            tab.classList.remove('active')
        });
        target.classList.add('active')
        tab.classList.add('active')
    });
});