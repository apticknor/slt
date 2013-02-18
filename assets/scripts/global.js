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

        // Common jQuery elements
        APP.$html   = $('html');
        APP.$body   = $('body');
        APP.$window = $(window);

        // init all the things
        APP.ExternalLinks.init();
        APP.AutoReplace.init();
        APP.Tabs.init();
        APP.FixedNavigation.init();
    });

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
        
        this.$tabControls.on('click', 'a', function(e) {
            e.preventDefault();
            var $this = $(this);
            var newSlideIndex = $this.attr('data-jstab-index');
            self.showTab(newSlideIndex);
        });
    },
    
    showTab: function(slideIndex) {
       
        this.$tabControls.find('li').removeClass('isActive');
        this.$tabContent.addClass('isHidden');

        if (slideIndex === undefined) {
            slideIndex = 0;
        }

        this.$tabControls.find('li').eq(slideIndex).addClass('isActive');
        this.$tabContent.eq(slideIndex).removeClass('isHidden');
    }
};

/* ---------------------------------------------------------------------
FixedNavigation
Author: Anthony Ticknor

Figures out whenthe first section of the page has been scrolled past
and applies fixed positioning to the navigation.
------------------------------------------------------------------------ */
APP.FixedNavigation = {
    $nav: undefined,
    _mastheadHeight: undefined,
    
    init: function() {
        var $nav = $('#js-fixedNav');
        var _mastheadHeight = $('.section_masthead').height();

        if (APP.isMobile === true) {
            return;
        }

        this.$nav = $nav;
        this._mastheadHeight = _mastheadHeight;

        this.bind();
    },
    
    bind: function() {
        var self = this;
        
        APP.$window.scroll(function() {
            var offsetTop = $(this).scrollTop();
            if (offsetTop > self._mastheadHeight) {
                self.$nav.addClass('nav_isFixed');
            } else {
                self.$nav.removeClass('nav_isFixed');
            }
        });
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

}(jQuery, SLT));