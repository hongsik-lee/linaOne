let yOffset = 0;
let wheelDirection;
let touchDirection;
let startX, startY, endX, endY;

$(document).ready(function() {
    setSwipter();
    // textMotionAnimation();
    // getBalanceSecPositionTop();
    visualSectionAnimation();

    const playVideo = $('.visual-sec').find('video').get(0).play();

    if(playVideo !== undefined) {
        playVideo.then(function(_) {
            $('.visual-sec').find('video').get(0).pause();
        })
    }

    $("#contents").on('touchstart',function(event){
        startX = event.originalEvent.changedTouches[0].screenX;
        startY = event.originalEvent.changedTouches[0].screenY;
    });

    $("#contents").on('touchmove',function(event){
        endX=event.originalEvent.changedTouches[0].screenX;
        endY=event.originalEvent.changedTouches[0].screenY;

        if(startY-endY > 10) touchDirection = 'top';
        if(endY-startY > 10) touchDirection = 'bottom';
    });

    $(window).on('mousewheel', function(e) {
        wheelDirection = e.originalEvent.deltaY > 0 ? "top" : "bottom";
    });

    $(document).on('click', '.sec-move-btn', handelSecMoveBtnClick);

    const $secWrap  = $('.sec-wrap > div');
    $(window).on('scroll mousewheel touchmove', optimizeAnimation(function() {
        yOffset = $(window).scrollTop();
        textMotionAnimation();
        changeControlStatus();
        // videoSectionScrollAnimation();
        relatedInfoSectionAnimation();

        $secWrap.each(function(index, elem) {
            const $target = $(elem)
                , ratio = getElemScrollRatio($target);

            if (isElemOverScreen(elem, -20)) {
                $target.removeClass('seen-sec');
            } else {
                if(1 - ratio > 0.2) $target.addClass('seen-sec');
                if(1 - ratio < 0.4) $target.removeClass('seen-sec');
            }
        });
    }));

    // 새로고침시 맨 위로
    $(window).on('beforeunload', function() { $(window).scrollTop(0); });
});

const visualSectionAnimation = function() {
    const $contents = $('#contents')
        , $visualSec = $('.visual-sec')
        , $videoInner = $visualSec.find('.video-inner');

    let wh = $(window).outerHeight();

    $('.video-wrap').css({
        'height' : ((wh + 246) / 360 * 100).toFixed(4) + 'vw'
    })
    setTimeout(function() {
        $videoInner.animate({
            'top': (246 / 360 * 100).toFixed(4) - 1 + 'vw',
        }, 400, function() {
            $contents.removeClass('fixed');
            $visualSec.find('video').get(0).play();
            textMotionAnimation();
        });
        $('.cut-off.left').css('transform', 'translate3d(-100%, 0px, 0px)');
        $('.cut-off.right').css('transform', 'translate3d(100%, 0px, 0px)');
            
    }, 700);
}

let balanceSecRealLt;
const getBalanceSecPositionTop = function() {
    const visialSecPt = parseInt($('.visual-sec').find('.inner').css('padding-top'))
        , balanceSecLt = $('.balance-promise-sec').position().top;

    balanceSecRealLt = balanceSecLt - visialSecPt;
}

let timer, timer2, timer3, isMoveBtn = false;
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
                    $(window).scrollTop(0);
                    !isMoveBtn ? visualAnimation(1) : false;
                }
            }, 200);
        }
    
        if(!timer2) {
            timer2 = setTimeout(function() {
                timer2 = null;
                if($secWrap.hasClass('depth2') && !$secWrap.hasClass('active')) {
                    $(window).scrollTop(0);
                    !isMoveBtn ? visualAnimation(2) : false;
                }
            }, 200);
        }
        
        if(!timer3) {
            timer3 = setTimeout(function() {
                timer3 = null;
                if($secWrap.hasClass('active') && $secWrap.hasClass('depth3')) {
                    $(window).scrollTop(0);
                    !isMoveBtn ? visualAnimation(3) : false;
                }
            }, 200);
        }
    }

    // direction === bottom
    if(wheelDirection === 'bottom' || touchDirection === 'bottom') {
        if(yOffset === 0) {
            const $visualSec = $('.visual-sec');
            if($('.sec-wrap').hasClass('active')) {
                $(window).scrollTop(0);
                $visualSec.find('.text-area').animate({
                    'top': (154 / 360 * 100).toFixed(4) + 'vw'
                }, 500);

                $visualSec.find('.inner').animate({
                    'padding-top': (246 / 360 * 100).toFixed(4) - 1 + 'vw'
                }, 500, function() {
                    $visualSec.find('.inner').removeClass('invert')
                    $('.sec-wrap').addClass('depth1');
                });

                $('.sec-wrap').removeClass('active');
            }

            if($('.sec-wrap').hasClass('depth1')) {
                $(window).scrollTop(0);
                visualAnimationReverse(2)
            }
        }
    }
}

// visial 애니메이션 순서대로
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
                'padding-top': (246 / 360 * 100).toFixed(4) - 1 + 'vw'
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
            }, 500);
        
            $visualSec.find('.inner').animate({
                'padding-top': 0
            }, 500, function() {
                $secWrap.addClass('depth3');
            });
            
            $secWrap.removeClass('depth1');
            $secWrap.removeClass('depth2');
            $secWrap.addClass('active');
            $('#contents').addClass('fixed');
            $visualSec.find('video').get(0).play();
            break;
        
        case 3:
            $secWrap.removeClass('depth3');
            $('#contents').removeClass('fixed');
            $(window).scrollTop(0);
            $('html, body').animate({scrollTop : $('.balance-promise-sec').position().top }, 800);
            break;
    }
}

// visial 애니메이션 역순대로
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
            $('html, body').animate({scrollTop : $('.balance-promise-sec').position().top }, 800);
            break;
    }
}

const relatedInfoSectionAnimation = function() {
    const $target = $('.related-info-sec')
        , $bg = $target.find('.bg')
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target)
    
    if(!isScreen) {
        if(ratio > -1) {
            let scaleValue = 1 + (1 - ratio) / 3;
            $bg.css('transform', 'scale('+ scaleValue +')');
        }
    }
}

// 고정 화살표 이동 버튼 클릭
const handelSecMoveBtnClick = function(e) {
    const $target = $(e.currentTarget);

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
            if($('.sec-wrap').hasClass('active') && $('.sec-wrap').hasClass('depth3')) {
                visualAnimation(3);
            }
        }, 1050);

        setTimeout(function() {
            if($('.sec-wrap').hasClass('active') && $('.sec-wrap').hasClass('depth3')) {
                visualAnimation(3);
            }
        }, 1100);
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

const textMotionAnimation = function() {
    const $texts = $('.aniObj');

    $texts.each(function(index, item) {
        if (isElemOverScreen(item, -20)) {
           $(item).removeClass('activeMotion')
        } else {
            $(item).addClass('activeMotion')
        }
    });
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