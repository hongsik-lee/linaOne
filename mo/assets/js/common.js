
$(document).ready(function() {
    $(document).on('click', '.popup-close-btn', windowClose);

    $('.listbox-group').each(function(index, item) {
        $(item).on('click', function(e) {
            handelClickListbox($(this), e);
        });
    });

    $(document).on('keydown', '.listbox-list', function(e) {
        e.preventDefault();
        handleKeypressListboxList($(this), e);
    });

    $(document).on('click', '.nav > li', function(e) {
        $(this).toggleClass('active').find('.sub-nav').slideToggle(400);
        $(this).siblings('li').removeClass('active').find('.sub-nav').slideUp(400);
    });
    
    // 컨텐츠 scroll 공통 효과
    AOS.init({
        easing: 'linear',
        duration:500
    });
    onElementHeightChange(document.body, function(){
        AOS.refresh();
    });

    // scroll button 공통 효과 *추후 업데이트예정입니다
    let scrollStatus = 0;
    let btnDown = $('.btn-down');
    let btnUp = $('.btn-up')

    $(window).on('scroll', function(){
        let scrollTop = $(this).scrollTop();
        console.log(scrollTop)
        if(scrollTop === 0){
            btnDown.stop().fadeIn()
        }else if(scrollStatus > 50){
            btnDown.stop().fadeOut()
        }else{
        }
        scrollStatus = scrollTop
    })

    $(document).on('load', function(){
        let scrollTop = $('.sub-wrap').scrollTop();
        if(scrollTop !== 0){
            btnDown.hide()
        }
    })
});

function scrollToTop(){
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
}
function scrollToTarget(){
    let content = document.querySelector('.content')
    // window.scrollTo({left:0, top:Position(content), behavior: "smooth"} )
    window.scrollTo({left:0, top:600, behavior: "smooth"} )

}

function Position(obj){
    var currenttop = 0;
    if (obj.offsetParent){
     do {
      currenttop += obj.offsetTop - 60;
    }while ((obj = obj.offsetParent));
     return [currenttop];
    }
}

const onElementHeightChange = function(elm, callback) {
    let lastHeight = elm.clientHeight
    let newHeight;
    
    (function run() {
        newHeight = elm.clientHeight;
        if (lastHeight !== newHeight) callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer) {
          clearTimeout(elm.onElementHeightChangeTimer); 
        }

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}
// header nav animation
const openNav = function() {
    $('#gnb-wrap').addClass('on');
}

const closeNav = function() { 
    $('#gnb-wrap').removeClass('on');

    const $navLis = $('.nav > li');
    setTimeout(function() {
        $navLis.each(function(index, item) {
            $(item).removeClass('active').find('.sub-nav').css('display', 'none');
        });
    }, 300);
 }

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

// 창 닫기 
const windowClose = function() {
    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera
        , type = checkMobile();

    if (type === 'kakaotalk') { 
        window.location.href = (/iPad|iPhone|iPod/.test(userAgent)) ? 'kakaoweb://closeBrowser': 'kakaotalk://inappbrowser/close';
    } else if(type === 'ios'){ 
        window.open('', '_self', '');
        window.close();
    } else {
        window.open('about:blank', '_self').self.close();
    }
}

// 기기구분
const checkMobile = function() {
	const userAgent = navigator.userAgent.toLowerCase(); 

    if (userAgent.indexOf('kakaotalk') > -1) {
        return "kakaotalk";
    } else if (userAgent.indexOf('android') > -1) {
        return "android";
    } else if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1 ) {
        return "ios";
    } else {
        return "other";
    }
}

// Tab 
$(document).ready(function(){
    var $tabTitle = $('.tab-title');
    var $subTabTitle = $('.sub-tab-title');
    var $cont = $('.content');
    var $subCont = $('.sub-content');
   
    $cont.hide().eq(0).show();
    $subCont.hide().eq(0).show();

    $tabTitle.click(function(e){
        var idx = $(this).index();
        $tabTitle.removeClass('active');
        $(this).addClass('active');
        $cont.hide().eq(idx).show();


        if( $tabTitle.length-1 == idx){
            $tabTitle.parent('ul').animate({
                scrollLeft:$(this).offset().left + 100
            }, 1000)
        }else if (idx == 0){
            $tabTitle.parent('ul').animate({
                scrollLeft:$(this).offset().left + 0
            }, 500)
        }
        if($(e.target).hasClass('clicked')) {
            $('.sub-slide-tab').find('[data-filter="all"]').trigger('click');
        }

    })

    $subTabTitle.click(function(){
        var idx = $(this).index();
        $subTabTitle.removeClass('active');
        $(this).addClass('active');
        $subCont.hide().eq(idx).show();

        if( $subTabTitle.length-1 == idx){
            $subTabTitle.parent('ul').animate({
                scrollLeft:$(this).offset().left + 100
            }, 1000)
        }else if (idx == 0){
            $subTabTitle.parent('ul').animate({
                scrollLeft:$(this).offset().left + 0
            }, 500)
        }
        
    })
})

$(window).on('load',function(){
    let $visual = $('.visual');
    $visual.addClass('active').find('h1').addClass('active');
 
})

// 채용절차 자주하는질문 filter 
$(document).on('click', '#recruitStep', function(e) {
    handleRecruitStepClick(e);
});

const handleRecruitStepClick = function(e) {
    const $target = $(e.target)
            , targetName = e.target.nodeName
            , dataFilter = $target.data('filter')
            , $accor = $('.recruit-sec04').find('.acc-wrap')
            , texts = recruitStepTexts;

        if(targetName === 'LI') {
            let filtered, contents;

            if(dataFilter === 'all') {
                contents = texts.map(function(item) { return recruitStepHTMLString(item) }).join('');
            } else {
                filtered = texts.filter(function(item) { return item['category'] === dataFilter });

                if(filtered.length > 0) {
                    contents = filtered.map(function(item) { return recruitStepHTMLString(item) }).join('');
                } else {
                    let category = { 'select1': '지원 이전',  'select2': '지원서 작성', 'select3': '지원 이후' }
                    let html = '';
                        html += '<li class="filter-item empty" data-category="'+dataFilter +'">';
                        html +=     '<div class="txt">';
                        html +=         '<span class="category">'+ category[dataFilter] +'</span>';
                        html +=         '<p class="title">등록된 게시물이 없습니다.</p>';
                        html +=     '</div>';
                        html += '</li>';

                    contents = html;
                }
            }

            $accor.html(contents);
        }
    }
const recruitStepHTMLString = function(item) {
    let category = { 'select1': '지원 이전',  'select2': '지원서 작성', 'select3': '지원 이후' }
    let html = '';
        html += '<li class="filter-item" data-category="'+ item.category +'">';
        html +=     '<div class="txt acc_tit_area">';
        html +=         '<span class="category">'+ category[item.category] +'</span>';
        html +=         '<p class="title">'+ item.title +'</p>';
        html +=     '</div>';
        html +=     '<div class="cont">' + item.desc + '</div>';
        html += '</li>';
            
    return html;
}
const recruitStepTexts = [
    {
        category: "select1",
        title: "라이나원 직원 인재채용에 지원하고 싶습니다. 어떻게 해야하나요?",
        desc: "상단 ‘채용 절차’에서 365일 24시간 언제든지 지원 가능합니다. 서류작성 > 1차인터뷰 > 2차인터뷰 > 고용심사 > 처우협상 > 최종합격 순서로 진행됩니다. 경력 및 고용 형태에 따라 채용 절차가 추가되거나 생략될 수 있습니다. 인터뷰는 대면 또는 비대면으로 진행되며, 비대면 면접 진행 시 별도의 화상미팅 Tool에 접속하거나 모바일 앱설치가 필요합니다."
    },
];
// TMR 채용절차 자주하는 질문 filter

$(document).on('click', '#tmrRecruitStep', function(e) {
    handleTmrRecruitStepClick(e);
});

const handleTmrRecruitStepClick = function(e) {
const $target = $(e.target)
    , targetName = e.target.nodeName
    , dataFilter = $target.data('filter')
    , $accor = $('.trm-recruit-sec03').find('.acc-wrap')
    , texts = tmrRecruitTexts;
    if(targetName === 'LI') {
        let filtered, contents;

        if(dataFilter === 'all') {
            contents = texts.map(function(item) { return recruitStepHTMLString(item) }).join('');
        } else {
            filtered = texts.filter(function(item) { return item['category'] === dataFilter });

            if(filtered.length > 0) {
                contents = filtered.map(function(item) { return recruitStepHTMLString(item) }).join('');
            } else {
                let category = { 'select1': '지원 이전',  'select2': '지원서 작성', 'select3': '지원 이후' }
                let html = '';
                    html += '<li class="filter-item empty" data-category="'+ dataFilter +'">';
                    html +=     '<div class="txt">';
                    html +=         '<span class="category">'+ category[dataFilter] +'</span>';
                    html +=         '<h3 class="title">등록된 게시물이 없습니다.</h3>';
                    html +=     '</div>';
                    html += '</li>';

                contents = html;
            }
        }

        $accor.html(contents);
    }
}        

const tmrRecruitTexts = [
    {
        category: "select1",
        title: "라이나생명 TMR에 지원하고 싶습니다. 어떻게 해야 하나요?",
        desc: "상단 ‘지원서 작성하기’에서 365일 24시간 언제든지 지원 가능합니다. 위촉지원서작성 > 성향분속검사 > 설문조사 > 최종제출 순서로 진행되며, 최종제출 지원서에 한하여 추가 안내를 드립니다."
    },
    {
        category: "select1",
        title: "신입 TMR과 경력 TMR의 차이는 무엇인가요?",
        desc: "경력TMR은 보험TM영업 경력이 일정기간 이상 충족되어야 가능하며, 신입TMR은 경력이 없어도 지원 가능합니다."
    },
    {
        category: "select1",
        title: "보험TM영업경력은 없지만, 타업종 콜센터에서 콜을 해본 적이 있습니다.",
        desc: "보험TM이 아니어도 콜 경력을 우대하여 드리는 '보험 TM 외 경력 우대' 제도가 따로 마련되어 있습니다. 해당 경력에 대한 증빙서류를 면접 시 제출하면 인정받을 수 있으니 자세한 기준은 유선으로 문의부탁드립니다. (지원 희망 시, 신입TMR 모집 공고에 위촉지원서 등록)"
    },
    {
        category: "select2",
        title: "지원서 작성 시 홈페이지에 가입해야 하나요?",
        desc: "아니요. 홈페이지 가입 없이 지원서 작성 가능합니다. 상단의 '지원서 작성하기' 메뉴를 이용해주세요."
    },
    {
        category: "select2",
        title: "이력 사항을 잘못 적은 것 같아서 수정하고 싶습니다.",
        desc: "지원 확인 및 수정 메뉴에서 이력서 수정이 가능합니다. 최종 제출 이후에는 직접 수정이 불가하오니 아래 연락처로 요청하여 주시기 바랍니다. TMR 리쿠르팅 통합 전담센터 1577-3731"
    },
    {
        category: "select2",
        title: "이력서 저장 버튼을 눌렀으나 세션이 만료되었다고 나옵니다.",
        desc: "작성하시는 이력서는 개인정보를 포함하기 때문에 일정 시간이 지나면 초기화가 됩니다. 이력서 작성 중에는 반드시 '임시 저장'을 해주셔야 하며, 작성 완료 시 '이력서 저장' 버튼을 누르고 다음 단계로 넘어가시면 됩니다."
    },
    {
        category: "select3",
        title: "TMR 면접 일정이 어떻게 되나요?",
        desc: "지원서 접수 후 3영업일 이내 면접일정에 대한 안내가 진행되며, 안내일정에 따라 지원한 당월 중 면접을 진행하시게 됩니다. 지원한 희망지역 및 센터에 따라 면접 일정은 다를 수 있으나 지원한 당월 내에 모든 면접 진행과 결과 안내가 완료됩니다.<br>위촉지원서를 등록했으나 5영업일 후에도 일정 안내를 받지 못하신 경우나 면접 관련 일정변경 등의 문의가 있으신 경우는 TMR 지원안내 대표번호로 문의하여 주시기 바랍니다. 대표번호 1577-3731"
    },
    {
        category: "select3",
        title: "면접 결과 확인은 어떻게 하나요?",
        desc: "온라인 사이트를 통해 지원여부를 다시 확인할 수 있으며, 면접결과는 면접이 진행된 센터나 지원자 분의 추천자를 통하여 안내드리고 있습니다. (온라인 사이트 확인방법: 온라인 지원서 작성 시 입력한 지원정보로 로그인 후 확인)"
    },
    {
        category: "select3",
        title: "신입TMR 교육 일정이 궁금합니다.",
        desc: "신입을 위한 집중 집합교육 과정으로 매월 초 시작하여 4주(월~금, 주5일)동안 운영하며, 교육 시간은 본부에 따라 다소 차이가 있습니다."
    },
    {
        category: "select3",
        title: "경력TMR 교육 일정이 궁금합니다.",
        desc: "라이나 경력위촉은 월 2회 진행(4영업일, 매월 11일) 하며, 위촉 하기 전에 3영업일간 온라인 필수교육이 진행됩니다.<br>위촉 후에는 센터 자체교육과 라이나 전문교육담당자 분들이 진행하시는 초기 6개월간 필수교육으로 보험관련 교육을 지원받으실 수 있습니다."
    },
    {
        category: "select3",
        title: "교육비가 있나요?",
        desc: "라이나에 위촉하시는 모든 분들께 교육 수료 시 실비 120만원을 지원하고 있습니다.<br>(신입 및 보험외 경력자: 교육 당월 말일 교육실비 지급일 / 보험경력자: 위촉 시점에 따라 매월 3영업일 또는 10일)"
    },
    {
        category: "select3",
        title: "TMR 수당 체계를 알고 싶습니다.",
        desc: "라이나에 위촉하는 전원에게 교육비 지급(120만원, 실적무관, 교육수료 시)하며, 채널에 따라 최대 18차월 초기정착지원수당을 적용하고 있습니다.<br>이외 라이나 생명의 강력한 영업시스템 지원, 교육지원 등이 있으며 세부적인 수당체계 및 복리후생 혜택은 입과 또는 위촉 후 보다 자세하게 안내 받으실 수 있습니다."
    },
];
    
// 아코디언
$(document).on('click', '.acc_tit_area', function(e) {
    e.preventDefault();
    handleAccTitAreaClick($(this));
});
// 아코디언 공통 스크립트
const handleAccTitAreaClick = function(item) {
    const $target = $(item)
        , $accorActive = $('.acc-active');
    
    if($target.hasClass('acc-active')) {
        $target.removeClass('acc-active');
    } else {
        $accorActive.each(function(index, item) {
            $(item).removeClass('acc-active');
        });
        $target.addClass('acc-active');
    }
}
// overview 숫자 counting animation 
$(window).scroll(function () {
    const $counters = $(".counter");
    if($counters.length > 0) {

        $counters.each(function(index, item) {
            const counterTop = $(item).offset().top - window.innerHeight;

            if ($(window).scrollTop() > counterTop) {
                const $countNum = $(item).find('.count-num');

                $countNum.each((index, elem) => {
                    if(!$(elem).hasClass('count-finished')) {
                        increaseNumberAnimation(elem, 1000);
                    }
                });
            }
        });
    }
});
// OVERVIEW 숫자 카운팅 에니메이션
const increaseNumberAnimation = function(elem, duration) {
    let startTimeStamp;
    const $target = $(elem)
        , start = $target.data('start-count')
        , end = $target.data('end-count')
        , type = $target.data('type')

    $target.addClass('count-finished');
    const step = (timestamp) => {
        if (!startTimeStamp) startTimeStamp = timestamp;
        const progress = Math.min((timestamp - startTimeStamp) / duration);
        let value;

        if(type === 'reverse') {
            value = Math.floor(progress * (end - start) + start);

            if(value > end) $target.text(setNumberComma(value));
            else $target.text(setNumberComma(end));
        } else {
            value = Math.floor(progress * (end - start) + start);

            if(type === 'percent') {
                if(value > end) $target.text(setPercentComma(end));
                else $target.text(setPercentComma(value));
            } else {
                if(value > end) $target.text(setNumberComma(end));
                else $target.text(setNumberComma(value));
            }
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
};

const setNumberComma = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const setPercentComma = function(num) {
    return num.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ".");
}