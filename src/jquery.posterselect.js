(function($) {
    // Create namespaced posterselect object for global data
    $.posterselect = {
        popups: [],
        counter: 0,
        init_slider: function(index, duration) {
            var popup = $.posterselect.popups[index];
            popup.slider.init(Math.floor(duration));
            popup.videoduration.remove();
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
                callback: function(image, time) {},
                posterselect_url: '/',
                videoduration_swf: 'videoduration.swf',
                videoduration_url: '/'
            }

            // Override the defaults with user settings
            var options = $.extend(defaults, options);

            // A class for a popup window
            var Popup = function(link) {
                var o = $.extend({}, options);
                var popup = this;

                // Grab link parts
                var href_parts = link.attr('href').split('#');

                // Set the callback
                popup.callback = o.callback;

                // Store video information
                popup.video = {
                    url: href_parts[0]
                }

                popup.grab = function(time) {
                    // Grab a poster frame
                    $.get(o.posterselect_url, {url: popup.video.url,
                            time: time}, function(response) {
                        if (response.posterselect.image.url) {
                            popup.loading.hide();
                            popup.image = response.posterselect.image.url;
                            popup.preview.attr('src', popup.image);
                            popup.preview.show();
                        }
                        else
                            alert("We were unable to grab a poster frame.");
                    }, 'json');
                }

                // Create the popup object
                popup.obj = $('<div></div>').addClass('posterselect');
                popup.obj.css('top', link.offset().top + link.height());
                popup.obj.css('left', link.offset().left);
                $(document.body).append(popup.obj);
                popup.obj.fadeIn();

                popup.close = function() {
                    // Close the popup
                    popup.obj.remove();
                }

                // Create the poster frame preview
                popup.preview = $('<img>').addClass('posterselect-preview');
                popup.preview.hide();
                popup.obj.append(popup.preview);

                // Create the loading placeholder
                popup.loading = $('<div></div>').addClass(
                        'posterselect-loading');
                popup.loading.html("Loading...");
                popup.loading.hide();
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
                                popup.loading.show();
                                popup.grab(ui.value);
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
                        popup.ok.click(function(event) {
                            event.preventDefault();
                            popup.close();
                            popup.callback(popup.image,
                                popup.slider.time.value);
                        });
                        popup.obj.append(popup.ok);

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

                // Add the video duration sniffer
                var flashvars = 'url=' + escape(popup.video.url) +
                        '&callback=jQuery.posterselect.init_slider&index=' +
                        $.posterselect.counter;
                popup.videoduration = $('<object></object');
                popup.videoduration.attr('classid',
                        'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000');
                popup.videoduration.attr('codebase',
                        'http://fpdownload.macromedia.com/pub/shockwave/' +
                        'cabs/flash/swflash.cab#version=10,0,0,0')
                popup.videoduration.attr('width', '1');
                popup.videoduration.attr('height', '1');
                popup.videoduration.append($('<param>').attr(
                        'name', 'movie').attr('value', o.videoduration_swf));
                popup.videoduration.append($('<param>').attr(
                        'name', 'allowScriptAccess').attr('value', 'always'));
                popup.videoduration.append($('<param>').attr(
                        'name', 'flashVars').attr('value', flashvars));
                popup.videoduration.append($('<embed>').attr('type',
                            'application/x-shockwave-flash').attr('src',
                            o.videoduration_swf).attr('width', '1').attr(
                            'height','1').attr('flashvars', flashvars));
                $(document.body).append(popup.videoduration);

                // Get the initial poster frame preview
                popup.grab(popup.slider.time.value);
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
