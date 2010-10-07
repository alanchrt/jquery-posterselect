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
                // Create the popup object
                this.obj = $('<div></div>');
                this.obj.css('position', 'absolute');
                this.obj.css('width', '400px');
                this.obj.css('height', '400px');
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

                this.close = function() {
                    this.obj.remove();
                }
            }

            // Apply plugin to each element
            return this.each(function() {
                var o = $.extend({}, options);
                var obj = $(this);

                // Bind the click event to the element
                obj.toggle(function(event) {
                    // Create the popup
                    event.preventDefault();
                    var popup = new Popup($(this));
                    $(this).data('popup', popup);
                }, function(event) {
                    // Remove the popup
                    event.preventDefault();
                    var popup = $(this).data('popup');
                    popup.close();
                });
            });

        }

    });

})(jQuery);
