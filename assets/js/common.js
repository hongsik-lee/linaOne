$(document).ready(() => {
    $('header').css('left', -($(window).innerWidth() - $('body').width()));
    $('.lnb-blur-bg').css('left', -($(window).innerWidth() - $('body').width()));

    $('header').hover(
        function() {
            
        },
        function() {
            $(this).removeClass('active');
            $(this).find('li.active').removeClass('active');
            $('.lnb-blur-bg').removeClass('active');
        }
    );

    $('.gnb > li').hover(
        function() {
            $('header').addClass('active');
            $('.lnb-blur-bg').addClass('active');
            $(this).addClass('active').siblings().removeClass('active');
        }
    );

    $('#contents section').each((index, item) => {
        setScreenOverElem(item);
    });

    document.body.addEventListener(
        "scroll",
        optimizeAnimation(() => {
            yOffset = $('body').scrollTop();

            $('#contents section').each((index, item) => {
                setScreenOverElem(item, yOffset);
            });

            textFadeoutAnimation();
            fadeInElemAnimation();
        }),
        { passive: true }
    );
});

let yOffset = 0;
const getPrevScrollHeight = (elem) => {
    let prevScrollHeight = 0;
    const $target = elem
        , targetPrevAll = $target.prevAll();

    for(let i = 0; i < targetPrevAll.length; i++) { 
        let $prev = $(targetPrevAll[i]);
        prevScrollHeight += $prev.prop('scrollHeight');
    }

    return prevScrollHeight;
}

const getElemScrollRatio = (elem) => {
    const $target = elem
        , scrollHeight = $(window).innerHeight()
        , prevScrollHeight = getPrevScrollHeight($target)
        , currentYOffset = yOffset - prevScrollHeight;

    return parseFloat((currentYOffset / scrollHeight).toFixed(4), 10);
}

const backgroundDrakAnimation = (item) => {
    const $target = $(item.target)
        , scrollRatio = getElemScrollRatio($target);

    if(scrollRatio <= 0.3) {
        if(item.intersectionRatio > 0.1) $target.find('.dimmed').css('opacity', 0.9);
        if(item.intersectionRatio > 0.2) $target.find('.dimmed').css('opacity', 0.7);
        if(item.intersectionRatio > 0.3) $target.find('.dimmed').css('opacity', 0.5);
        if(item.intersectionRatio > 0.4) $target.find('.dimmed').css('opacity', 0.3);
        if(item.intersectionRatio > 0.5) $target.find('.dimmed').css('opacity', 0);
    }
}

const textFadeoutAnimation = (elem) => {
    const $target = $('#contents section.ani-obj').filter(':first')
        , scrollRatio = getElemScrollRatio($target);

    if(scrollRatio > 0 && scrollRatio < 1) {
        if($target.hasClass('intro-sec') || $target.hasClass('visual-sec')) {
            $target.find('.page-tit').css('opacity', 1 - scrollRatio);
            $target.find('.tit').css('opacity', 1 - scrollRatio);
            $target.find('.text-area').css('opacity', 1- scrollRatio);
        }
    }
}

const setScreenOverElem = (elem) => {
    let options = { rootMargin: '200px', threshold: 0 }
    let observer = new IntersectionObserver((items) => {
        $(items).each((index, item) => {

            if(item.isIntersecting) {
                backgroundDrakAnimation(item);
            }

            if(item.intersectionRatio === 0.0)  {
                $(item.target).removeClass('ani-obj');
            } else if(item.intersectionRatio > 0.3) {
                $(item.target).addClass('ani-obj');
            }

            observer.unobserve(item.target);
        });
    }, options);

    $(elem).each((index, item) => {
        observer.observe(item)
    });
}

const isScreenUnderElem = (elem, triggerDiff) => {
    const top = $(elem).get(0).getBoundingClientRect().top
        , innerHeight = $(window).innerHeight();

    return top > innerHeight + (triggerDiff || 0);
}

const fadeInElemAnimation = () => {
    const $elems = $('.fadeIn');

    $elems.each((index, item) => {
        if (isScreenUnderElem(item, -150)) {
            $(item).css({
                'opacity': 0,
                'transform': 'translateY(150px)'
            });
        } else {
            $(item).css({
                'opacity': 1,
                'transform': 'translateY(0)'
            });
        }
    });
}

function optimizeAnimation(callback) {
    let ticking = false;

    return () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                callback();

                ticking = false;
            });
        }
    };
}