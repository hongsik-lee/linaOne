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
        pagination: { // 페이지 버튼 설정
            el: ".swiper-pagination", // 페이지 버튼 엘리먼트 설정
            clickable: true, // 클릭 여부 (클릭 시 해당 슬라이드 이동)
        },
        on: {
            init: function() {
                console.log('init');
            },
            beforeSlideChangeStart: function() {
                let index  = this.activeIndex;

                if(wheelDirection === 'top' || touchDirection === 'top') {
                    index + 1
                }

                const $slide = $(this.slides[index])
                    , isScroll = Math.round($slide.prop('scrollHeight')) > Math.round($slide.outerHeight()) ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');

                if(dataSwiperMove && dataSwiperMove === 'disabled') {
                    wheelDirection = '';
                    touchDirection = '';
                    swiper.mousewheel.disable();
                    swiper.allowTouchMove = false;
                } 
            },
            slideChange: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , isScroll = Math.round($slide.prop('scrollHeight')) > Math.round($slide.outerHeight()) ? true : false
                    , dataSwiperMove = $slide.data('swiper-move');

                if(dataSwiperMove && dataSwiperMove === 'disabled') {
                    wheelDirection = '';
                    touchDirection = '';
                    swiper.mousewheel.disable();
                    swiper.allowTouchMove = false;
                } else {
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

// 마우스 눌렀을 때
const handleMouseDownSwiper = function(e) {

    const mouseMove = function(e) {
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
                    moveSwiperSlideTo(index, direction);
                } else if(direction === 'bottom' && scrollY === 0) {
                    moveSwiperSlideTo(index, direction);
                }
            }
        }
    }

    const mouseUp = function(e) {
        isMouseDown = false;
        initialX = null;
        initialY = null;

        $(window).off('mousemove', mouseMove);
        $(window).off('mouseup', mouseUp);
    }

    $(window).on('mousemove', mouseMove);
    $(window).on('mouseup', mouseUp);
}

 // 마우스 휠 했을 때, 터치 했을 때
const handleMoveSwiper = (swiper, direction = 'top') => {
    const index = swiper.activeIndex
        , $slide = $(swiper.slides[index])
        , outerHeight = Math.round($slide.outerHeight())
        , scrollHeight = Math.round($slide.prop('scrollHeight'))
        , isScroll = scrollHeight > outerHeight ? true : false
        , dataSwiperMove = $slide.data('swiper-move');
    let scrollY = Math.round($slide.scrollTop())

    if(scrollY < 0) {
        scrollY = 0;
    }

    $('#value').html('direction: ' + direction + ', srcollY: ' + scrollY)

    // if(isScroll && dataSwiperMove && dataSwiperMove === 'disabled') {
    if(dataSwiperMove && dataSwiperMove === 'disabled') {
        if(direction === 'top' && scrollY + outerHeight >= scrollHeight) {
            moveSwiperSlideTo(index, direction);
        } else if(direction === 'bottom' && scrollY <= 3) {
            moveSwiperSlideTo(index, direction);
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

// 터치 했을 때 x 값
const getClientX = (e) => {
    return e.touches ? e.touches[0].clientX : e.clientX;
};

// 터치 했을 때 y 값
const getClientY = (e) => {
    return e.touches ? e.touches[0].clientY : e.clientY;
};

// 터치 했을 때 이동 위치에 따라 좌우/아래 값
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