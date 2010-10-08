(function($) {
    // Create namespaced posterselect object for global data
    $.posterselect = {
        popups: [],
        counter: 0,
        init_slider: function(index, duration) {
            $.posterselect.popups[index].slider.init(duration);
        }
    }

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

                // Grab link parts
                var href_parts = link.attr('href').split('#');

                // Store video information
                popup.video = {
                    url: href_parts[0]
                }

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
                popup.slider = {
                    time: {
                        set: function(time) {
                            popup.slider.time.value = time;
                            popup.slider.indicator.set(time);
                        },
                        value: (href_parts[1]) ? href_parts[1] : o.time
                    },
                    init: function(duration) {
                        // Create the slider object
                        popup.slider.obj = $('<div></div>').addClass(
                                'posterselect-slider');
                        popup.slider.obj.slider({
                            min: 0,
                            max: duration,
                            value: popup.slider.time.value,
                            slide: function(event, ui) {
                                popup.slider.time.set(ui.value);
                            },
                            change: function(event, ui) {
                                popup.slider.time.set(ui.value);
                            }
                        });
                        popup.obj.append(popup.slider.obj);

                        // Create the time indicator
                        popup.slider.indicator = {
                            set: function(seconds) {
                                this.hours = String((seconds/3600)|0);
                                this.minutes = String((seconds/60 -
                                            this.hours*60)|0);
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
                            },
                            obj: $('<div></div>').addClass(
                                         'posterselect-indicator')

                        }
                        popup.slider.indicator.set(popup.slider.time.value);
                        popup.obj.append(popup.slider.indicator.obj);

                        // Create the ok button
                        popup.ok = $('<a></a>').addClass('posterselect-ok');
                        popup.ok.html("Ok");
                        popup.ok.addClass('ui-widget-content');
                        popup.ok.attr('href', '#ok');
                        popup.obj.append(popup.ok);

                        popup.close = function() {
                            // Close the popup
                            popup.obj.remove();
                        }

                        // Create the cancel button
                        popup.cancel = $('<a></a>').addClass(
                                'posterselect-cancel');
                        popup.cancel.html("Cancel");
                        popup.cancel.attr('href', '#cancel');
                        popup.cancel.click(function(event) {
                            event.preventDefault();
                            popup.close();
                        });
                        popup.obj.append(popup.cancel);
                    }
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
                        $.posterselect.popups[$.posterselect.counter++] =
                                    popup;
                    }
                    else
                        popup.close();
                });
            });

        }

    });

})(jQuery);
