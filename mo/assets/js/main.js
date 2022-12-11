// mobile
let swiper, timer, timer2;
let initialX, initialY, wheelDirection, touchDirection;

$(document).ready(function() {
    $('.visual-sec').find('video').get(0).play();
    setSwiper();
    setSwipter2();
    getVisualSectionSrcollInfo();
    swiperWheelControl.turnOff();
    
    $(window).on('touchmove', getDirection);

    $(window).on('touchstart', function(e) {
        initialX = getClientX(e);
        initialY = getClientY(e);
    });
    
    $(window).on('mousewheel', function(e) {
        wheelDirection = e.originalEvent.deltaY > 0 ? "top" : "bottom";
    });

    $(document).on('click', '.swiper-next-btn', function(e) {
        const index = swiper.activeIndex;

        if(swiper.slidesGrid.length === index + 1) handleSwiperNextMove(-1, 'top');
        else handleSwiperNextMove(index, 'top');
    });

    $(document).on('click', '.nav > li', function(e) {
        $(this).toggleClass('active').find('.sub-nav').slideToggle(400);
        $(this).siblings('li').removeClass('active').find('.sub-nav').slideUp(400);
    });

    setTimeout(function() {
        $('.visual-fixed-sec').find('.page-tit').addClass('activeMotion');
        $('.visual-fixed-sec').find('.text-area > span').addClass('activeMotion');
    }, 500);

    $('.visual-sec').on('scroll mousewheel touchmove', optimizeAnimation(videoSectionScrollAnimation));

    const $swiperSlides = $('.swiper-wrapper').children('.swiper-slide[data-swiper-move="disabled"]');
    $swiperSlides.each(function(index, item) {
        $(item).on('scroll mousewheel touchmove', optimizeAnimation(function(e) {
                const index = swiper.activeIndex
                    , $slide = $(swiper.slides[index]);
        
                const scrollY = Math.ceil($slide.scrollTop())
                    , outerHeight = Math.round($slide.outerHeight())
                    , scrollHeight = Math.round($slide.prop('scrollHeight'))
                    , isScroll = scrollHeight > outerHeight ? true : false;
                                
                if(isScroll) {
                    if((wheelDirection === 'top' || touchDirection === 'top') && (outerHeight >= scrollHeight - scrollY || scrollY + outerHeight >= scrollHeight)) {
                        const crtIndedx = swiper.activeIndex
                            , $crtSlide = $(swiper.slides[crtIndedx])
                            , crtScrollY = Math.ceil($crtSlide.scrollTop())
                            , crtOuterHeight = Math.round($crtSlide.outerHeight())
                            , crtScrollHeight = Math.round($crtSlide.prop('scrollHeight'));

                        if(index === crtIndedx) {
                            if(crtOuterHeight >= crtScrollHeight - crtScrollY || crtScrollY + crtOuterHeight >= crtScrollHeight) {
                                // 자동으로 다음 컨텐츠로 이동한다.
                                // swiper.slideNext();
                                
                                if (!timer2) {
                                    timer2 = setTimeout(() => {
                                        timer2 = null;
                                
                                        // 한 번더 모션을 취해야만 다음 컨텐츠로 이동할 수 있다 
                                        swiperWheelControl.turnOn();
                                        swiper.mousewheel.enable();
                                        swiper.allowTouchMove = true; 
                                    }, 800);
                                }
                            }
                        }
                    }
                    if((wheelDirection === 'bottom' || touchDirection === 'bottom') && scrollY <= 5) {
                        // 자동으로 다음 컨텐츠로 이동한다.
                        // swiper.slidePrev();

                        //  한 번더 모션을 취해야만 다음 컨텐츠로 이동할 수 있다 
                        swiperWheelControl.turnOn();
                        swiper.mousewheel.enable();
                        swiper.allowTouchMove = true;
                    }
                }
            })
        );
    });
});
let swiperWheelControl; 
const setSwiper = () => {
    swiper = new Swiper('.main-swiper', {
        direction: "vertical", // 방향 (가로: horizontal, 세로: vertical)
        speed: 1000, // 속도
        mousewheel: false, // 마우스 휠 지원 여부
        allowTouchMove: false,
        replaceState: true,
        pagination: { // 페이지 버튼 설정
            el: ".swiper-pagination", // 페이지 버튼 엘리먼트 설정
            clickable: false, // 클릭 여부 (클릭 시 해당 슬라이드 이동)
        },
        on: {
            init: function() {
                console.log('init');
            },
            slideChange: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , outerHeight = Math.round($slide.outerHeight())
                    , scrollHeight = Math.round($slide.prop('scrollHeight'))
                    , isScroll = scrollHeight > outerHeight ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');
                
                $slide.addClass('seen-sec');
                textMotionAnimation($slide);

                if(index === 0) $slide.siblings().removeClass('seen-sec');
                else $slide.nextAll().removeClass('seen-sec');

                if(this.slidesGrid.length === index + 1) {
                    $('.swiper-next-btn').addClass('up');
                    $('.swiper-next-btn').find('em').text('맨 위로 이동');
                } else {
                    $('.swiper-next-btn').hasClass('up') ? $('.swiper-next-btn').removeClass('up') : false;
                    $('.swiper-next-btn').find('em').text('다음 section 이동');
                }
                
                if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
                    wheelDirection = '';
                    touchDirection = '';
                    swiperWheelControl.turnOff();
                    swiper.mousewheel.disable();
                    swiper.allowTouchMove = false;   
                } else {
                    swiperWheelControl.turnOn();
                    swiper.mousewheel.enable();
                    swiper.allowTouchMove = true;    
                }
            },
            transitionStart: function() {
                // swiperWheelControl.turnOff();
                // swiper.mousewheel.disable();
                // swiper.allowTouchMove = false; 
            },
            transitionEnd: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , outerHeight = Math.round($slide.outerHeight())
                    , scrollHeight = Math.round($slide.prop('scrollHeight'))
                    , isScroll = scrollHeight > outerHeight ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');


                if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
                    // swiperWheelControl.turnOff();
                    // swiper.mousewheel.disable();
                    // swiper.allowTouchMove = false;   
                } else {
                    swiperWheelControl.turnOn();
                    swiper.mousewheel.enable();
                    swiper.allowTouchMove = true;    
                }
            },
            slidePrevTransitionStart: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , outerHeight = Math.round($slide.outerHeight())
                    , scrollHeight = Math.round($slide.prop('scrollHeight'))

                $slide.scrollTop(scrollHeight - outerHeight);

            },
            slideNextTransitionStart: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])

                $slide.scrollTop(0);
            },
        }
    });

    swiperWheelControl = new WheelIndicator({
        elem: document.querySelector('.swiper-container'),
        callback: function(e){
            if(e.direction == 'up') {
                swiper.slidePrev();
            } else {
                swiper.slideNext();
            }
        },
        preventMouse: false
    });
}

const moveSwiperSlideTo = (index, direction) => {
    if(direction === 'top') {
        // enableSlideChange();
        // swiper.slideTo(index + 1, 800, true);
        // swiper.slideNext();
    } else if(direction === 'bottom') {
        // enableSlideChange();
        // swiper.slideTo(index - 1, 800, true);
    }
}

const enableSlideChange = function() {
    // swiper.mousewheel.enable();
    // swiper.allowTouchMove = true;

    // if(!timer3) {
    //     clearTimeout(timer3);
    // }
    // timer3 = setTimeout(function() {
    //     swiperWheelControl.turnOn();
    // }, 1000);
}

const disableSlideChange = function() {
    // swiper.mousewheel.disable();
    // swiper.allowTouchMove = false;

    // swiperWheelControl.turnOff();
    // swiperWheelControl.getOption('preventMouse'); // true

}

const visualPosInfo = { startY: 0, endY: 0, height: 0, point: 0, };
const getVisualSectionSrcollInfo = () => {
    visualPosInfo.startY = $('.visual-sec').find('.video-wrap').position().top + 7
    visualPosInfo.endY = $('.visual-fixed-sec').find('.text-area').position().top;
    visualPosInfo.height = $('.visual-fixed-sec').find('.page-tit').innerHeight() / 2 - 5
    visualPosInfo.point = visualPosInfo.startY - (visualPosInfo.endY + visualPosInfo.height);
}

let isFixed = false;
const videoSectionScrollAnimation = function() {
    const $visualSec = $('.visual-sec')
        , outerHeight = Math.round($visualSec.outerHeight())
        , scrollHeight = Math.round($visualSec.prop('scrollHeight'))
        , textY = visualPosInfo.endY + visualPosInfo.height
        , videoY = $visualSec.find('.video-wrap').get(0).getBoundingClientRect().y
        , diff = videoY - textY
        , diffRatio = diff / visualPosInfo.point * 100;


    if(diff > 0) {
        $visualSec.find('video').get(0).pause();
        $('#contents').prepend($('.visual-fixed-sec'));

        $('.cut-off.left').css('transform', 'translate3d(-'+ (100 - diffRatio) +'%, 0px, 0px)');
        $('.cut-off.right').css('transform', 'translate3d('+ (100 - diffRatio) +'%, 0px, 0px)');
        $('.visual-fixed-sec').find('.text-area').css({
            'position': 'fixed',
            'top': visualPosInfo.endY
        });
    }
    
    if(diff < 0) {
        $visualSec.find('video').get(0).play();
        $visualSec.find('.inner').prepend($('.visual-fixed-sec'));

        $('.cut-off.left').css('transform', 'translate3d(-100%, 0px, 0px)');
        $('.cut-off.right').css('transform', 'translate3d(100%, 0px, 0px)');
        $('.visual-fixed-sec').find('.text-area').css({
            'position': 'absolute',
            'top': visualPosInfo.startY - $('.visual-fixed-sec').find('.page-tit').innerHeight() / 2 - 5
        });
    }

    if(!isFixed) {
        $visualSec.animate({scrollTop: visualPosInfo.startY - $('.visual-fixed-sec').find('.page-tit').innerHeight() - 109 }, 600);
        $visualSec.addClass('fixed');

        isFixed = true;
    }

    if(!$visualSec.is(':animated') && $visualSec.hasClass('fixed')) {
        $visualSec.removeClass('fixed')
        $visualSec.animate({scrollTop: scrollHeight - outerHeight }, 600);
    }
}

const setSwipter2 = function() {
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

// next 버튼 클릭 시 다음 section 이동 
const handleSwiperNextMove = (index, direction) => {
    const $slide = $(swiper.slides[index])
        , outerHeight = Math.round($slide.outerHeight())
        , scrollHeight = Math.round($slide.prop('scrollHeight'))
        , isScroll = scrollHeight > outerHeight ? true : false
        , dataSwiperMove = $slide.data('swiper-move');
        
    if(direction === 'top') {
        if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
            $slide.animate({ scrollTop: scrollHeight - outerHeight }, 1000, function() {
                swiper.slideTo(index + 1, 1000, true);
            });
        } else {
            swiper.slideTo(index + 1, 1000, true);
        }
    } else if(direction === 'bottom') {
        swiper.slideTo(index - 1, 1000, true);
    }
}

const textMotionAnimation = function(item) {
    const $target = $(item)

    setTimeout(function() {
        $target.find('.tit').addClass('activeMotion');
        $target.find('.desc').addClass('activeMotion');
    }, 400);
}

const isElemOverScreen = function(elem, triggerDiff) {
    const top = $(elem).get(0).getBoundingClientRect().top
        , { innerHeight } = window;

    return top > innerHeight + (triggerDiff || 0);
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

const getClientX = function(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
};

const getClientY = function(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
};

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

// header nav animation
const openNav = function() {
    $('#gnb-wrap').addClass('on');
}

const closeNav = function() { 
    $('#gnb-wrap').removeClass('on');

    const $navLis = $('.nav > li');
    setTimeout(function() {
        $navLis.each(function(index, item) {
            $(item).removeClass('active').find('.sub-nav').css('display', 'none');
        });
    }, 300);
}