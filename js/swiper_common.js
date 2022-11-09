let swiper;
let initialX, initialY, wheelDirection, touchDirection;
let isMouseDown, initialScrollY;
$(document).ready(function() {
    setSwiper();

    $(window).on('touchstart', (e) => {
        initialX = getClientX(e);
        initialY = getClientY(e);
    });

    $(window).on('touchmove', getDirection);

    $(window).on('mousewheel', (e) => {
        wheelDirection = e.originalEvent.deltaY > 0 ? "top" : "bottom";
    });

    $(window).on('mousedown', (e) => {
        initialX = getClientX(e);
        initialY = getClientY(e);
        isMouseDown = true;
        initialScrollY = $(e.target).closest('.swiper-slide').scrollTop();
        
        handleMouseDownSwiper(e);
    });

    $(document).on('mousewheel', '.swiper-slide', (e) => {
        handleMoveSwiper(swiper, wheelDirection);
    });

    $(document).on('touchmove', '.swiper-slide', (e) => {
        handleMoveSwiper(swiper, touchDirection);
    });

    $(document).on('click', '.swiper-pagination', (e) => {
        const index = swiper.activeIndex
        , $slide = $(swiper.slides[index])
    
        $slide.scrollTop(0);
    });

    $(document).on('click', '.swiper-next-btn', () => {
        const index = swiper.activeIndex;

        if(swiper.slidesGrid.length === index + 1) {
            moveSwiperSlideTo(-1, 'top');
        } else {
            moveSwiperSlideTo(index, 'top');
        }
    });
});

const setSwiper = () => {
    swiper = new Swiper('.main-swiper', {
        direction: "vertical", // 방향 (가로: horizontal, 세로: vertical)
        // slidesPerView: "auto",
        // freeMode: true,
        mousewheel: true, // 마우스 휠 지원 여부
        speed: 700, // 속도
        autoHeight: true,
        pagination: { // 페이지 버튼 설정
            el: ".swiper-pagination", // 페이지 버튼 엘리먼트 설정
            clickable: true, // 클릭 여부 (클릭 시 해당 슬라이드 이동)
        },

        on: {
            init: function() {
                console.log('swiper initialized');
            },
            slideChange: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , isScroll = Math.round($slide.prop('scrollHeight')) > Math.round($slide.outerHeight()) ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');

                if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
                    wheelDirection = ''; // 변경 시 초기화
                    swiper.mousewheel.disable(); // 마우스 휠 금지
                    swiper.allowTouchMove = false; // 터치 금지
                } else {
                    swiper.mousewheel.enable();
                    swiper.allowTouchMove = true;
                }

                if(this.slidesGrid.length === index + 1) {
                    $('.swiper-next-btn').addClass('up');
                    $('.sns').addClass('up');
                } else {
                    $('.swiper-next-btn').hasClass('up') ? $('.swiper-next-btn').removeClass('up') : false;
                    $('.sns').hasClass('up') ? $('.sns').removeClass('up') : false;
                }
            },
            transitionStart: function() {
                $('.mySwiper').css('touch-action', 'none');
            },
            transitionEnd: function() {
                $('.mySwiper').css('touch-action', 'auto');
            },
            touchStart: function(e) {
                
            }
        },
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

    if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
        if(direction === 'top' && !(scrollY === 0) && scrollY + outerHeight >= scrollHeight) {
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

        if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
            if(direction === 'top' && !(scrollY === 0) && scrollY + outerHeight >= scrollHeight) {
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