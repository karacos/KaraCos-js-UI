(function($) {
	$.widget("ui.toolbar",{
		_init : function() {
			var self = this;

      this.element.addClass('ui-widget ui-toolbar ui-widget-header ui-helper-reset ui-helper-clearfix ui-corner-all');

			this._refreshDirection(this.options.direction);
			this._refreshOrientation(this.options.orientation);
		},
		
    addDivider: function() {
      this.element.append($('<span>').html('&nbsp;').addClass('ui-toolbar-divider'));
    },
		
		refresh: function () {
			this.element.find(' > *').addClass('ui-toolbar-item');
		},

    _setData: function(key, value) {

	    $.widget.prototype._setData.apply(this, arguments);
	
	    switch (key) {
	      case 'direction':
	        this._refreshDirection(value);
	        break;

        case 'orientation':
          this._refreshOrientation(value);
          break;
	    }
	  },
		
    _refreshOrientation: function (newValue) {
      if (newValue == 'horizontal') {
        this.element.addClass('ui-orientation-h');
      } else {
        this.element.removeClass('ui-orientation-h');
      }
    },
		
		_refreshDirection: function (newValue) {
			if (newValue == 'rtl') {
				this.element.addClass('ui-direction-rtl');
			} else {
				this.element.removeClass('ui-direction-rtl');
			}
		},
		
		destroy: function(){
			this.element.removeClass('ui-widget'
			  +' ui-toolbar'
				+' ui-widget-header'
				+' ui-helper-reset'
				+' ui-helper-clearfix'
				+' ui-corner-all'
				+' ui-direction-rtl'
				+' ui-orientation-h');
			this.element.find(' > *').removeClass('ui-toolbar-item');
	  }
	});
})(jQuery);