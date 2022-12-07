
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

// header nav animation
const openNav = function() { $('#gnb-wrap').addClass(on); }
const closeNav = function() { $('#gnb-wrap').removeClass(on); }

// listbox click event
let oldListbox, newListbox;
const handelClickListbox = function(listbox, e) {
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
    }

    oldListbox = $listbox[0];
};

// listbox keyborad event
let keypressNum = 0;
const handleKeypressListboxList = function(listboxList, e) {
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

            break;
        case 27: // key exc
            $label.removeAttr('aria-expanded');
            $label.focus();
            $listbox.removeClass('active');

            break;
    }    
}

// listbox status change
const changeListboxStatus = function(target) {
    const $target = $(target)
        , $listboxList = $target.closest('ul')
        , $listbox = $listboxList.closest('.listbox-group')
        , $label = $listbox.find('.label');

    if(!$target.hasClass('focused')) {
        $listboxList.attr('aria-activedescendant', $(target).attr('class'));
    }

    $target.siblings().removeClass('focused').removeAttr('aria-selected');
    $target.addClass('focused').attr('aria-selected', 'true');
    $target.attr('tabindex', 0).focus();
    $target.removeAttr('tabindex');
    $listboxList.attr('tabindex', '-1').focus();

    $label.text($target.text());
}