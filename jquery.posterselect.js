(function($) {

    // Extend jQuery with posterselect plugin
    $.fn.extend({

        posterselect: function(options) {
            // Apply posterselect to elements

            // Set some reasonable defaults
            var defaults = {
                time: '2',
                conversion_url: './?time=%s',
                callback: function(image, time) {}
            }

            // Override the defaults with user settings
            var options = $.extend(defaults, options);

            // Apply plugin to each element
            return this.each(function() {
                var o = $.extend({}, options);
                var obj = $(this);
            });

        }

    });

})(jQuery);
