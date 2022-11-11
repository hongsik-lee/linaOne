$(document).ready(() => {

    $('header').hover(
        function() {
        },
        function() {
            $(this).removeClass('active');
            $(this).find('li.active').removeClass('active');
        }
    );

    $('.gnb > li').hover(
        function() {
            $('header').addClass('active');
            $(this).addClass('active').siblings().removeClass('active');
        }
    );

    $('#contents section').each((index, item) => {
        setScreenOverElem(item);
    });

    $('body').on('scroll', () => {
        const $target = $('#contents section.ani-obj').filter(':first')
        const yOffset = $('body').scrollTop();

        $('#contents section').each((index, item) => {
            setScreenOverElem(item);
        });
    
        backgroundDrakAnimation($target, yOffset);
        fadeInElemAnimation();

    });
});

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

const backgroundDrakAnimation = (elem, yOffset) => {
    const $target = $(elem)
        , scrollHeight = $(window).innerHeight()
        , prevScrollHeight = getPrevScrollHeight($target)
        , currentYOffset = yOffset - prevScrollHeight;
    
    // let allScrollRatio = 1 - ($('body').scrollTop() / ($(document).height() - $(window).height())) * 1 전체 비율
    let scrollRatio = parseFloat((currentYOffset / scrollHeight).toFixed(4), 10);

    if(scrollRatio >= 0 && scrollRatio <= 1) {
        $target.find('.dimmed').css('opacity', scrollRatio  - 0.2);
    }
}

const setScreenOverElem = (elem) => {
    let options = {
        threshold: 0
    }

    let observer = new IntersectionObserver((items) => {
        $(items).each((index, item) => {
            if(item.intersectionRatio > 0.3) {
                $(item.target).addClass('ani-obj');
            } else if(item.intersectionRatio === 0.0)  {
                $(item.target).removeClass('ani-obj');
            }
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
    const elems = $('.fadeIn');

    $(elems).each((index, item) => {
        if (isScreenUnderElem(item, -200)) {
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
    })
}