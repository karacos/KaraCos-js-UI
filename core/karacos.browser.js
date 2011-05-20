
	
/**
 * Initialize or update existing Browser instance
 * 
 * config example
 * {'panels':
			[{  type:'grid',
				selectiontype: 'single',
				// url of a jsontemplate exposing Data as RDFa entities
				template: '/fragment/set_main_pic_grid.jst',
				datasource:{
					// type of datasource
					'type':'json',
					// url of datasource
					'url':'${instance._get_action_url()}/get_atts',
				},
				onselect: function(items){
					 // Callback, what to do when selection occurs
					 // @param items Backbone model array (maybe collection) of selected items
					 
				}
			}]
		}
 */
KaraCos.Browser = function(config) {
	var self = this;
	this.show = function() {
		this.$browserdiv.dialog('hide');
	}
	this.hide = function() {
		this.$browserdiv.dialog('hide');
	}
	if (this.$browserdiv === undefined) {
		this.$browserdiv = KaraCos('#karacos_browser_window');
		if (this.$browserdiv.length <= 0)
			KaraCos('body').append('<div id="karacos_browser_window" style="display:hidden">');
			this.$browserdiv = KaraCos('#karacos_browser_window');
	}
	if (config.panels !== undefined) {
		this.$browserdiv.empty();
		jQuery.each(config.panels, function(i,panel) {
			var $panel = KaraCos("<div>");
			if (panel.datasource !== undefined) {
				$.ajax({ url: panel.template,
					context: document.body,
					type: "GET",
					async: true,
					success: function(formsrc) {
						var template = jsontemplate.Template(formsrc, KaraCos.jst_options);
						KaraCos.$.ajax({ url: panel.datasource.url,
							dataType: "json",
							async: true,
							type: "POST",
							contentType: 'application/json',
							data: $.toJSON(panel.datasource.params),
							success: function(data) {
								$panel.append(template.expand(data));
							}
						});
					}
				});
			}
			
			
			self.$browserdiv.append($panel);
		});
		self.$browserdiv.dialog({width: '600px', modal:false});
	}
}
