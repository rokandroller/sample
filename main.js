
jQuery(document).ready(function ($) {
    CurSection = 1;
    CurSlide = 0;

    $(window).on("load resize", function () {
        winHeight = $(window).height();
        articleHeight();
    });
    function getPageScroll(element) {
        var yScroll = $(element).scrollTop();
        return yScroll;
    }

    var wrap = $('div.wrap');
    function Ajax(url, datatype) {
        return $.ajax({
            beforeSend: function () {

            },
            url: url,
            async: false,
            type: 'get',
            dataType: datatype || 'html',
            cache: false
        }).always(function () {

        }).fail(function () {

        });
    }

    function articleHeight() {
        $('article').each(function () {
            var $this = $(this);
            if ($this.index() === 0) {
                $this.css({'min-height': winHeight + 200});
            } else {
                $this.css({'min-height': winHeight});
            }
        });
    }

    function homeMenu(url, datatype) {
        $.when(Ajax(url, datatype)).then(function (data) {
            wrap.hide().append(data);
            setTimeout(function () {
                wrap.jpreLoader(null, function () {
                    wrap.show();
                });
            }, 200);
        });
        return false;
    }
    homeMenu("Menu.html");
    function Menu(cont) {
        this.container = cont;
        this.sectionheight;
        this.sectionId;
        this.donewithSection = false;
        this.ajaxTriger = true;
        this.contentwrap = this.container.find('.contentwrap');
        this.button = this.container.find('div.menutext');
        this.section = this.container.find('section');
        this.backbut = this.container.parent().find('div.backbut');
        this.ajaxdiv = this.section.find('div.ajax');
        this.events.click.call(this);
        this.events.scroll.call(this);
    }


    Menu.prototype.events = {
        click: function () {
            var menuClickSlide = this.container.find('div.buttwrapp ul li');

            var self = this;
            this.button.on('click', function (e) {
                e.stopPropagation();
                $(this).css({top: 0});
                self.sectionId = $(this).parent().index();
                self.sectionheight = (self.section.eq(self.sectionId).height());
                self.backbut.fadeIn();
                self.transition("-100%");
                self.section.eq(self.sectionId).addClass('show');
                self.loadtransition(self.section.eq(self.sectionId));
            });
            this.backbut.on('click', function () {
                $(this).fadeOut();
                self.transition();
                self.ajaxdiv.empty();
                CurSlide = 0;
                self.donewithSection = false;
            });
            menuClickSlide.on('click', function () {
                self.sectionId = $(this).index();
                edgecontroll(self.sectionId);

                var element1 = menuClickSlide.not(this).find('div.opened');
                var element2 = $(this).children('div.menutext').css({opacity: 0}).addClass('opened');
                self.animate.animte1.call(this, element1, element2);
            });

        },
        scroll: function () {
            $('.contentwrap').on("scroll", $.proxy(function () {
                var top = (getPageScroll(this.contentwrap) + winHeight);
                if (this.ajaxTriger && !this.donewithSection && top >= (this.sectionheight - 200)) {
                    this.ajaxTriger = false;
                    this.Waypointtriger.triger.call(this);
                    this.sectionheight = this.section.eq(this.sectionId).height();
                }
            }, this));
        }
    };
    Menu.prototype.transition = function (dir) {
        var self = this;
        this.container.animate({
            top: dir || "0%"
        }, 600, 'easeOutQuint', function () {
            if (!dir) {
                self.section.removeClass('show');
            }
        });
    };
    Menu.prototype.loadtransition = function (elements) {
        elements.find('.animate').children().slice(0, 10).each(function (i) {
            $(this).css({opacity: 0, position: 'relative', top: 100})
                    .delay((i++) * 100)
                    .animate({opacity: 1, top: 0}, 800, 'easeOutQuint');
        });
    };
    Menu.prototype.animate = {
        animte1: function (element1, element2) {
            element1.stop(true).animate({top: 0, opacity: 0}, 400, 'easeInBack').removeClass('opened');
            element2.stop(true).animate({top: -93, opacity: 1}, 400, 'easeOutBack');
        }
    };

    Menu.prototype.Waypointtriger = {
        triger: function () {
            CurSlide++;
            stopedge();

            ($.proxy(function () {
                $.when(Ajax('section'
                        + (this.sectionId + 1) + '/'
                        + (CurSlide)
                        + '/index.html')).done($.proxy(function (data) {
                    this.sectionshow = this.section.eq(this.sectionId).find('div.ajax');
                    this.sectionshow.append(data);
                    this.ajaxTriger = true;
                    articleHeight();

                }, this)).fail($.proxy(function () {
                    this.donewithSection = true;
                    this.ajaxTriger = true;
                }, this));
            }, this))();

        }
    };
    var Menu = new Menu($('.allwrap'));

    function edgecontroll(id) {
        if (AdobeEdge !== null) {
            AdobeEdge.bootstrapCallback(function (compId) {
                AdobeEdge.getComposition(compId).stage.play("Label" + (id + 1));
            });
        }
    }

    var countUp = 0;
    var countdown = 0;
    $(window).bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
            countUp++;
            setTimeout(function () {
                countUp = 0;
            }, 400);
            if (countUp > 2) {
                console.log('up');
                countUp = 0;
            }
        }
        else {
            countdown++;
            setTimeout(function () {
                countdown = 0;
            }, 400);
            if (countdown > 2) {
                console.log('down');
                countdown = 0;
            }
        }
       // return false;
    });

});




