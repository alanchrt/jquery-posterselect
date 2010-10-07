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
                this.obj.css('position', 'absolute');
                this.obj.css('width', '360px');
                this.obj.css('height', '360px');
                this.obj.css('padding', '20px');
                this.obj.css('background', '#ffffff');
                this.obj.css('border', '#cccccc 1px solid');
                this.obj.css('border-radius', '10px');
                this.obj.css('-moz-border-radius', '10px');
                this.obj.css('-webkit-border-radius', '10px');
                this.obj.css('box-shadow', '3px 3px 10px #aaaaaa');
                this.obj.css('-moz-box-shadow', '3px 3px 10px #aaaaaa');
                this.obj.css('-webkit-box-shadow', '3px 3px 10px #aaaaaa');
                this.obj.css('top', link.offset().top + link.height());
                this.obj.css('left', link.offset().left);
                this.obj.css('display', 'none')
                $('body').append(this.obj);
                this.obj.show('fast');

                // Create the slider
                this.slider = $('<div></div>');
                this.slider.css('position', 'absolute');
                this.slider.css('width', '360px');
                this.slider.css('top', '330px');
                this.slider.slider();
                this.obj.append(this.slider);

                // Create the ok button
                this.ok = $('<a></a>').html("Ok");
                this.ok.attr('href', '#ok');
                this.ok.addClass('ui-widget-content');
                this.ok.addClass('ok');
                this.ok.css('position', 'absolute');
                this.ok.css('display', 'block');
                this.ok.css('top', '350px');
                this.ok.css('left', '265px');
                this.ok.css('width', '45px');
                this.ok.css('height', '35px');
                this.ok.css('line-height', '35px');
                this.ok.css('text-align', 'center');
                this.ok.css('border-radius', '5px');
                this.ok.css('-moz-border-radius', '5px');
                this.ok.css('-webkit-border-radius', '5px');
                this.obj.append(this.ok);

                // Create the cancel button
                this.cancel = $('<a></a>').html("Cancel");
                this.cancel.attr('href', '#cancel');
                this.ok.addClass('cancel');
                this.cancel.css('position', 'absolute');
                this.cancel.css('display', 'block');
                this.cancel.css('top', '350px');
                this.cancel.css('left', '325px');
                this.cancel.css('height', '35px');
                this.cancel.css('line-height', '35px');
                this.cancel.css('text-decoration', 'underline');
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
