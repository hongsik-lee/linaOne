
$(document).ready(function() {

    $(document).on('click', '.popup-close-btn', function() {

    });

    $('.listbox-group').each(function(index, item) {
        $(item).on('click', function(e) {
            handelClickListbox($(this), e);
        });
    });

    $(document).on('keydown', '.listbox-list', function(e) {
        e.preventDefault();
        handleKeypressListboxList($(this), e);
    });
});


let oldListbox, newListbox;
function handelClickListbox(listbox, e) {
    const $listbox = $(listbox)
        , $label = $listbox.find('.label')
        , target = e.target
        , targetName = target.nodeName;

    newListbox = $listbox[0];
    if(oldListbox !== newListbox) {
        $('.listbox-group.active').find('.label').removeAttr('aria-expanded');
        $('.listbox-group.active').removeClass('active');
    }

    if(targetName == 'BUTTON') {
        if(!$listbox.hasClass('active')) {
            $listbox.addClass('active');
            $listbox.find('.listbox-list').attr('tabindex', '-1').focus();
            $label.attr('aria-expanded', 'true');
        } else {
            $listbox.removeClass('active');
            $label.removeAttr('aria-expanded');
        }
    }

    if(targetName == 'LI') {
        changeListboxStatus($(target))

        $label.removeAttr('aria-expanded');
        $listbox.removeClass('active');

        // 조건 충족시 추가 입력 필드 출력
        if($listbox.hasClass('condition')){
            showListBoxDetail(e, '1depth');
        } else if($listbox.hasClass('condition2')){
            showListBoxDetail(e, '2depth');
        }
    }

    oldListbox = $listbox[0];
};

let keypressNum = 0;
function handleKeypressListboxList(listboxList, e) {
    let target;
    const $listboxList = $(listboxList)
        , $listbox = $listboxList.closest('.listbox-group')
        , $label = $listbox.find('.label')
        , listLen = $listboxList.children().length;
    
    switch(e.keyCode){
        case 40: // key down
            if($listbox.find('.focused').length > 0) {
                keypressNum = $listbox.find('.focused').index() + 1;
                target = $listboxList.children().eq(keypressNum);
            } else {
                keypressNum++;
                target = $listboxList.children().eq(keypressNum - 1);
            }

            if(keypressNum === listLen) target = $listboxList.children().eq(0);
    
            changeListboxStatus(target);
            break;
        case 38: // key up
            if(keypressNum < 0) keypressNum = listLen - 1;

            if($listbox.find('.focused').length > 0) {
                keypressNum = $listbox.find('.focused').index() - 1;
                target = $listboxList.children().eq(keypressNum);
            } else {
                keypressNum--;
                target = $listboxList.children().eq(keypressNum);
            }

            changeListboxStatus(target);
            break;
        case 13: // key enter
            $label.removeAttr('aria-expanded');
            $label.focus();
            $listbox.removeClass('active');

            // 조건 충족시 추가 입력 필드 출력
            if($listbox.hasClass('condition')){
                showListBoxDetail($listbox.find('.focused'), '1depth');
            } else if($listbox.hasClass('condition2')){
                showListBoxDetail($listbox.find('.focused'), '2depth');
            }
            
            break;
        case 27: // key exc
            $label.removeAttr('aria-expanded');
            $label.focus();
            $listbox.removeClass('active');

            break;
    }    
}

// header nav animation
function openNav(){
    document.getElementById('gnb-wrap').classList.add('on')
}

function closeNav(){
    document.getElementById('gnb-wrap').classList.remove('on')
}