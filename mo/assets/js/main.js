// mobile
let swiper, swiper2, timer, timer2;
let initialX, initialY, wheelDirection, touchDirection;
let isMouseDown, initialScrollY;
$(document).ready(function() {
    $('.visual-sec').find('video').get(0).play();
    setSwiper();
    setSwipter2();
    getVisualSectionSrcollInfo();

    $(document).on('click', '.goTop', function(e) {
        const index = swiper.activeIndex;

        if(swiper.slidesGrid.length === index + 1) {
            moveSwiperSlideTo(-1, 'top');
        } else {
            moveSwiperSlideTo(index, 'top');
        }
    });

    // $(window).on('mousedown', function(e) {
    //     initialX = getClientX(e);
    //     initialY = getClientY(e);
    //     isMouseDown = true;
    //     initialScrollY = $(e.target).closest('.swiper-slide').scrollTop();
        
    //     handleMouseDownSwiper(e);
    // });

    $(window).on('touchmove', getDirection);

    $(window).on('touchstart', function(e) {
        initialX = getClientX(e);
        initialY = getClientY(e);
    });
    
    $(window).on('mousewheel', function(e) {
        wheelDirection = e.originalEvent.deltaY > 0 ? "top" : "bottom";
    });

    $(document).on('mousewheel', '.swiper-slide', function(e) {
        handleMoveSwiper(swiper, wheelDirection);

        $('.swiper-slide').each(function(index, item) {
            const isScreen = isElemOverScreen(item);
            if(isScreen) {
                $(item).removeClass('seen-sec')
            }
        });
    });

    $(document).on('touchmove', '.swiper-slide', function(e) {
        handleMoveSwiper(swiper, touchDirection);

        $('.swiper-slide').each(function(index, item) {
            const isScreen = isElemOverScreen(item);
            if(isScreen) {
                $(item).removeClass('seen-sec')
            }
        });
    });

    $('.visual-sec').on('scroll mousewheel', function() {
        // console.log(visualPosInfo.startY - $('.visual-fixed-sec').find('.page-tit').innerHeight() / 3)
        // $(this).animate({scrollTop: visualPosInfo.startY - $('.visual-fixed-sec').find('.page-tit').innerHeight() - 109 }, 1000);
        videoSectionScrollAnimation();
    });

    const $swiperSlides = $('.swiper-wrapper').children('.swiper-slide[data-swiper-move="disabled"]');
    $swiperSlides.each(function(index, item) {
        $(item).on('scroll', optimizeAnimation(function(e) {
                const index = swiper.activeIndex
                , $slide = $(swiper.slides[index]);
        
                const scrollY = $(item).scrollTop()
                    , outerHeight = Math.round($(item).outerHeight())
                    , scrollHeight = Math.round($(item).prop('scrollHeight'))
                    , isScroll = scrollHeight > outerHeight ? true : false;
                                
                // if(outerHeight > scrollHeight - scrollY) $slide.scrollTop(scrollHeight - outerHeight);
                // if(scrollY < 0) $slide.scrollTop(0);

                if(!timer) clearTimeout(timer);
                timer = setTimeout(function() { 
                    if(isScroll) {
                        if(wheelDirection || touchDirection === 'top' && (outerHeight > scrollHeight - scrollY || scrollY + outerHeight >= scrollHeight)) {
                            moveSwiperSlideTo(index, wheelDirection || touchDirection);
                        } else if(wheelDirection || touchDirection === 'bottom' && scrollY <= 3)  {
                            moveSwiperSlideTo(index, wheelDirection || touchDirection);
                        }
                    }
                }, 500);
            })
        );
    });

    $(document).on('click', '.nav > li', function(e) {
        $(this).toggleClass('active').find('.sub-nav').slideToggle(400);
        $(this).siblings('li').removeClass('active').find('.sub-nav').slideUp(400);
    });

    setTimeout(function() {
        $('.visual-fixed-sec').find('.page-tit').addClass('activeMotion');
        $('.visual-fixed-sec').find('.text-area > span').addClass('activeMotion');
    }, 500);
});

const setSwiper = () => {
    swiper = new Swiper('.main-swiper', {
        direction: "vertical", // 방향 (가로: horizontal, 세로: vertical)
        resistance: false,
        speed: 1000, // 속도
        slidesPerView: 'auto',
        mousewheel: false, // 마우스 휠 지원 여부
        allowTouchMove: false, // 터치 이벤트(pc)
        preventInteractionOnTransition: true,
        simulateTouch: false,
        pagination: { // 페이지 버튼 설정
            el: ".swiper-pagination", // 페이지 버튼 엘리먼트 설정
            clickable: false, // 클릭 여부 (클릭 시 해당 슬라이드 이동)
        },
        on: {
            init: function() {
                console.log('init');
            },
            beforeInit: function() {
                console.log('beforeInit')
            },
            beforeSlideChangeStart: function() {
                let index  = this.activeIndex;
                const $slide = $(this.slides[index])
                    , isScroll = Math.round($slide.prop('scrollHeight')) > Math.round($slide.outerHeight()) ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');

                if(wheelDirection === 'top' || touchDirection === 'top') {
                    index + 1
                }
                if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
                    wheelDirection = '';
                    touchDirection = '';
                    disableSlideChange();
                }
            },
            slideChange: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , outerHeight = Math.round($slide.outerHeight())
                    , scrollHeight = Math.round($slide.prop('scrollHeight'))
                    , isScroll = scrollHeight > outerHeight ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');
                
                $slide.addClass('seen-sec')

                if(index === 0) {
                    $slide.siblings().removeClass('seen-sec')
                }
                textMotionAnimation($slide);
                if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
                    wheelDirection = '';
                    touchDirection = '';
                    disableSlideChange();
                } else {
                    enableSlideChange();
                }
            },
            transitionStart: function() {
                // disableSlideChange();
            },
            transitionEnd: function() {
                // if(!timer2) {
                //     clearTimeout(timer2);
                // }
                // timer2 = setTimeout(function() {
                //     enableSlideChange();
                // }, 500);
            },
            slidePrevTransitionStart: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , outerHeight = Math.round($slide.outerHeight())
                    , scrollHeight = Math.round($slide.prop('scrollHeight'))

                $slide.scrollTop(scrollHeight - outerHeight)
            },
            slideNextTransitionStart: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])

                $slide.scrollTop(0);
            },
        }
    });
}

// 마우스 눌렀을 때
// const handleMouseDownSwiper = function(e) {
//     const mouseMove = function(e) {
//         const index = swiper.activeIndex
//             , $slide = $(swiper.slides[index])
//             , scrollY = Math.round($slide.scrollTop())
//             , outerHeight = Math.round($slide.outerHeight())
//             , scrollHeight = Math.round($slide.prop('scrollHeight'))
//             , currentY = getClientY(e)
//             , direction = getDirection(e)
//             , isScroll = scrollHeight > outerHeight ? true : false
//             , dataSwiperMove = $slide.data('swiper-move');

//         if(isMouseDown) {
//             $slide.scrollTop(initialScrollY - currentY + initialY);
           
//             if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
//                 if(direction === 'top' && !(scrollY === 0) && scrollY + outerHeight >= scrollHeight) {
//                     moveSwiperSlideTo(index, direction);
//                 } else if(direction === 'bottom' && scrollY === 0) {
//                     moveSwiperSlideTo(index, direction);
//                 }
//             }
//         }
//     }

//     const mouseUp = function(e) {
//         isMouseDown = false;
//         initialX = null;
//         initialY = null;

//         $(window).off('mousemove', mouseMove);
//         $(window).off('mouseup', mouseUp);
//     }

//     $(window).on('mousemove', mouseMove);
//     $(window).on('mouseup', mouseUp);
// }

// 마우스 휠 했을 때, 터치 했을 때
const handleMoveSwiper = (swiper, direction = 'top') => {
    const index = swiper.activeIndex
        , $slide = $(swiper.slides[index]);

    const scrollY = $slide.scrollTop()
        , outerHeight = Math.round($slide.outerHeight())
        , scrollHeight = Math.round($slide.prop('scrollHeight'))
        , isScroll = scrollHeight > outerHeight ? true : false
        , dataSwiperMove = $slide.data('swiper-move');

    if(!timer) {
        clearTimeout(timer);
    }

    timer = setTimeout(function() { 
        if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
            if(wheelDirection || touchDirection === 'top' && scrollY + outerHeight >= scrollHeight) {
                moveSwiperSlideTo(index, wheelDirection || touchDirection);
            } else if(wheelDirection || touchDirection === 'bottom' && scrollY <= 3)  {
                moveSwiperSlideTo(index, wheelDirection || touchDirection);
            }
        }
    }, 500);
}

const moveSwiperSlideTo = (index, direction) => {
    if(direction === 'top') {
        enableSlideChange();
        swiper.slideTo(index + 1, 1000, true);
    } else if(direction === 'bottom') {
        enableSlideChange();
        swiper.slideTo(index - 1, 1000, true);
    }
}

const enableSlideChange = function() {
    swiper.mousewheel.enable();
    swiper.allowTouchMove = true;
}

const disableSlideChange = function() {
    swiper.mousewheel.disable();
    swiper.allowTouchMove = false;
}

const getClientX = (e) => {
    return e.touches ? e.touches[0].clientX : e.clientX;
};

const getClientY = (e) => {
    return e.touches ? e.touches[0].clientY : e.clientY;
};

const getDirection = (e) => {
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

const visualPosInfo = { startY: 0, endY: 0, height: 0, point: 0, };
const getVisualSectionSrcollInfo = () => {
    visualPosInfo.startY = $('.visual-sec').find('.video-wrap').position().top + 7
    visualPosInfo.endY = $('.visual-fixed-sec').find('.text-area').position().top;
    visualPosInfo.height = $('.visual-fixed-sec').find('.page-tit').innerHeight() / 2 - 5
    visualPosInfo.point = visualPosInfo.startY - (visualPosInfo.endY + visualPosInfo.height);
}

const videoSectionScrollAnimation = function() {
    const textY = visualPosInfo.endY + visualPosInfo.height
        , videoY = $('.visual-sec').find('.video-wrap').get(0).getBoundingClientRect().y
        , diff = videoY - textY
        , diffRatio = diff / visualPosInfo.point * 100

    if(diff > 0) {
        $('.visual-sec').find('video').get(0).pause();
        $('#contents').prepend($('.visual-fixed-sec'))
        $('.visual-fixed-sec').find('.text-area').css({
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
        $('.visual-sec').find('.inner').prepend($('.visual-fixed-sec'));
        $('.visual-fixed-sec').find('.text-area').css({
            'position': 'absolute',
            'top': visualPosInfo.startY - $('.visual-fixed-sec').find('.page-tit').innerHeight() / 2 - 5
        });
    }
}

const setSwipter2 = function() {
    const $texts = $('.brand-goal-sec').find('.text-area');

    swiper2 = new Swiper(".brand-goal-swiper", {
        slidesPerView: 'auto',
        slidesOffsetAfter: 40,
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