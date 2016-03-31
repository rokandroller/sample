//custom methods starts

function intro() {
    var video = $('video');
    var skipp = $('.skip');
    var decline = $('.decline');
    var cover = $('.cover').fadeToggle();
    var agreem = $('.useragreement');
    var accept = $('.accept');
    var vidH = video.height();
    var content = $('.content');
    var contW = content.width();
    var contH = 10 + content.height();

    (vidH < contH) ? video.height(contH) : video.width(contW);

    skipp.on('click', function () {
        video.fadeToggle().get(0).pause();
        skipp.fadeToggle(agreement);
    });
    video.bind('ended', function () {
        video.fadeToggle();
        skipp.fadeToggle(agreement);
    });
    decline.on('click', function () {
        video.fadeToggle().get(0).play();
        skipp.fadeToggle();
        cover.fadeToggle();
        agreem.fadeToggle();
    });
    accept.on('click', function () {
        agreem.animate({
            right: '200%',
            opacity: '0'
        }, 800, "easeInOutBack", function () {
            cover.fadeToggle();
            animateSlideNext("sectionmenu.html");
        });
    });

    function agreement() {
        cover.fadeIn();
        agreem.show().animate({
            right: '20%',
            opacity: '1'
        }, 800, "easeInOutBack");
    }
}
function sectionmenu() {
    var divnext = $('div.next');
    var slideNoDiv = $('div.slidecount');

    slideNoDiv.hide();
    divnext.hide();
    MainArr[0]['locked'] = false;
    // $('.title').text('Section menu');
    var i = 0;
    $(MainArr).each(function () {
        if (MainArr[i]['visited'] === true) {
            $('.sectionmenu').eq(i).addClass('sectiondone');
        } else if (MainArr[i]['locked'] === true) {
            $('.sectionmenu').eq(i).addClass('locked');
        }
        i++;
    });
    MainArr[0]['visited'] = true;
    $('div.sectionmenu').on('click', function () {
        var index = 1 + ($('div.sectionmenu').index(this));
        donewithsection(index);
    });
}
function mouseovertooltip() {
    $.when(
            $(this).show().children().each(function (i) {
        $(this).css({"left": 400, "opacity": 0, 'position': 'relative'}).delay((i++) * 200)
                .animate({
                    left: 0,
                    opacity: 1
                }, 800, "easeInOutBack");
    })).done(function () {

        $('.tooltip').tooltip({
            position: {
                within: ".content"
            },
            track: true
        });
        OnAnimDone();
    });
}
function animatedlist() {
    var fired = 0;
    $.when(
            $(this).show().children().each(function (i) {
        $(this).css({"left": 1000, "opacity": 0, 'position': 'relative'}).delay((i++) * 400)
                .animate({
                    left: 0,
                    opacity: 1
                }, 800, "easeInOutBack");
    })).done(function () {
        if (fired === 0) {
            OnAnimDone();
        }
        fired++;
    });
}
function animatedlist2() {
    $.when(
            $(this).show().children().each(function (i) {
        $(this).css({"left": 500, "opacity": 0, 'position': 'relative'}).delay((i++) * 500)
                .animate({
                    left: 0,
                    opacity: 1
                }, 1000, "easeInOutBack");
    })).done(function () {
        OnAnimDone();
    });
}
function animatedlist3() {
    $.when(
            $(this).show().children().each(function (i) {
        $(this).css({"left": 500, "opacity": 0, 'position': 'relative'}).delay((i++) * 1000)
                .animate({
                    left: 0,
                    opacity: 1
                }, 800, "easeInOutBack");
    })).done(function () {
        OnAnimDone();
    });
}
function clickPopup() {

    $(this).show();
    var arr = [];
    var x = 0;
    var fired = 0;
    $(this).children().each(function () {
        arr.push({fun: $(this)});
    });

    function Run(x) {
        var obj = arr[x].fun;
        fun(obj);
    }

    function clikDone() {
        x++;
        if (x < arr.length - 1) {
            Run(x);
        } else {
            if (fired === 0) {
                OnAnimDone();
            }
            fired++;
        }
    }
    function fun(obj) {
        var cover = $('.cover');
        var slide = $(obj).find('.slide')
                .append('<div class="closepop">X</div>');
        var button = $(obj).find('.button');
        var close = slide.find('.closepop');
        button.fadeIn().on('click', function () {
            cover.fadeIn();
            slide.show().animate({
                right: '20%',
                opacity: 1
            }, 800, "easeInOutBack");
            button.finish().css('opacity', 0.4);
        });
        close.on('click', function () {
            slide.animate({
                right: '-60%',
                opacity: 0
            }, 800, "easeInOutBack");
            cover.fadeOut();
            clikDone();
        });
    }
    Run(0);
}
function videobut() {
    $(this).show();
    var video = $(this).find('video');
    var videoplay = $(this).find('.play');
    var wrapper = $(this).find('.videocontainer');
    var cover = $('.cover');
    var fired = 0;
    videoplay.on('click', function () {
        wrapper.animate({
            top: '10%',
            opacity: 1
        }, 800, "easeInOutBack");
        video.get(0).play();
        cover.fadeIn();
    });
    video.bind('ended', function () {
        wrapper.animate({
            top: '-50%',
            opacity: 0
        }, 800, "easeInOutBack");
        if (fired == 0) {
            OnAnimDone();
        }
        fired++;
        cover.fadeOut();
    });
}
function draganddrop() {
    $(this).show();
    arr = [];
    $.fn.randomize = function (selector) {
        (selector ? this.find(selector) : this).parent().each(function () {
            $(this).children(selector).sort(function () {
                return Math.random() - 0.5;
            }).detach().appendTo(this);
        });
        return this;
    };
    $('.draganddrop').randomize('.draggable');
    $('.draggable').draggable({
        revert: true,
        cursor: "move",
        start: function (e, ui) {
            $(this).addClass('draging');
        },
        stop: function (e, ui) {
            $(this).removeClass('draging');
        }
    });
    $(".droppable").droppable({
//            tolerance: 'touch',
        drop: function (e, ui) {
            ui.draggable.draggable("option", "revert", false);
            var oldPosition = ui.draggable.offset();
            ui.draggable.appendTo($(this));
            var newPosition = ui.draggable.offset();
            var leftOffset = null;
            var topOffset = null;
            if (oldPosition.left > newPosition.left) {
                leftOffset = (oldPosition.left - newPosition.left);
            } else {
                leftOffset = -(newPosition.left - oldPosition.left);
            }
            if (oldPosition.top > newPosition.top) {
                topOffset = (oldPosition.top - newPosition.top);
            } else {
                topOffset = -(newPosition.top - oldPosition.top);
            }
            ui.draggable.animate({
                left: '+=' + leftOffset,
                top: '+=' + topOffset
            }, 0);
            ui.draggable.draggable("option", "revert", true);
            var draggableId = ui.draggable.attr('data-answer');
            var droppableId = $(this).attr('data-question');
            arr.push({question: draggableId, answer: droppableId});
            $(this).droppable("disable");
//                $(ui.draggable).draggable("disable");
            if (arr.length === $('.droppable').length) {
                run();
            }
        }
    });
    function run() {
        $.each(arr, function (i, val) {
            var question = val.question;
            var answer = val.answer;
            if (question !== answer) {
                arr.push('error');
                return false;
            }
        });
        var test = $.inArray('error', arr);
        if (test > 0) {
            bad();
        } else {
            good();
        }
        function good() {
            var cover = $('.cover');
            var slide = $('.correct');
            var close = $('.closepop');
            slide.show().animate({
                right: '20%',
                opacity: 1
            });
            cover.fadeIn();
            close.on('click', function () {
                slide.animate({
                    right: '-60%',
                    opacity: 0
                }, 800, "easeInOutBack");
                cover.fadeOut();
                OnAnimDone();
            });
        }
        function bad() {
            var cover = $('.cover');
            var slide = $('.incorrect');
            var close = $('.closepop');
            slide.show().animate({
                right: '20%',
                opacity: 1
            });
            cover.fadeIn();
            close.on('click', function () {
                $('.droppable').children('.draggable ').appendTo('.draganddrop');
                slide.animate({
                    right: '-60%',
                    opacity: 0
                }, 800, "easeInOutBack");
                cover.fadeOut();
                var dropp = $('.droppable');
                dropp.each(function () {
                    $(this).css({'background': '#99FF66'});
                    var droppattr = $(this).attr('data-question');
                    $(".draggable[data-answer='" + droppattr + "']").appendTo($(".droppable[data-question='" + droppattr + "']"));
                });
                OnAnimDone();
            });
        }
    }
}
function slider() {

    $(this).show();
    var IMG_WIDTH = 500;
    var currentImg = 0;
    var maxImages = 3;
    var speed = 300;
    var imgs;
    var swipeOptions = {
        triggerOnTouchEnd: true,
        swipeStatus: swipeStatus,
        allowPageScroll: "vertical",
        threshold: 75
    };
    $(function () {
        imgs = $("#imgs");
        imgs.swipe(swipeOptions);
    });
    /**
     * Catch each phase of the swipe.
     * move : we drag the div
     * cancel : we animate back to where we were
     * end : we animate to the next image
     */
    function swipeStatus(event, phase, direction, distance) {
        //If we are moving before swipe, and we are going L or R in X mode, or U or D in Y mode then drag.
        if (phase == "move" && (direction == "left" || direction == "right")) {
            var duration = 0;
            if (direction == "left") {
                scrollImages((IMG_WIDTH * currentImg) + distance, duration);
            } else if (direction == "right") {
                scrollImages((IMG_WIDTH * currentImg) - distance, duration);
            }

        } else if (phase == "cancel") {
            scrollImages(IMG_WIDTH * currentImg, speed);
        } else if (phase == "end") {
            if (direction == "right") {
                previousImage();
            } else if (direction == "left") {
                nextImage();
            }
        }
    }

    function previousImage() {
        currentImg = Math.max(currentImg - 1, 0);
        scrollImages(IMG_WIDTH * currentImg, speed);
    }

    function nextImage() {
        currentImg = Math.min(currentImg + 1, maxImages - 1);
        scrollImages(IMG_WIDTH * currentImg, speed);
    }

    /**
     * Manually update the position of the imgs on drag
     */
    function scrollImages(distance, duration) {
        imgs.css("transition-duration", (duration / 1000).toFixed(1) + "s");
        //inverse the number we set in the css
        var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
        imgs.css("transform", "translate(" + value + "px,0)");
    }

    OnAnimDone();
}
function introvideo() {
    var video = $(this).find('video');
    var wrapper = $(this).find('.videocontainer');
    var cover = $('.cover');
    wrapper.animate({
        left: '20%',
        opacity: 1
    }, 1000, "easeInOutBack", function () {
        video.get(0).play();
        cover.fadeIn();
    });
    video.bind('ended', function () {
        wrapper.animate({
            top: '-50%',
            opacity: 0
        }, 800, "easeInOutBack", function () {
            cover.fadeOut(800, OnAnimDone());
        });
    });
}