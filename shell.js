jQuery(document).ready(function ($) {
    CurSlide = 1;
    CurSection = 1;
    var slideNoDiv = $('div.slidecount');
    var divnext = $('div.next');
    var divprev = $('div.prev'),
            corejs = '<script src="assets/JS/core.js" type="text/javascript"></script>',
            wrap = $('div.innerwrap'),
            preloader = $('div.preloader').css({'left': '0%'}),
            nextprevmenu = $('div.nextprev, div.menu'),
            sequential = true,
            module = $('div.module'),
            sectiontitle = $('div.sectiontitle'),
            menu = $('div.menu'),
            cover2 = $('.cover2'),
            close_but = $('.close_but'),
            doneSlideTriger = 0;

//main ajax function that makes all calls
    Ajax = function (url, datatype) {
        return $.ajax({
            beforeSend: function () {

            },
            url: url,
            async: true,
            type: 'get',
            dataType: datatype || 'html',
            cache: false
        }).always(function () {
            // remove loading image maybe
            stopedge();
            doneSlideTriger = 0;
        }).fail(function () {
            alert('Ajax failed');
        });
    };


    $('.menuslides ul').jScrollPane({
        showArrows: true,
//        animateScroll: true,
//        animateEase: "easeInOutCubic",
        verticalDragMinHeight: 60,
        verticalDragMaxHeight: 300
    });

    $(".menuslides").hide();
    $("#tab-1").show();
    $(".modules a").click(function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.parent().addClass("current");
        $this.parent().siblings().removeClass("current");
        var tab = $this.attr("href");
        $(".menuslides").not(tab).css("display", "none");
        $(tab).fadeIn();
    });


//get xml config 
    Ajax('config.xml', 'xml').done(function (data) {
        TotalSections = $(data).find('section');
        
        
        

        $('.coursetitle').text($(data).find('coursetitle').text());

        MainArr = [];
        TotalSections.each(function (i) {
            var outerObj = {
                visited: false,
                locked: true
            };
            MainArr[i] = outerObj;

            $(this).find('slidedata').each(function (j) {
                var innerObj = {
                    visited: false
                };
                MainArr[i][j] = innerObj;
            });
        });
    });

//call next/prev slide with ajax and show preloder + slide transition
    animateSlideNext = function (url, datatype) {
        preloader.animate({'left': '0%'}, 100);
        wrap.animate({'left': '100%'}, 100, "easeInOutBack", function () {
            $(this).children().empty().remove();
            $.when(Ajax(url, datatype)).then(function (data) {
                wrap.append(data, corejs).animate({'left': '0'}, 600, "easeInOutBack");
                preloader.animate({'left': '-120%'});
            });
        });
    };

    RunSuspendData = function () {
        var suspendData = "";
        $(MainArr).each(function (i) {
            var temp;
            $.map(MainArr[i], function (val, j) {
                if (val['visited'] === true) {
                    temp = i + ":" + j;
                }
            });
            if (typeof temp !== 'undefined') {
                suspendData += temp + ",";
            }
        });
    };

    function setCurrent(dir) {
        skidesInSection = (TotalSections.eq(CurSection - 1).find('slidedata').length);
        var x = skidesInSection + 1;

        //check witch direction has been pressed if next add 1 else -1
        CurSlide += (~~(dir === 'next') || -1);
        //this check is done to determinate if you are on the last or not if last go to 0
        CurSlide = (CurSlide < 0) ? x - 1 : CurSlide % x;
        //if 0 go to section menu else continue
        if (CurSlide === 0) {
            divprev.hide();
            slideNoDiv.hide();
            CurSlide++;
            animateSlideNext("sectionmenu.html");
        } else if (CurSlide === 1) {
            divprev.hide();
            animateSlideNext('section' + CurSection + '/' + CurSlide + "/Index.html");
        } else {
            divprev.show();
            animateSlideNext('section' + CurSection + '/' + CurSlide + "/Index.html");
        }
    }

    divprev.click(function (e) {
        var $this = $(this);
        if ($this.hasClass('clicked')) {
            return;
        } else {
            $this.addClass('clicked').css({"opacity": 0.4, "cursor": "default"});

            setCurrent('prev');
            setCurrSlideInSection();

            setTimeout(function () {
                $this.removeClass('clicked').css({"opacity": 1, "cursor": "pointer"});
            }, 2000);
        }
    });

//    function stopedge() {
//        AdobeEdge.bootstrapCallback(function (compId) {
//            AdobeEdge.getComposition(compId).stage.stopAll();
//        });
//    }
//    

    function stopedge() {
        if (typeof AdobeEdge !== 'undefined') {
            if (AdobeEdge !== null) {
                AdobeEdge = null;
            }
        }
//        if (AdobeEdge !== null)
//        AdobeEdge.bootstrapCallback(function (compId) {
//            AdobeEdge.getComposition(compId).stage.stopAll();
//            AdobeEdge = null
//        });
    }


//ajax init
    animateSlideNext("intro.html");

//this function always runs on next/prev 
    setCurrSlideInSection = function () {
        //var curentslidetytle = TotalSections.eq(CurSection - 1).find('slidedata').eq(CurSlide - 1).find('title').text();
        var totalSlideinSec = TotalSections.eq(CurSection - 1).find('slidedata').length;
        sectiontitle.text(TotalSections.eq(CurSection - 1).find('sectiontitle').text());
        module.text('Module ' + CurSection);
        divnext.removeClass('hover').off('click').css({"opacity": 0.4, "cursor": "default"});
        slideNoDiv.html('Page ' + CurSlide + ' / ' + totalSlideinSec);
        RunSuspendData();
    };

    donewithsection = function (index) {
//check if sequential or not 
        if (sequential === true) {
            if (MainArr[index - 1]['locked'] !== true) {
                CurSection = index;
                MainArr[CurSection - 1]['visited'] = true;
                animateSlideNext("section" + CurSection + "/1/Index.html");
                nextprevmenu.show();
                slideNoDiv.show();

                setCurrSlideInSection();
                divnext.show();
                if (CurSection < TotalSections.length) {
                    MainArr[CurSection]['locked'] = false;
                }
            }
        } else {
//            MainArr[index]['visited'] = true;
//            animateSlideNext("section" + (index) + "/1/Index.html");
        }
    };

    donewithslide = function () {
        if (doneSlideTriger === 0) {
            MainArr[CurSection - 1][CurSlide - 1]['visited'] = true;
            divnext.addClass('hover').css({"opacity": 1, "cursor": "pointer"}).on('click', function () {
                stopedge();
                setCurrent('next');
                setCurrSlideInSection();
                $(this).off('click');
            });
            doneSlideTriger = 1;
        }
    };

//section menu 
    menu.on('click', function () {
        var $this = $(this);
        if ($this.hasClass('active')) {
            $this.removeClass('active');
            cover2.animate({'top': '100%'}, 600, "easeInOutBack");
        } else {
            $this.addClass('active');
            cover2.animate({'top': 75}, 600, "easeInOutBack");
        }
    });

    close_but.on('click', function () {
        menu.removeClass('active');
        cover2.animate({'top': '100%'}, 600, "easeInOutBack");
    });

// menu hover animation
//    $('.menu ul li').each(function () {
//        var obj = $(this);
//        obj.mouseenter(function () {
//            obj.stop().animate({'padding-top': 40}, 200, "easeInOutBack", function () {
//                obj.stop().toggleClass('EYyellow').animate({'padding-top': 10}, 100);
//            });
//        }).mouseleave(function () {
//            obj.stop().animate({'padding-top': 40}, 300, "easeInOutBack", function () {
//                obj.stop().removeClass('EYyellow').animate({'padding-top': 10}, 200);
//            });
//        });
//    });

//mobile detection
    var deviceAgent = navigator.userAgent.toLowerCase();
    var isTouchDevice = ('ontouchstart' in document.documentElement) &&
            (deviceAgent.match(/(iphone|ipod|ipad)/) ||
                    deviceAgent.match(/(android)/) ||
                    deviceAgent.match(/(iemobile)/) ||
                    deviceAgent.match(/iphone/i) ||
                    deviceAgent.match(/ipad/i) ||
                    deviceAgent.match(/ipod/i) ||
                    deviceAgent.match(/blackberry/i) ||
                    deviceAgent.match(/bada/i));
    if (isTouchDevice) {
        $('html').addClass('mobile');
    } else {
        $('html').addClass('notmobile');
    }
    $('.content').height($('body').height - 140);

//center slide vertically
    var content = $('.wrapper');
    var paddingtop = (($(window).height() - content.height()) / 2);
    content.css('padding-top', paddingtop);

    $(window).on("resize load", function () {
        var content = $('.wrapper');
        var paddingtop = (($(window).height() - content.height()) / 2);

//        $('.innerwrap').height($(window).height() - 125);

        if (paddingtop > 0) {
            content.css('padding-top', paddingtop);
        } else {
            content.css('padding-top', 0);
        }
    }
    );
});
