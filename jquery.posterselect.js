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
                var o = $.extend({}, options);
                var popup = this;

                // Store video information
                var href_parts = link.attr('href').split('#');
                popup.video = {
                    url: href_parts[0],
                    //length: null /* commented out for test data
                    length: 30
                }
                popup.initial_time = (href_parts[1]) ? href_parts[1] : o.time;

                // Create the popup object
                popup.obj = $('<div></div>').addClass('posterselect');
                popup.obj.css('top', link.offset().top + link.height());
                popup.obj.css('left', link.offset().left);
                $('body').append(popup.obj);
                popup.obj.fadeIn();

                // Create the loading placeholder
                popup.loading = $('<div></div>').addClass(
                        'posterselect-loading');
                popup.loading.html("Loading...");
                popup.obj.append(popup.loading);

                // Create the slider
                popup.slider = $('<div></div>').addClass(
                        'posterselect-slider');
                popup.slider.slider({
                    min: -1,
                    max: popup.video.length + 1,
                    value: popup.initial_time,
                    slide: function(event, ui) {
                        popup.indicator.set($(this).slider('option', 'value'));
                    }
                });
                popup.obj.append(popup.slider);

                // Create the time indicator
                popup.indicator = {
                    set: function(seconds) {
                        this.hours = String((seconds/3600)|0);
                        this.minutes = String((seconds/60 - this.hours*60)|0);
                        this.seconds = String(seconds % 60);
                        if (this.hours.length == 1)
                            this.hours = "0" + this.hours;
                        if (this.minutes.length == 1)
                            this.minutes = "0" + this.minutes;
                        if (this.seconds.length == 1)
                            this.seconds = "0" + this.seconds;

                        this.obj.html("<strong>Position:</strong> " +
                                this.hours + ":" + this.minutes + ":" +
                                this.seconds)
                    }
                }
                popup.indicator.obj = $('<div></div>').addClass(
                        'posterselect-indicator');
                popup.indicator.set(popup.initial_time);
                popup.obj.append(popup.indicator.obj);

                // Create the ok button
                popup.ok = $('<a></a>').addClass('posterselect-ok');
                popup.ok.html("Ok");
                popup.ok.addClass('ui-widget-content');
                popup.ok.attr('href', '#ok');
                popup.obj.append(popup.ok);

                popup.close = function() {
                    popup.obj.remove();
                }

                // Create the cancel button
                popup.cancel = $('<a></a>').addClass('posterselect-cancel');
                popup.cancel.html("Cancel");
                popup.cancel.attr('href', '#cancel');
                popup.cancel.click(function(event) {
                    event.preventDefault();
                    popup.close();
                });
                popup.obj.append(this.cancel);
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
