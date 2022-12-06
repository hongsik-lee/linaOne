// mobile
let swiper, swiper2;
let initialX, initialY, wheelDirection, touchDirection;
let isMouseDown, initialScrollY;
$(document).ready(function() {
    setSwiper();
    setSwipter2();
    getVisualSectionSrcollInfo();

    $(window).on('touchstart', function(e) {
        initialX = getClientX(e);
        initialY = getClientY(e);
    });

    $(window).on('touchmove', getDirection);

    $(window).on('mousewheel', function(e) {
        wheelDirection = e.originalEvent.deltaY > 0 ? "top" : "bottom";
    });

    $(window).on('mousedown', function(e) {
        initialX = getClientX(e);
        initialY = getClientY(e);
        isMouseDown = true;
        initialScrollY = $(e.target).closest('.swiper-slide').scrollTop();
        
        handleMouseDownSwiper(e);
    });

    $(document).on('mousewheel', '.swiper-slide', function(e) {
        handleMoveSwiper(swiper, wheelDirection);
    });

    $(document).on('touchmove', '.swiper-slide', function(e) {
        console.log('touchmove')
        handleMoveSwiper(swiper, touchDirection);
    });

    $('.visual-sec').on('scroll', function() {
        videoSectionScrollAnimation();
    });
});

// header nav animation
function openNav(){
    document.getElementById('gnb-wrap').classList.add('on')
}

function closeNav(){
    document.getElementById('gnb-wrap').classList.remove('on')
}

const setSwiper = () => {
    swiper = new Swiper('.main-swiper', {
        direction: "vertical", // 방향 (가로: horizontal, 세로: vertical)
        speed: 800, // 속도
        slidesPerView: 'auto',
        mousewheel: false, // 마우스 휠 지원 여부
        allowTouchMove: false, // 터치 이벤트(pc)
        on: {
            init: function() {
                console.log('init');
            },
            slideChange: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , isScroll = Math.round($slide.prop('scrollHeight')) > Math.round($slide.outerHeight()) ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');

                if(dataSwiperMove && dataSwiperMove === 'disabled') {
                    console.log('비활성화')
                    wheelDirection = ''; // 변경 시 초기화
                    swiper.mousewheel.disable(); // 마우스 휠 금지
                    swiper.allowTouchMove = false; // 터치 금지
                } else {
                    console.log('활성화')
                    swiper.mousewheel.enable();
                    swiper.allowTouchMove = true;
                }
            }
        }
    });
}

const setSwipter2 = function() {
    const $texts = $('.brand-goal-sec').find('.text-area');

    swiper2 = new Swiper(".brand-goal-swiper", {
        slidesPerView: 'auto',
        // slidesOffsetAfter: 600,
        // breakpoints: {
        //     1921: { slidesPerView: 2 }
        // },
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

const handleMouseDownSwiper = (e) => {
    const mouseMove = (e) => mouseDownMoveSwiper(e)

    const mouseUp = (e) => {
        isMouseDown = false;
        initialX = null;
        initialY = null;

        $(window).off('mousemove', mouseMove);
        $(window).off('mouseup', mouseUp);
    }

    $(window).on('mousemove', mouseMove);
    $(window).on('mouseup', mouseUp);
}

const handleMoveSwiper = (swiper, direction = 'top') => {
    const index = swiper.activeIndex
        , $slide = $(swiper.slides[index])
        , scrollY = Math.round($slide.scrollTop())
        , outerHeight = Math.round($slide.outerHeight())
        , scrollHeight = Math.round($slide.prop('scrollHeight'))
        , isScroll = scrollHeight > outerHeight ? true : false
        , dataSwiperMove = $slide.data('swiper-move');

    // if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
    if(dataSwiperMove && dataSwiperMove === 'disabled') {
        if(direction === 'top' && scrollY + outerHeight >= scrollHeight) {
            moveSwiperSlideTo(index, direction);
        } else if(direction === 'bottom' && scrollY === 0) {
            moveSwiperSlideTo(index, direction);
        }
    }
}

const mouseDownMoveSwiper = (e) => {
    const index = swiper.activeIndex
        , $slide = $(swiper.slides[index])
        , scrollY = Math.round($slide.scrollTop())
        , outerHeight = Math.round($slide.outerHeight())
        , scrollHeight = Math.round($slide.prop('scrollHeight'))
        , currentY = getClientY(e)
        , direction = getDirection(e)
        , isScroll = scrollHeight > outerHeight ? true : false
        , dataSwiperMove = $slide.data('swiper-move');

    if(isMouseDown) {
        $slide.scrollTop(initialScrollY - currentY + initialY);

        // if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
        if(dataSwiperMove && dataSwiperMove === 'disabled') {
            if(direction === 'top' && !(scrollY === 0) && scrollY + outerHeight >= scrollHeight) {
                console.log('top')
                moveSwiperSlideTo(index, direction);
            } else if(direction === 'bottom' && scrollY === 0) {
                moveSwiperSlideTo(index, direction);
            }
        }
    }
}

const moveSwiperSlideTo = (index, direction) => {
    if(direction === 'top') {
        swiper.mousewheel.enable();
        swiper.allowTouchMove = true;
        swiper.slideTo(index + 1, 700, true);
    } else if(direction === 'bottom') {
        swiper.mousewheel.enable();
        swiper.allowTouchMove = true;
        swiper.slideTo(index - 1, 700, true);
    }
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
    visualPosInfo.height = $('.visual-fixed-sec').find('.page-tit').innerHeight() / 2 + $('.visual-fixed-sec').find('.page-tit').find('span:first-child').innerHeight() / 2;
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
            'top': visualPosInfo.startY - $('.visual-fixed-sec').find('.page-tit').innerHeight() / 2 - $('.visual-fixed-sec').find('.page-tit').find('span:first-child').innerHeight() / 2
        });
    }
}