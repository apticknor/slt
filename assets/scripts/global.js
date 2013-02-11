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
        APP.ExternalLinks.init();
        APP.AutoReplace.init();
        APP.Tabs.init();
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
        var nav = '<ol>';
        
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

}(jQuery, SLT));