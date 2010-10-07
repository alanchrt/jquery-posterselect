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

            // A class for a popup window
            var Popup = function(link) {
                // Create an alias for callbacks
                var popup = this;

                // Create the popup object
                this.obj = $('<div></div>');
                this.obj.addClass('posterselect');
                this.obj.css('top', link.offset().top + link.height());
                this.obj.css('left', link.offset().left);
                $('body').append(this.obj);
                this.obj.fadeIn();

                // Create the slider
                this.slider = $('<div></div>');
                this.slider.addClass('posterselect-slider');
                this.slider.slider();
                this.obj.append(this.slider);

                // Create the ok button
                this.ok = $('<a></a>').html("Ok");
                this.ok.addClass('posterselect-ok');
                this.ok.addClass('ui-widget-content');
                this.ok.attr('href', '#ok');
                this.obj.append(this.ok);

                // Create the cancel button
                this.cancel = $('<a></a>').html("Cancel");
                this.cancel.addClass('posterselect-cancel');
                this.cancel.attr('href', '#cancel');
                this.cancel.click(function(event) {
                    event.preventDefault();
                    popup.close();
                });
                this.obj.append(this.cancel);

                this.close = function() {
                    this.obj.remove();
                }
            }

            // Apply plugin to each element
            return this.each(function() {
                var o = $.extend({}, options);
                var obj = $(this);

                // Bind the popup click event to the element
                obj.click(function(event) {
                    event.preventDefault();
                    var popup = $(this).data('popup');
                    if (!popup || popup.obj.is(':hidden')) {
                        var popup = new Popup($(this));
                        $(this).data('popup', popup);
                    }
                    else
                        popup.close();
                });
            });

        }

    });

})(jQuery);
