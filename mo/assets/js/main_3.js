let yOffset = 0;
let wheelDirection;
let touchDirection;
let startX, startY, endX, endY;

$(document).ready(function() {
    setSwipter();
    getBalanceSecPositionTop();

    $('.visual-sec').find('video').get(0).play();
    $('.visual-sec').find('video').get(0).pause();

    $("#contents").on('touchstart',function(event){
        startX = event.originalEvent.changedTouches[0].screenX;
        startY = event.originalEvent.changedTouches[0].screenY;
    });

    $("#contents").on('touchmove',function(event){
        endX=event.originalEvent.changedTouches[0].screenX;
        endY=event.originalEvent.changedTouches[0].screenY;

        if(startY-endY > 5) touchDirection = 'top';
        if(endY-startY > 5) touchDirection = 'bottom';
    });

    $(window).on('mousewheel', function(e) {
        wheelDirection = e.originalEvent.deltaY > 0 ? "top" : "bottom";
    });

    $(document).on('click', '.sec-move-btn', handelSecMoveBtnClick);

    const $secWrap  = $('.sec-wrap > div');
    $secWrap.each(function(index, item) {
        textMotionAnimation(item);
    });

    $(window).on('scroll mousewheel touchmove', optimizeAnimation(function() {
        yOffset = $(window).scrollTop();
        videoSectionScrollAnimation();

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

        changeControlStatus();
    }));

    // 새로고침시 맨 위로
    $(window).on('beforeunload', function() { $(window).scrollTop(0); });
});

let balanceSecRealLt;
const getBalanceSecPositionTop = function() {
    const visialSecPt = parseInt($('.visual-sec').find('.inner').css('padding-top'))
        , balanceSecLt = $('.balance-promise-sec').position().top;

    balanceSecRealLt = balanceSecLt - visialSecPt;
}

let timer, timer2, isMoveBtn = false;
const videoSectionScrollAnimation = function() {
    const $secWrap = $('.sec-wrap')
    
    if($(window).scrollTop() > 0 && $secWrap.hasClass('active')) {
        $secWrap.removeClass('depth2');
    }

    // direction === top
    if(wheelDirection === 'top' || touchDirection === 'top') {
        if(!timer) {
            timer = setTimeout(function() {
                timer = null;
                
                if($secWrap.hasClass('depth1') && !$secWrap.hasClass('active')) {
                    !isMoveBtn ? visualAnimation(1) : false;
                }
            }, 200);
        }
    
        if(!timer2) {
            timer2 = setTimeout(function() {
                timer2 = null;
                if($secWrap.hasClass('depth2') && !$secWrap.hasClass('active')) {
                    !isMoveBtn ? visualAnimation(2) : false;
                }
            }, 200);
        }
    }

    // direction === bottom
    if(wheelDirection === 'bottom' || touchDirection === 'bottom') {
        if(yOffset === 0) {
            const $visualSec = $('.visual-sec');
            if($('.sec-wrap').hasClass('active')) {
                $visualSec.find('.text-area').animate({
                    'top': (154 / 360 * 100).toFixed(4) + 'vw'
                }, 800);

                $visualSec.find('.inner').animate({
                    'padding-top': (246 / 360 * 100).toFixed(4) - 1 + 'vw'
                }, 800, function() {
                    $visualSec.find('.inner').removeClass('invert')
                    $('.sec-wrap').addClass('depth1');
                });

                $('.sec-wrap').removeClass('active');
            }

            if($('.sec-wrap').hasClass('depth1')) {
                visualAnimationReverse(2)
            }
        }
    }
}

const visualAnimation = function(order) {
    const $secWrap = $('.sec-wrap')
        , $visualSec = $('.visual-sec');

    switch(order) {
        case 1:
            $visualSec.find('.text-area').css({
                'position': 'absolute',
                'top': (154 / 360 * 100).toFixed(4) + 'vw'
            });
        
            $visualSec.find('.inner').css({
                'padding-top': (246 / 360 * 100).toFixed(4) + 'vw'
            });
        
            $('.cut-off.left').css('transform', 'translate3d(-100%, 0px, 0px)');
            $('.cut-off.right').css('transform', 'translate3d(100%, 0px, 0px)');
            
            setTimeout(function() {
                $secWrap.addClass('depth2');
                $visualSec.find('.inner').addClass('invert');
            }, 500);
            break;

        case 2:
            $visualSec.find('.text-area').animate({
                'top': '-' + (88 / 360 * 100).toFixed(4) + 'vw'
            }, 800);
        
            $visualSec.find('.inner').animate({
                'padding-top': 0
            }, 800);
            
            $secWrap.removeClass('depth1');
            $secWrap.removeClass('depth2');
            $secWrap.addClass('active');
            $visualSec.find('video').get(0).play();
            break;
        
        case 3:
            $('html, body').animate({scrollTop : balanceSecRealLt }, 800);
            break;
    }
}

const visualAnimationReverse = function(order) {
    const $secWrap = $('.sec-wrap')
        , $visualSec = $('.visual-sec');

    switch(order) {
        case 1:
            $visualSec.find('.text-area').animate({
                'top': (154 / 360 * 100).toFixed(4) + 'vw'
            }, 100);

            $visualSec.find('.inner').animate({
                'padding-top': (246 / 360 * 100).toFixed(4) - 1 + 'vw'
            }, 100, function() {
                $visualSec.find('.inner').removeClass('invert')
            });
            
            $('.sec-wrap').removeClass('active');
            break;

        case 2:
            $secWrap.removeClass('depth2');
            $visualSec.find('.inner').removeClass('invert');
            $('.visual-sec').find('.inner').attr('style', '');
            $('.cut-off.left').css('transform', 'translate3d(0, 0, 0)');
            $('.cut-off.right').css('transform', 'translate3d(0, 0, 0)');
            $visualSec.find('video').get(0).pause();
            break;
        
        case 3:
            $('html, body').animate({scrollTop : balanceSecRealLt }, 800);
            break;
    }
}

const handelSecMoveBtnClick = function(e) {
    const $target = $(e.currentTarget)

    if($target.hasClass('next')) {
        if($('.sec-wrap').hasClass('depth1') && !$('.sec-wrap').hasClass('active')) {
            $(window).scrollTop(0);
            visualAnimation(1);
        }

        setTimeout(function() {
            if($('.sec-wrap').hasClass('depth2') && !$('.sec-wrap').hasClass('active')) {
                visualAnimation(2);
            }
        }, 500);

        setTimeout(function() {
            visualAnimation(3);
        }, 1000);
    }

    if($target.hasClass('up')) {
        let posTop = $('.sec-wrap').children().eq(0).offset().top;
        isMoveBtn = true;
        
        $('html, body').animate({scrollTop : posTop }, 800, function() {

            if($('.sec-wrap').hasClass('active')) {
                $('.sec-wrap').addClass('depth1');
                visualAnimationReverse(1)
            }

            if($('.sec-wrap').hasClass('depth1')) {
                setTimeout(function() {
                    visualAnimationReverse(2);
                    isMoveBtn = false;
                }, 230);
                
                setTimeout(function() {
                    visualAnimationReverse(2);
                    isMoveBtn = false;
                }, 250);
            }
        });
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

const changeControlStatus = function() {
    const $currentScene = $('.sec-wrap').find('.seen-sec').last()
        , len = $('.sec-wrap').children().length
        , index = $currentScene.index()
        , $indicator = $('.indicator-group')
        , ratio = getElemScrollRatio($currentScene)
        , $goTop = $('.sec-move-btn');

    if(1 - ratio > 0.2) {
        $indicator.children().eq(index).addClass('active').siblings().removeClass('active');
    }
    if(index === 0) {
        $goTop.addClass('next');
        $goTop.removeClass('blind up');
    } else if(index + 1 === len) {
        $goTop.addClass('up');
        $goTop.removeClass('blind next');
        $goTop.find('em').text('맨 위로 이동');
    } else {
        $goTop.addClass('blind');
    } 
}

const setSwipter = function() {
    const $texts = $('.brand-goal-sec').find('.text-area');

    new Swiper(".brand-goal-swiper", {
        slidesPerView: 'auto',
        slidesOffsetAfter: 40,
        speed: 600,
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

// // header nav animation
// const openNav = function() {
//     $('#gnb-wrap').addClass('on');
// }

// const closeNav = function() { 
//     $('#gnb-wrap').removeClass('on');

//     const $navLis = $('.nav > li');
//     setTimeout(function() {
//         $navLis.each(function(index, item) {
//             $(item).removeClass('active').find('.sub-nav').css('display', 'none');
//         });
//     }, 300);
// }