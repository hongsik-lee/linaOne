$(document).ready(function() {
    setSwipter();
    visualSectionAnimation();

    const playVideo = $('.visual-sec').find('video').get(0).play();

    if(playVideo !== undefined) {
        playVideo.then(function(_) {
            $('.visual-sec').find('video').get(0).pause();
        })
    }

    $(document).on('click', '.sec-move-btn', handelSecMoveBtnClick);

    const $secWrap  = $('.sec-wrap > div');
    $(window).on('scroll mousewheel touchmove', optimizeAnimation(function() {
        
        textMotionAnimation();
        changeControlStatus();
        foundation01SectionAnimation();
        foundation02SectionAnimation();
        foundation03SectionAnimation();
        foundation04SectionAnimation();
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

    setTimeout(function() {
        $visualSec.animate({
            'padding-top': (246 / 360 * 100).toFixed(4) - 1 + 'vw',
        }, 400);
        $videoInner.animate({
            'width' : (1138 / 360 * 100).toFixed(4) + 'vw',
        }, 400, function() {
            $contents.removeClass('fixed');
            $visualSec.find('video').get(0).play();
            textMotionAnimation();
        });
    }, 700);
}

const foundation01SectionAnimation = function() {
    const $target = $('.foundation01-sec')
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);

    if(!isScreen) {
        if(ratio > 0 && $target.find('.desc').hasClass('activeMotion')) {
            const timer = setTimeout(function() {
                $target.find('.img-wrap').addClass('activeMotion');
                $target.find('.circle02').addClass('activeMotion');
                $target.find('.line').addClass('activeMotion');

                clearTimeout(timer);
            }, 400);
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
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);
        
    if(!isScreen) {
        if(ratio > 0 && 1 - ratio > 0.2) {
            $bg.addClass('activeMotion');
        }
        
        if($bg.hasClass('activeMotion') && ratio < 0 && ratio > -1.5) {
            let scaleValue = 1.2 + Math.abs(ratio) / 5
            $bg.css({
                'transition': 'transform 1s ease',
                'transform': 'scale('+ scaleValue +')'
            });
        }
    } else {
        $bg.css({
            'transition': '',
            'transform': ''
        })
        $bg.removeClass('activeMotion');
    }
}

const foundation03SectionAnimation = function() {
    const $target = $('.foundation03-sec')
        , isScreen = isElemOverScreen($target)
        , ratio = getElemScrollRatio($target);

        if(!isScreen) {
        // [1222 수정] 해당 섹션에서 ratio 값 음수로 전환되기에 부등호 변경함 
        if(ratio < 0 && $target.find('.desc').hasClass('activeMotion')) {
            const timer = setTimeout(function() {
                $target.find('.img').addClass('activeMotion');
                $target.find('.circle').addClass('activeMotion');

                clearTimeout(timer);
            }, 400);
        }
    } else {
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
        if(ratio > 0 && 1 - ratio > 0.2) {
            $bg.addClass('activeMotion');
        }

        if($bg.hasClass('activeMotion') && ratio < 0 && ratio > -1.5) {
            let scaleValue = 1.2 + Math.abs(ratio) / 5
            $bg.css({
                'transition': 'transform 1s ease',
                'transform': 'scale('+ scaleValue +')'
            });
        }
    } else {
        $bg.css({
            'transition': '',
            'transform': ''
        })
        $bg.removeClass('activeMotion');
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
        let posTop = $('.sec-wrap').children().eq(1).offset().top;
        $('html, body').animate({ scrollTop : posTop }, 800);
    }

    if($target.hasClass('up')) {
        let posTop = $('.sec-wrap').children().eq(0).offset().top;
        $('html, body').animate({ scrollTop : posTop }, 800);
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
        $goTop.find('em').text('다음 section 이동');
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