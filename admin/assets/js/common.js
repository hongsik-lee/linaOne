
function showModal(target) {
    const $target = $(target)
        , controlsId = $target.attr('aria-controls')
        , $modal = $('[id="'+ controlsId +'"]');

    if(!$modal.hasClass('show')) {
        $modal.addClass('show');
        $modal.attr('aria-modal', 'true');
        $modal.removeAttr('aria-hidden');

        setBodyFixedToggle('fixed');
    }
}

function hideModal(target) {
    const $target = $(target)
        , $modal = $target.closest('.modal');

    if($modal.hasClass('show')) {
        $modal.removeClass('show');
        $modal.attr('aria-hidden', 'true');
        $modal.removeAttr('aria-modal');

        setBodyFixedToggle('unfixed');
    }
}


function setBodyFixedToggle(condition) {
    const $body = $('body')
        , $wrap = $('#wrap')
        , windowScrollWidth = window.innerWidth - document.body.clientWidth
        
    if(condition === 'fixed') {
        $body.css({'overflow':'hidden', 'padding-right':windowScrollWidth});
        $body.addClass('body-fixed');
        $wrap.attr('inert', 'true');
    } else if(condition === 'unfixed') {
        $body.attr('style', '');
        $body.removeClass('body-fixed');
        $wrap.removeAttr('inert');
    }
}