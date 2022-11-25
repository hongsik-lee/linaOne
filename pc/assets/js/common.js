
// 컨텐츠 scroll 공통 효과
$(function(){
    AOS.init({
        easing: 'ease-in-out-sine'
      });

    onElementHeightChange(document.body, function(){
        AOS.refresh();
      });
})

function onElementHeightChange(elm, callback) {
    var lastHeight = elm.clientHeight
    var newHeight;
    
    (function run() {
        newHeight = elm.clientHeight;
        if (lastHeight !== newHeight) callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer) {
          clearTimeout(elm.onElementHeightChangeTimer); 
        }

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

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

window.addEventListener("DOMContentLoaded", function () {
    subPageVisualAnimation();

    // Tab Content 
    const parentTabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    const childTabs = document.querySelectorAll('[data-sub-target]');
    const subContents = document.querySelectorAll('[data-sub-content]');

    $('[data-tab-target]').each((index , tab) => {
        $(tab).on('click', (e) => {
            e.preventDefault();

            let target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active')
            });
            parentTabs.forEach(tab => {
                tab.classList.remove('active')
            });
            target.classList.add('active')
            tab.classList.add('active')
        })
    });

    $('[data-sub-target]').each((index , tab) => {
        $(tab).on('click', (e) => {
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
        })
    });

    //  scroll top button 공통 스크립트
    $(document).on('click', '#goTop', () => {
        document.body.scrollIntoView({
            behavior: "smooth"
        });
    });
});

// 서브페이지 비쥬얼 글자 에니메이션
const subPageVisualAnimation = () => {
    const $subWarp = $('.sub_wrap')
        , $titleAnim = $('.page-tit-line')
        , $visualBgAnim = $('.visual-sec');

    if($subWarp.length > 0) {
        $titleAnim.each((index, item) => {
            const $target = $(item);
    
            if(!$target.hasClass('active')) {
                $target.addClass('active')
            }
        })
    
        $visualBgAnim.each((index, item) => {
            const $target = $(item);
    
            if(!$target.hasClass('active')) {
                $target.addClass('active')
            }
        });
    }
}

$(window).scroll(function () {
    const $counter = $("#counter");

    if($counter.length > 0) {
        const oTop = $("#counter").offset().top - window.innerHeight;

        if ($(window).scrollTop() > oTop) {
            const $countNum = $('.count-num');
            
            $countNum.each((index, elem) => {
                if(!$(elem).hasClass('count-finished')) {
                    increaseNumberAnimation(elem, 1000);
                }
            });
        }
    }
});

// OVERVIEW 숫자 카운팅 에니메이션
const increaseNumberAnimation = (elem, duration) => {
    let startTimeStamp;
    const $target = $(elem)
        , start = $target.data('start-count')
        , end = $target.data('end-count')
        , type = $target.data('type')

    $target.addClass('count-finished');
    const step = (timestamp) => {
        if (!startTimeStamp) startTimeStamp = timestamp;
        const progress = Math.min((timestamp - startTimeStamp) / duration);
        let value;

        if(type === 'reverse') {
            value = Math.floor(progress * (end - start) + start);

            if(value > end) $target.text(setNumberComma(value));
            else $target.text(setNumberComma(end));
        } else {
            value = Math.floor(progress * (end - start) + start);
            
            if(value > end) $target.text(setNumberComma(end));
            else $target.text(setNumberComma(value));
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
};

const setNumberComma = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// popup
const openPopup = (url, w, h) => {
    var screenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var screenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + screenLeft;
    var top = ((height / 2) - (h / 2)) + screenTop;

    window.open(url, '', 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}