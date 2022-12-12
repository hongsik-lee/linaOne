

let yOffset = 0;
$(document).ready(function() {
    setSwipter();
    getVisualSectionSrcollInfo();

    $('.visual-sec').find('video').get(0).play();
    $('.visual-sec').find('video').get(0).pause();
    $('#contents').css('height', $('.sec-wrap').outerHeight());

    $(window).on('touchmove', getDirection);

    $(window).on('touchstart', function(e) {
        initialX = getClientX(e);
        initialY = getClientY(e);
    });

    $(window).on('mousewheel', function(e) {
        wheelDirection = e.originalEvent.deltaY > 0 ? "top" : "bottom";
    });

    const $secWrap  = $('.sec-wrap > div');
    $secWrap.each(function(index, item) {
        textMotionAnimation(item);
    });

    $(window).on('scroll mousewheel touchmove', optimizeAnimation(function() {
        yOffset = $(window).scrollTop();
        videoSectionScrollAnimation2();

        // if(outerHeight > scrollHeight - scrollY) $slide.scrollTop(scrollHeight - outerHeight);
        // if(yOffset < 0) $('html, body').scrollTop(0);

        $secWrap.each(function(index, elem) {
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

    $(document).on('click', '.goTop', function(e) {
        const $currentScene = $('.sec-wrap').find('.seen-sec').last()
            , index = $currentScene.index()
            , $nextScene = $currentScene.next();

        if($nextScene.length > 0) {
            scrollMovePosition(index + 1);
        }

        if($(e.currentTarget).hasClass('up')) {
            $('html, body').animate({scrollTop : 0 }, 800);
        }
    });

    // 중간 새로고침시 맨 위로
    if(window.pageYOffset > 0) {
        $(window).scrollTop(0);
    }
});

const visualPosInfo = { startY: 0, endY: 0, height: 0, point: 0, };
const getVisualSectionSrcollInfo = () => {
    visualPosInfo.startY = $('.visual-sec').find('.video-wrap').position().top + 7
    visualPosInfo.endY = $('.visual-sec').find('.text-area').position().top;
    visualPosInfo.height = $('.visual-sec').find('.page-tit').innerHeight() / 2 + $('.visual-sec').find('.page-tit').find('span:first-child').innerHeight() / 2;
    visualPosInfo.point = visualPosInfo.startY - (visualPosInfo.endY + visualPosInfo.height);
}

let timer, timer2;
const videoSectionScrollAnimation2 = function() {
    const $contents = $('#contents')
        , $secWrap = $('.sec-wrap')
        , $visualSec = $('.visual-sec');

    if(wheelDirection === 'top' || touchDirection === 'top') {
        if(!timer) {
            timer = setTimeout(() => {
                timer = null;
               
                if($secWrap.hasClass('depth1') && !$secWrap.hasClass('active')) {
                    $(window).scrollTop(1);
    
                    $visualSec.find('.text-area').css({
                        'position': 'absolute',
                        'top': visualPosInfo.endY + 3
                    });
    
                    $visualSec.find('.inner').css({
                        'padding-top': (281 / 360 * 100).toFixed(4) + 'vw'
                    });

                    $('.cut-off.left').css('transform', 'translate3d(-100%, 0px, 0px)');
                    $('.cut-off.right').css('transform', 'translate3d(100%, 0px, 0px)');
                    
                    setTimeout(function() {
                        $secWrap.addClass('depth2');
                    }, 1000);
                }
            }, 800);
        }
    
        if(!timer2) {
            timer2 = setTimeout(() => {
                timer2 = null;
                if($secWrap.hasClass('depth2') && !$secWrap.hasClass('active')) {
                    
                    $secWrap.css({ 
                        'transform': 'translate3d(0, -'+ (279 / 360 * 100) +'vw, 0)',
                    });
                    $secWrap.removeClass('depth1 depth2');
                    $secWrap.addClass('active');
                    $('.visual-sec').find('video').get(0).play();
                }
            }, 800);
        }
    }

    const videoWrapY = $('.video-wrap').get(0).getBoundingClientRect().y;
    if(wheelDirection === 'bottom' || touchDirection === 'bottom') {
        if(videoWrapY > 0 && videoWrapY < 5) {
            $contents.addClass('fixed');
            $secWrap.addClass('depth1 depth2');
            $secWrap.css({ 'transform': 'translate3d(0, 0, 0)' });
            $('.visual-sec').find('video').get(0).pause();
        }

        const isActive = $secWrap.hasClass('active');
        if(isActive && $visualSec.offset().top === 0) {
            $contents.removeClass('fixed');
            $secWrap.removeClass('depth2 active');
            $visualSec.find('.inner').attr('style', '');
            
            $('.cut-off.left').css('transform', 'translate3d(0, 0, 0)');
            $('.cut-off.right').css('transform', 'translate3d(0, 0, 0)');
        }

        if(!isActive && $secWrap.hasClass('depth2')) {
            $secWrap.removeClass('depth2');
            $visualSec.find('.inner').attr('style', '');

            $('.cut-off.left').css('transform', 'translate3d(0, 0, 0)');
            $('.cut-off.right').css('transform', 'translate3d(0, 0, 0)');
        }

        // if($(window).scrollTop() > 0 && $secWrap.hasClass('depth2')) {
        //     $secWrap.removeClass('depth2');
        // }
    }
}

const scrollMovePosition = function(index) {
    let posTop = $('.sec-wrap').children().eq(index).offset().top;
    $('html, body').animate({scrollTop : posTop }, 800);
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
        if(ratio > 0 && 0.7 > ratio) {
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

const changeIndicatorStatus = function() {
    const $currentScene = $('.sec-wrap').find('.seen-sec').last()
        , len = $('.sec-wrap').children().length
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

const setSwipter = function() {
    const $texts = $('.brand-goal-sec').find('.text-area');

    new Swiper(".brand-goal-swiper", {
        slidesPerView: 'auto',
        slidesOffsetAfter: 40,
        speed: 1000,
        simulateTouch: false,
        navigation: {
            nextEl: ".control-next",
            prevEl: ".control-prev",
        },
        on:{
            slideChange() {
                const index = this.activeIndex;
                
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

let initialX, initialY, wheelDirection, touchDirection;
const getDirection = function(e) {
    if (initialX !== null && initialY !== null) {
        const currentX = getClientX(e)
            , currentY = getClientY(e);

        let diffX = initialX - currentX
          , diffY = initialY - currentY;

        if(Math.abs(diffX) > Math.abs(diffY)) {
            if(0 < diffX) {
                touchDirection = 'left';
                $('.scroll-direction').text(touchDirection);
            } else {
                touchDirection = 'right';
                $('.scroll-direction').text(touchDirection);
            }
        } else {
            if(0 < diffY) {
                touchDirection = 'top';
                $('.scroll-direction').text(touchDirection);
            } else {
                touchDirection = 'bottom';
                $('.scroll-direction').text(touchDirection);
            }
        }
    }

    return touchDirection;
}

const getClientX = function(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
};

const getClientY = function(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
};

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