let swiper;
let yOffset = 0;
$(document).ready(() => {
    $('.visual-sec').find('video').get(0).play();
    $('.visual-sec').find('video').get(0).pause();
    
    setSwipter();
    setSectionFixed();
    getVisualSectionSrcollInfo();

    $('#contents > div').each(function(index, item) {
        textMotionAnimation(item);
    });

    $(document).on('click', '.indicator-group', function(e) {
        const $target = $(e.target)
            , index = $target.index()       
            , nodeName = e.target.nodeName
            , $contents = $('#contents').children();
        
        if(nodeName === 'BUTTON') {
            scrollMovePosition(index)
        }
    });

    $(document).on('click', '.goTop', function(e) {
        const $currentScene = $('#contents').find('.seen-sec').last()
            , index = $currentScene.index()
            , $nextScene = $currentScene.next();

        if($nextScene.length > 0) {
            scrollMovePosition(index + 1);
        }

        if($(e.currentTarget).hasClass('up')) {
            $('html, body').animate({scrollTop : 0 }, 800);
        }
    });

    const $contents  = $('#contents > div');
    $(window).on('scroll', optimizeAnimation(function() {
        yOffset = $(window).scrollTop();
    
        videoSectionScrollAnimation();
        foundation01SectionAnimation();
        foundation02SectionAnimation();
        foundation03SectionAnimation();
        foundation04SectionAnimation();
        bhrQuoteSectionAnimation();

        $contents.each(function(index, elem) {
            const $target = $(elem)
                , ratio = getElemScrollRatio($target);

            if (isElemOverScreen(elem, -20)) {
                $target.removeClass('seen-sec');
            } else {
                if(1 - ratio > 0.2) $target.addClass('seen-sec');
                if(1 - ratio < 0.4) $target.removeClass('seen-sec');
            }

            textMotionAnimation(elem);
        });

        changeIndicatorStatus();
    }));

    // 중간 새로고침시 1픽셀 움직이기
    if(window.pageYOffset > 0) {
        window.scrollTo(0, window.pageYOffset + 1);
    }
});

var delay = 300;
var timer = null;   
$(window).on('resize', function(){
    clearTimeout(timer);
    timer = setTimeout(function(){
        getVisualSectionSrcollInfo();
        console.log('resize is well done')
    }, delay);
});

const scrollMovePosition = function(index) {
    const $contents = $('#contents');

    let posTop = 0;
    if(index === 4) {
        posTop = $('#contents').children().eq(index).offset().top + $('#contents').children().eq(index).innerHeight() / 4.7
    } else if(index === 6) {
        posTop = $('#contents').children().eq(index).offset().top + $('#contents').children().eq(index).innerHeight() / 4.1
    } else {
        posTop = $('#contents').children().eq(index).offset().top;
    }
    
    $('html, body').animate({scrollTop : posTop }, 800);
}

const changeIndicatorStatus = function() {
    const $currentScene = $('#contents').find('.seen-sec').last()
        , len = $('#contents').children().length
        , index = $currentScene.index()
        , $indicator = $('.indicator-group')
        , ratio = getElemScrollRatio($currentScene)
        , $goTop = $('.goTop');

    if(1 - ratio > 0.2) {
        $indicator.children().eq(index).addClass('active').siblings().removeClass('active');
    }

    if(index + 1 === len) {
        $goTop.addClass('up');
        $goTop.find('em').text('맨 위로 이동');
    } else {
        if($goTop.hasClass('up')) {
            $goTop.removeClass('up');
            $goTop.find('em').text('다음 section 이동');
        }
    }
}

const visualPosInfo = { startY: 0, endY: 0, height: 0, point: 0, };
const getVisualSectionSrcollInfo = () => {
    visualPosInfo.startY = $('.visual-sec').find('.video-wrap').position().top + 5
    visualPosInfo.endY = $('.visual-sec').find('.text-area').position().top;
    visualPosInfo.height = $('.visual-sec').find('.page-tit').innerHeight() / 2 + $('.visual-sec').find('.page-tit').find('span:first-child').innerHeight() / 2;
    visualPosInfo.point = visualPosInfo.startY - (visualPosInfo.endY + visualPosInfo.height);
}

const videoSectionScrollAnimation = function() {
    const textY = visualPosInfo.endY + visualPosInfo.height
        , videoY = $('.visual-sec').find('.video-wrap').get(0).getBoundingClientRect().y + 5
        , diff = videoY - textY
        , diffRatio = diff / visualPosInfo.point * 100

    if(diff > 0) {
        $('.visual-sec').find('video').get(0).pause();
        $('.visual-sec').find('.text-area').css({
            'position': 'fixed',
            'top': visualPosInfo.endY
        });
        $('.cut-off.left').css('transform', 'translate3d(-'+ (100 - diffRatio) +'%, 0px, 0px)');
        $('.cut-off.right').css('transform', 'translate3d('+ (100 - diffRatio) +'%, 0px, 0px)');
    }
    
    if(diff < 0) {
        $('.cut-off.left').css('transform', 'translate3d(-100%, 0px, 0px)');
        $('.cut-off.right').css('transform', 'translate3d(100%, 0px, 0px)');
        $('.visual-sec').find('video').get(0).play();
        $('.visual-sec').find('.text-area').css({
            'position': 'absolute',
            'top': visualPosInfo.startY - $('.visual-sec').find('.page-tit').innerHeight() / 2 - $('.visual-sec').find('.page-tit').find('span:first-child').innerHeight() / 2
        });
    }
}

const foundation01SectionAnimation = function() {
    const $target = $('.foundation01-sec')
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);

    if(!isScreen) {
        if(ratio > 0 && 1 - ratio > 0.3) {
            $target.find('.img-wrap').addClass('activeMotion');
            $target.find('.circle02').addClass('activeMotion');
            $target.find('.line').addClass('activeMotion');
        }
        
        if(ratio < -0.2) {
            sectionFixedAnimation();
        }
    } else {
        $target.find('.img-wrap').removeClass('activeMotion');
        $target.find('.circle02').removeClass('activeMotion');
        $target.find('.line').removeClass('activeMotion');
    }
}

const foundation02SectionAnimation = function() {
    const $target = $('.foundation02-sec')
        , $bg = $target.find('.bg')
        , splitValue = 3.33
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);
        
    if(!isScreen) {
        if(ratio > 0) {
            $target.css("transform",  'scale('+ (1 - ratio / splitValue) +')');
        } else {
            isFixedAni = false;
            $('.foundation01-sec').css({
                'position': 'relative',
                'top': 'auto'
            })
            $target.css("transform",  'scale(1)');
        }
        if(ratio < 0 && ratio > -1.5) {
            let scaleValue = 1 + Math.abs(ratio) / 5
            $bg.css({
                'transform': 'scale('+ scaleValue +')'
            });
        }
    } else {
        if(ratio > 1) {
            currentFixedY = '';
            isFixedAni = false;
            $('.foundation01-sec').css({
                'position': 'relative',
                'top': 'auto'
            })
        }
    }
}

const foundation03SectionAnimation = function() {
    const $target = $('.foundation03-sec')
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);

    if(!isScreen) {
        if(ratio > 0 && 1 - ratio > 0.5) {
            $target.addClass('activeMotion');
            $target.find('.img').addClass('activeMotion');
            $target.find('.circle').addClass('activeMotion');
        }
    } else {
        $target.removeClass('activeMotion');
        $target.find('.img').removeClass('activeMotion');
        $target.find('.circle').removeClass('activeMotion');
    }
} 

const foundation04SectionAnimation = function() {
    const $target = $('.foundation04-sec')
        , $bg = $target.find('.bg')
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);
        
    if(!isScreen) {
        if(ratio > 0 && 1 - ratio > 0.4) {
            $bg.addClass('activeMotion');
        }
        if($bg.hasClass('activeMotion') && ratio < 0 && ratio > -1.5) {
            let scaleValue = 1 + Math.abs(ratio) / 5
            $bg.css({
                'transform': 'scale('+ scaleValue +')'
            });
        }
    } else {
        $bg.css('transform', '')
        $bg.removeClass('activeMotion');
    }
}

let isFixedAni = false, currentFixedY;
const sectionFixedAnimation = function() {
    if(!isFixedAni) {
        const fixedY = $('.foundation01-sec').get(0).getBoundingClientRect().y + 'px'
        $('.foundation01-sec').css({
            'position': 'fixed',
            'top': currentFixedY || fixedY
        });

        currentFixedY = currentFixedY || fixedY;
        isFixedAni = true;
    }
}

const setSectionFixed = function() {
    const $fixedSec = $('.fixed-sec')
        , $child = $fixedSec.children()
        , childStyle = window.getComputedStyle($child.get(0));

    $fixedSec.css({
        'display': 'block',
        'width': (1903 / 1920 * 100).toFixed(4) + 'vw',
        // 'height': (1182 / 1920 * 100).toFixed(4) + 'vw',
        'height': (1400 / 1920 * 100).toFixed(4) + 'vw',
        // 'margin': childStyle.margin,
        'padding': 0,
        'box-sizing': 'border-box'
    });

    $child.css({
        'width':  (1903 / 1920 * 100).toFixed(4) + 'vw',
        'min-width':  (1903 / 1920 * 100).toFixed(4) + 'vw',
        'height': (1182 / 1920 * 100).toFixed(4) + 'vw',
        'min-height': (1182 / 1920 * 100).toFixed(4) + 'vw',
        'margin': 0,
        'padding-bottom': (167 / 1920 * 100).toFixed(4) + 'vw',
        'transform:': 'translate(0px, 0px)'
    });
}

const bhrQuoteSectionAnimation = function() {
    const $target = $('.bhr-quote-sec')
        , $bg = $target.find('.bg')
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target)
    
    if(!isScreen) {
        if(ratio > 0) {
            let scaleValue = 1 + (1 - ratio) / 3;
            $bg.css('transform', 'scale('+ scaleValue +')');
        }
    }
}

const textMotionAnimation = function(item) {
    const $target = $(item)
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);

    if(!isScreen) {
        if($target.hasClass('visual-sec')) {
            $target.find('.page-tit').addClass('activeMotion');
            $target.find('.text-area > span').addClass('activeMotion');
        };
        if(ratio > 0 && 0.5 > ratio) {
            $target.find('.page-tit').addClass('activeMotion');
            $target.find('.tit').addClass('activeMotion');
            $target.find('.desc').addClass('activeMotion');
        }
    } else {
        $target.find('.page-tit').removeClass('activeMotion');
        $target.find('.tit').removeClass('activeMotion');
        $target.find('.desc').removeClass('activeMotion');
    }
}

const getElemScrollRatio = function(elem) {
    const top = $(elem).get(0).getBoundingClientRect().top
        , { innerHeight } = window;

    return top / innerHeight;
}

const isElemOverScreen = function(elem, triggerDiff) {
    const top = $(elem).get(0).getBoundingClientRect().top
        , { innerHeight } = window;

    return top > innerHeight + (triggerDiff || 0);
}

const setSwipter = function() {
    const $texts = $('.brand-goal-sec').find('.text-area');

    swiper = new Swiper(".brand-goal-swiper", {
        slidesPerView: 'auto',
        slidesOffsetAfter: 600,
        breakpoints: {
            1921: { slidesPerView: 2 }
        },
        speed: 800,
        simulateTouch: false,
        navigation: {
            nextEl: ".control-next",
            prevEl: ".control-prev",
        },
        on:{
            slideChange() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index]);

                $texts.children().eq(index).addClass('active').siblings().removeClass('active');
                $('.current-index').html(index + 1);

                if(index == 1) {
                    $('.control-next').addClass('disabled');
                } else {
                    $('.control-next').removeClass('disabled');
                }
            },
        }
    });
}

const optimizeAnimation = function(cb) {
    let ticking = false;

    return function() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(function() {
                cb();

                ticking = false;
            });
        }
    }
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

function openTmr(){
    window.open('https://www.lina.co.kr/tmr/main/main.htm', 'TMR | 라이나생명', 'width=1100px, height=992px, scrollbars=yes');
}