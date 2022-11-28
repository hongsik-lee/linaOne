window.addEventListener("DOMContentLoaded", function () {
    subPageVisualAnimation();

    // 컨텐츠 scroll 공통 효과
    AOS.init({
        easing: 'linear',
        duration:500
    });

    onElementHeightChange(document.body, function(){
        AOS.refresh();
    });

    // tab
    const $parentTabs = $('[data-tab-target]');
    $parentTabs.each(function(index, item) {
        $(item).on('click' , function(e) {
            handleParentTabClick(e);
        });
    });

    const $childTabs = $('[data-sub-target]');
    $childTabs.each(function(index, item) {
        $(item).on('click' , function(e) {
            handleChildTabClick(e);
        });
    });

    // accordion
    const $accTitArea = $('.acc_tit_area');
    $accTitArea.each(function(index, item) {
        $(item).on('click', function(e) {
            handleAccTitAreaClick(e);
        })
    });

    //  scroll top button 공통 스크립트
    $(document).on('click', '#goTop', () => {
        document.body.scrollIntoView({
            behavior: "smooth"
        });
    });
});

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

const onElementHeightChange = function(elm, callback) {
    let lastHeight = elm.clientHeight
    let newHeight;
    
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
const handleAccTitAreaClick = function(item) {
    const $target = $(item)
        , $accorActive = $('.acc-active');
    
    if($target.hasClass('acc-active')) {
        $target.removeClass('acc-active')
    } else {
        $accorActive.each(function(index, item) {
            $(item).removeClass('acc-active');
        });
        $target.addClass('acc-active')
    }
}

// 탭 공통 스크립트
const handleParentTabClick = function(e) {
    e.preventDefault();
    const $target = $(e.target)
        , dataTabTarget = $target.data('tab-target')
        , $tab = $(dataTabTarget)
        , $tabContents = $('[data-tab-content]');

    for(let i = 0; i < $tabContents.length; i++) {
        let $tabContent = $($tabContents[i]);
        $tabContent.removeClass('active');
    }

    $target.closest('li').siblings().children('a').removeClass('active');
    $target.addClass('active');
    $tab.addClass('active');
}

const handleChildTabClick = function(e) {
    e.preventDefault();
    const $target = $(e.target)
        , dataSubTabTarget = $target.data('sub-target')
        , $subTab = $(dataSubTabTarget)
        , $subTabContents = $('[data-sub-content]');

    for(let i = 0; i < $subTabContents.length; i++) {
        let $subTabContent = $($subTabContents[i]);
        $subTabContent.removeClass('active');
    }

    $target.closest('li').siblings().children('a').removeClass('active');
    $target.addClass('active');
    $subTab.addClass('active');
}

// 서브페이지 비쥬얼 에니메이션
const subPageVisualAnimation = function() {
    const $subWarp = $('.sub_wrap')
        , $titleAnim = $('.page-tit-line')
        , $visualBgAnim = $('.visual-sec');

    if($subWarp.length > 0) {
        $titleAnim.each((index, item) => {
            const $target = $(item);
    
            if(!$target.hasClass('active')) {
                $target.addClass('active')
            }
        });
    
        $visualBgAnim.each((index, item) => {
            const $target = $(item);
    
            if(!$target.hasClass('active')) {
                $target.addClass('active')
            }
        });
    }
}

// OVERVIEW 숫자 카운팅 에니메이션
const increaseNumberAnimation = function(elem, duration) {
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

const setNumberComma = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// window popup
const openPopup = function(url, w, h) {
    var screenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var screenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + screenLeft;
    var top = ((height / 2) - (h / 2)) + screenTop;

    window.open(url, '', 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}