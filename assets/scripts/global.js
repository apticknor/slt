/* ---------------------------------------------------------------------
Global JavaScript

Target Browsers: All
Authors: Anthony Ticknor, Dan Piscitiello
------------------------------------------------------------------------ */

// Namespace Object
var SLT = SLT || {};

// Pass reference to jQuery and Namespace
(function($, APP) {

    'use strict';

    // DOM Ready Function
    $(function() {

        // check if we're mobile or not
        APP.isMobile = APP.MobileCheck.init();
        // Test capabilities
        APP.FeatureDetection.init(); // Creates APP.Features object

        // Common jQuery elements
        APP.$html     = $('html');
        APP.$body     = $('body');
        APP.$window   = $(window);
        APP.$document = $(document);

        // init all the things
        APP.HasJS.init();
        APP.ExternalLinks.init();
        APP.AutoReplace.init();
        APP.Tabs.init();
        APP.Carousel.init();
        APP.HeightWatchers.init();
        APP.FixedNavigation.init();

        APP.ScrollTo.init({
            duration: 750
        });

        if (!APP.Features.isTouch) {
            APP.OnScreenWatcher.init('isOnScreen', 'js-monitorIsOnScreen');
            APP.ContactSection.init('.section-bd_contact');
            APP.Stripes.init();
        }

        /*
         * SWIPE EVENT CONFIG
         */
        // The percentage of wrapper travelled for swipe event to occur (default is 0.4)
        jQuery.event.special.swipe.settings.threshold = 0.1;
        // Sensitivity to swipe events (default is 6)
        jQuery.event.special.swipe.settings.sensitivity = 8;
    });

/* ---------------------------------------------------------------------
HasJS
Author: Anthony Ticknor

Replaces "no-js" class with "js" on the html element if JavaScript
is present. This allows you to style both the JavaScript enhanced
and non JavaScript experiences.
------------------------------------------------------------------------ */
APP.HasJS = {
    init: function() {
        APP.$html.removeClass('no-js').addClass('js');
    }
};

/* ---------------------------------------------------------------------
ExternalLinks
Author: Anthony Ticknor

Launches links with a rel="external" in a new window
------------------------------------------------------------------------ */
APP.ExternalLinks = {
    init: function() {
        $(document).on('click', 'a[rel=external]', function(e) {
            window.open($(this).attr('href'));
            e.preventDefault();
        });
    }
};

/* ---------------------------------------------------------------------
AutoReplace
Author: Dan Piscitiello

Mimics HTML5 placeholder behavior in browsers that do not support it.

Additionally, adds and removes 'placeholder-text' class, used as a styling
hook for when placeholder text is visible or not visible

Additionally, sets the field value to the empty string upon form submission
if the current value is the default text
------------------------------------------------------------------------ */
APP.AutoReplace = {
    $fields: undefined,

    init: function() {
        // Only run the script if 'placeholder' is not natively supported
        if ('placeholder' in document.createElement('input')) {
            return;
        }

        this.$fields = $('[placeholder]');
        this.bind();
    },

    bind: function() {
        this.$fields.each(
            function() {
                var $this = $(this);
                var defaultText = $this.attr('placeholder');

                if ($this.val() === '' || $this.val() === defaultText) {
                    $this.addClass('placeholder-text').val(defaultText);
                }

                $this.off('.autoreplace');

                $this.on(
                    'focus.autoreplace',
                    function() {
                        if ($this.val() === defaultText) {
                            $this.val('').removeClass('placeholder-text');
                        }
                    }
                );

                $this.on(
                    'blur.autoreplace',
                    function() {
                        if ($this.val() === '' || $this.val() === defaultText) {
                            $this.val(defaultText).addClass('placeholder-text');
                        }
                    }
                );

                $this.parents('form').off('submit.autoreplace').on(
                    'submit.autoreplace',
                    function() {
                        if ($this.val() === defaultText) {
                            $this.val('');
                        }
                    }
                );
            }
        );
    }
};

/* ---------------------------------------------------------------------
Tabs
Author: Anthony Ticknor

Tab switching.
------------------------------------------------------------------------ */
APP.Tabs = {
    $tabs: undefined,
    $tabContent: undefined,
    $tabControls: undefined,

    init: function() {
        var $tabs = $('#jsTabs');
        var $tabContent;
        var $tabControls;

        // stop script for legacy IE
        if (legacyIE === true) {
            return;
        }

        if (!$tabs.length) {
            return;
        }

        $tabContent = $tabs.find('.jsTab-content');

        if (!$tabContent.length) {
            return;
        }

        $tabControls = $tabs.find('.jsTab-controls');

        if (!$tabControls.length) {
            return;
        }

        this.$tabs = $tabs;
        this.$tabContent = $tabContent;
        this.$tabControls = $tabControls;

        this.createNavigation();
        this.showTab();
        this.bind();

    },

    createNavigation: function() {
        var nav = '<ol class="navList">';

        this.$tabContent.each(function(index) {
            var $this = $(this);
            var label = $this.attr('data-jstab-label');
            nav += '<li><a href="#" data-jstab-index="'+index+'">'+label+'</a></li>';
        });

        nav += '</ol>';

        this.$tabControls.prepend(nav);
    },

    bind: function() {
        var self = this;
        var isMoving = false;

        this.$tabControls.on({
            click: function(e) {
                e.preventDefault();
                if (!APP.Features.isTouch) {
                    var newSlideIndex = $(this).attr('data-jstab-index');
                    self.showTab(newSlideIndex);
                }
            },
            touchend: function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                if (isMoving == false) {
                    var newSlideIndex = $(this).attr('data-jstab-index');
                    self.showTab(newSlideIndex);
                } else {
                    isMoving = false;
                }
            },
            touchmove: function() {
                isMoving = true;
            }
        }, 'a');
    },

    showTab: function(slideIndex) {

        this.$tabControls.find('li').removeClass('isActive');
        this.$tabContent.addClass('isHidden');

        if (slideIndex === undefined) {
            slideIndex = 0;
        }

        this.$tabControls.find('li').eq(slideIndex).addClass('isActive');
        this.$tabContent.eq(slideIndex).removeClass('isHidden');
        APP.$window.trigger('resize');
        APP.$window.trigger('scroll');
    }
};

/* ---------------------------------------------------------------------
MobileCheck
Author: Anthony Ticknor

Determines if site is mobile
------------------------------------------------------------------------ */
APP.MobileCheck = {

    init: function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }
};

/* ---------------------------------------------------------------------
Carousel
Author: Dan Piscitiello
------------------------------------------------------------------------ */
APP.Carousel = {
    // DOM elements that should exist
    $carousel: undefined,
    $viewport: undefined,
    $slideWrapper: undefined,
    $slides: undefined,
    // DOM elements we'll create
    $pagination: undefined,
    $paginationLinks: undefined,
    $prev: undefined,
    $next: undefined,
    // Other object properties
    currentSlide: 0,
    numSlides: 0,

    init: function() {
        var $carousel = $('#portfolioCarousel');
        var $viewport = $carousel.find('.carousel-viewport');
        var $slideWrapper = $carousel.find('.carousel-slides');
        var $slides = $slideWrapper.children();
        var $keySlide = $slides.eq(0);

        // stop script for legacy IE
        if (legacyIE === true) {
            return;
        }

        if (!$carousel.length ||
            !$viewport.length ||
            !$slideWrapper.length ||
            !$slides.length) {
            return;
        }

        this.$carousel = $carousel;
        this.$viewport = $viewport;
        this.$slideWrapper = $slideWrapper;
        this.$slides = $slides;
        this.$keySlide = $keySlide;

        this.numSlides = this.$slides.length;

        this.createMarkup().bindEvents();
    },

    createMarkup: function() {
        var $controls = $('<div class="carousel-controls"></div>');
        var $pagination = $('<ol class="pagination"></ol>');

        for (var i = 0; i < this.numSlides; i++) {
            $pagination.append('<li><span class="paginationDot"></span></li>');
        }

        $pagination.find('.paginationDot').eq(0).addClass('isActive');

        this.$pagination = $pagination;
        this.$paginationLinks = $pagination.find('.paginationDot');
        this.$prev = $('<span class="carousel-controls-btn carousel-controls-btn_prev"></span>');
        this.$next = $('<span class="carousel-controls-btn carousel-controls-btn_next"></span>');

        // Only add arrows to non-touch devices
        if (!APP.Features.isTouch) {
            $controls.append(this.$prev);
            $controls.append(this.$next);
            this.updateButtons();
        }

        $controls.append($pagination);

        this.$carousel.prepend($controls);

        return this;
    },

    bindEvents: function() {
        var self = this;
        var isMoving = false;

        // Non touch events
        if (!APP.Features.isTouch) {
            this.$prev.on({
                click: function(e) {
                    e.preventDefault();
                    self.onPreviousSlide();
                }
            });

            this.$next.on({
                click: function(e) {
                    e.preventDefault();
                    self.onNextSlide();
                }
            });

            this.$paginationLinks.on({
                click: function(e) {
                    e.preventDefault();
                    self.gotoSlide($(this).parent().index());
                }
            });
        }

        // Touch Events
        if (APP.Features.isTouch) {
            this.$viewport.on('swipeleft', function(){
                self.onNextSlide();
            });

            this.$viewport.on('swiperight', function(){
                self.onPreviousSlide();
            });

            this.$viewport.on('movestart', function(e){
                if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
                    e.preventDefault();
                }
            });
        }
    },

    onNextSlide: function() {
        this.gotoSlide(this.currentSlide + 1);
    },

    onPreviousSlide: function() {
        this.gotoSlide(this.currentSlide - 1);
    },

    gotoSlide: function(index) {
        if (index === this.numSlides || index < 0) {
            return;
        }

        this.$slideWrapper.stop().animate(
            {
                'left': (-(index * 100)) + "%"
            },
            300,
            'easeOutQuad'
        );

        this.currentSlide = index;
        this.updatePagination();

        if (!APP.isTouch) {
            this.updateButtons();
        }
    },

    updatePagination: function() {
        this.$pagination
            .find('.isActive')
                .removeClass('isActive');

        this.$pagination
            .find('.paginationDot')
                .eq(this.currentSlide)
                .addClass('isActive');
    },

    updateButtons: function() {
        this.currentSlide === this.numSlides - 1 ? this.$next.hide() : this.$next.show();
        this.currentSlide === 0 ? this.$prev.hide() : this.$prev.show();
    }
};

/* ---------------------------------------------------------------------
Feature Detection

Creates APP.Features object containing booleans for the following,
and if true, adds a class to the HTML element:
    isTouch   -> adds 'touch' class to HTML element
    isIPhone  -> adds 'iphone' class to HTML element
    isAndroid -> adds 'android' class to HTML element
------------------------------------------------------------------------ */
APP.FeatureDetection = {
    userAgent: undefined,
    $html: undefined,

    init: function() {
        APP.Features = APP.Features || {};
        this.userAgent = navigator.userAgent.toLowerCase();
        this.$html = $('html');
        // this.testAndroid();
        // this.testIPhone();
        this.testTouch();
    },

    testAndroid: function() {
        if(this.userAgent.indexOf("android") > -1) {
            this.$html.addClass('android');
            APP.Features.isAndroid = true;
            return;
        }
        APP.Features.isAndroid = false;
    },

    testIPhone: function() {
        if(this.userAgent.indexOf("iphone") > -1 || this.userAgent.indexOf("ipod") > -1) {
            this.$html.addClass('iphone');
            APP.Features.isIPhone = true;
            return;
        }
        APP.Features.isIPhone = false;
    },

    testTouch: function() {
        if ('ontouchstart' in document.documentElement) {
            APP.Features.isTouch = true;
            this.$html.addClass('touch');
            return;
        }
        APP.Features.isTouch = false;
    }
};


/* ---------------------------------------------------------------------
HeightWatchers
Author: Dan Piscitiello

Initializes HeightWatch objects
------------------------------------------------------------------------ */
APP.HeightWatchers = {
    init: function() {

        // stop script for legacy IE
        if (legacyIE === true) {
            return;
        }

        var $groups = $('[data-height-watch-group]');
        // must wait for images to load prior to measuring heights
        $(window).on('load', function() {
            $groups.each(function(){
                new HeightWatcher($(this));
            });
        });
    }
};

/* ---------------------------------------------------------------------
HeightWatcher Class
Author: Dan Piscitiello

Monitors DOM elements and makes them equal heights
------------------------------------------------------------------------ */
var HeightWatcher = function($group) {
    this.$group = $group;
    this.groupName = $group.data('heightWatchGroup');
    this.$watchedElements = $('[data-height-watch-group-member=' + this.groupName + ']');
    this.disableBreakpoint = parseInt($group.data('heightWatchDisableWidth'), 10);
    this.$window = $(window);

    this.bindEvents();
    this.enableUI();
    this.setHeights();
}

HeightWatcher.prototype.bindEvents = function() {
    this.onResizeEvent = $.proxy(this.handleResize, this);
}

HeightWatcher.prototype.enableUI = function() {
    this.$window.on('resize', this.onResizeEvent);
}

HeightWatcher.prototype.handleResize = function() {
    this.setHeights();
}

HeightWatcher.prototype.getTallest = function() {
    var height = 0;
    this.removeHeights();
    this.$watchedElements.each(function(){
        var tempHeight = $(this).height();
        height = tempHeight > height ? tempHeight : height;
    });

    return height;
}

HeightWatcher.prototype.removeHeights = function() {
    this.$watchedElements.each(function(){
        $(this).css('height', 'auto');
    });
}

HeightWatcher.prototype.setHeights = function() {
    if (this.$window.width() < this.disableBreakpoint) {
        this.removeHeights();
        return;
    }

    var height = this.getTallest();
    this.$watchedElements.each(function(){
        $(this).height(height);
    });
}

/* ---------------------------------------------------------------------
OnScreenWatcher
Author: Dan Piscitiello

Monitors DOM elements and toggles class when on screen

param: onScreenActiveClass, string
- CSS class that will be added and removed as items are on and off screen

param: monitorMeClass, string
- CSS class that this object will search for to monitor
------------------------------------------------------------------------ */
APP.OnScreenWatcher = {
    ON_SCREEN_ACTIVE_CLASS: '',
    MONITOR_ME_CLASS: '',
    $monitorCollection: null,

    init: function(onScreenActiveClass, monitorMeClass) {
        if (!onScreenActiveClass || !monitorMeClass) {
            return;
        }

        // stop script for legacy IE
        if (legacyIE === true) {
            return;
        }

        this.ON_SCREEN_ACTIVE_CLASS = onScreenActiveClass;
        this.MONITOR_ME_CLASS = monitorMeClass;
        this.$monitorCollection = $("." + monitorMeClass);

        if (!this.$monitorCollection.length) {
            this.$monitorCollection = null;
            return;
        }

        this.bind();
        this.checkElementsOnScreen();
    },

    bind: function() {
        var self = this;

        APP.$window.on('scroll resize', function(){
            self.checkElementsOnScreen();
        });
    },

    checkElementsOnScreen: function() {
        var self = this;
        this.$monitorCollection.each(function(){
            var $this = $(this);
            if (self.isOnScreen($this)) {
                $this.addClass(self.ON_SCREEN_ACTIVE_CLASS);
            } else {
                $this.removeClass(self.ON_SCREEN_ACTIVE_CLASS);
            }
        });
    },

    /*
     * isOnScreen
     * returns: Boolean
     *
     * Whether or not the passed jQuery object is on screen
     *
     */
    isOnScreen: function($el) {
        var elPosition   = $el.offset();
        var scrollOffset = APP.$window.height() + APP.$window.scrollTop();
        var elOffset     = elPosition.top + $el.height();

        return scrollOffset > elPosition.top && elOffset > APP.$window.scrollTop(); // Is $el on screen?
    }
};

/* ---------------------------------------------------------------------
ContactSection
Author: Dan Piscitiello

Handles Contact section effects
------------------------------------------------------------------------ */
APP.ContactSection = {
    $el: null,

    init: function(selector) {
        this.minWidth = 672;

        if (!selector) {
            return;
        }

        // stop script for legacy IE
        if (legacyIE === true) {
            return;
        }

        this.$el = $(selector);
        this.$topWatcher = this.$el.parent();
        this.$heightWatcher = this.$el.children().eq(0);

        if (!this.$el.length) {
            this.$el = null;
            return;
        }

        this.targetHeight = 0;

        this.bind();
        this.setMeasurements();
        this.positionEl();
    },

    bind: function() {
        var self = this;
        APP.$window.on('scroll resize', function(){
            self.setMeasurements();
            self.positionEl();
        });
    },

    setMeasurements: function() {
        var targetLeft = (APP.$document.width() - this.$el.width()) / 2;
        this.targetHeight = this.$heightWatcher.height();

        this.$el.css({
            'left': targetLeft,
            'height': this.targetHeight
        });

        this.$topWatcher.css('height', this.targetHeight);
    },

    positionEl: function() {
        var docScroll = APP.$document.scrollTop();
        var winHeight = APP.$window.height();
        var topValue = this.$topWatcher.offset().top;

        var target = topValue - docScroll;
        var pixelsOnScreen = docScroll + winHeight - topValue;
        var isOffScreen = docScroll + winHeight < topValue;

        // If I'm smaller than medium breakpoint or I'm not on screen, reset to static positioning
        if (APP.$window.width() < this.minWidth || isOffScreen) {
            this.$el.css({
                'position': 'static'
            });
        // or else if my container is not fully on screen
        } else if (pixelsOnScreen <= this.targetHeight) {
            this.$el.css({
                'position': 'fixed',
                'top': 'auto',
                'bottom': 0
            });
        // otherwise I'm on screen fully
        } else {
            this.$el.css({
                'position': 'fixed',
                'top': target,
                'bottom': 'auto'
            });
        }
    }
};

/* ---------------------------------------------------------------------
FixedNavigation
Author: Anthony Ticknor

Moved Fixed Navigation (main nav and back to top button) into view
once you scroll past a certain offset on the page.
------------------------------------------------------------------------ */
APP.FixedNavigation = {
    $top: null,
    $nav: null,
    offsetTrigger: null,

    init: function() {

        // stop script for legacy IE
        if (legacyIE === true) {
            return;
        }

        this.$top = $('#js-top');
        this.$nav = $('#js-nav');
        this.offsetTrigger = $('.section_masthead').outerHeight();

        if (!this.$top.length || !this.$nav.length || !this.offsetTrigger) {
            return;
        }

        this.bind();
        this.showNavigation();

    },
    bind: function() {
        this.onScrollEvent = $.proxy(this.showNavigation, this);
        APP.$window.on('scroll', this.onScrollEvent);

    },
    showNavigation: function() {
        var scrollOffset = APP.$window.scrollTop();
        if (scrollOffset > this.offsetTrigger) {
            APP.$window.off('scroll', this.onScrollEvent);

            var navHeight = parseInt(this.$nav.css('height'), 10);
            var navTopPad = parseInt(this.$nav.css('padding-top'), 10);

            this.$nav.addClass('nav_isOnScreen');

            this.$nav.animate(
                {
                    'top': -(navHeight - navTopPad)
                },
                750,
                'easeOutBack'
            );

            this.$top.animate(
                {
                    'bottom': 20
                },
                750,
                'easeOutBack'
            );
        }
    }
}

/* ---------------------------------------------------------------------
SctollTo
Author: Dan Piscitiello

Handles page scrolling
------------------------------------------------------------------------ */
APP.ScrollTo = {
    $triggers: null,
    $windowGroup: null,
    duration: 700,

    init: function(options) {
        this.$triggers = $('.js-scrollTo');

        if (!this.$triggers.length) {
            this.$triggers = null;
            return;
        }

        this.$windowGroup = $('html, body');
        this.duration = options.duration || this.duration;

        this.bind();
    },

    bind: function() {
        var self = this;

        this.$triggers.on('click', function(e){
            e.preventDefault();
            self.handleClick($(this));
        })
    },

    handleClick: function($trigger) {
        var target = $($trigger.attr('href')).offset().top;

        this.$windowGroup.animate(
            {
                scrollTop: target
            },
            this.duration,
            'easeOutQuad'
        );
    }
}

/* ---------------------------------------------------------------------
Stripes
Author: Dan Piscitiello

Handles animation of stripes
------------------------------------------------------------------------ */
APP.Stripes = {
    $el: null,
    oTop: 0,
    scrollRatio: 1.8,

    init: function() {
        this.$el = $(document.getElementById('topLeftStripe'));

        if (!this.$el.length) {
            this.$el = null;
            return;
        }

        this.oTop = 0;

        this.bind();
        this.handleStripeScroll();
    },

    bind: function() {
        var self = this;

        APP.$window.on('scroll resize', function() {
            self.handleStripeScroll();
        });
    },

    handleStripeScroll: function() {
        var self = this;

        this.$el.css({
            top: self.oTop - APP.$window.scrollTop() / self.scrollRatio
        });
    }
};

}(jQuery, SLT));