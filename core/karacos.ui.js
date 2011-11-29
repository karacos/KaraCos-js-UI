define("karacos/core/karacos.ui", ["jquery"], function($){
	var karacos;
	$('body').createPromiseEvent('kcui');
	$('body').bind('kcui', function() {console.log("UI initialization done")});
	$('body').bind('kcauth', function(){
		karacos = window.KaraCos;
	});
	return {
			'init': function(config) {
				function initToolkit(toolkit){
					ui.toolkit = toolkit;
					$('body').trigger('kcui');
				}
				var ui = this;
				console.log("Initializing UI");
				if (typeof config.toolkit === "string") {
					require([config.toolkit], initToolkit);
				} else {
					require(["karacos/modules/toolkit.jQuery.ui"], initToolkit);
				}
				
			},
			'alert': function(message, buttons) {
				var ui = this;
					ui.toolkit.alert(message, buttons);
			}
	}
});