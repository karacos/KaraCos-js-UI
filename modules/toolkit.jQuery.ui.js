define("karacos/modules/toolkit.jQuery.ui",
[
	"jquery",
	"karacos/deps/history/scripts/uncompressed/history",
	"karacos/deps/history/scripts/uncompressed/history.html4",
	"karacos/deps/history/scripts/uncompressed/history.adapter.jquery",
	"karacos/deps/jquery-ui-1.8.14.custom",
	"karacos/deps/ui.menu",
	"karacos/deps/ui.panel",
	"karacos/deps/ui.toolbar",
],
function($) {
	var karacos,
		History = window.History;  // Note: We are using a capital H instead of a lower h
	$('body').bind('kcauth', function(){
		karacos = window.KaraCos;
		if ( !History.enabled ) {
			// History.js is disabled for this browser.
			// This is because we can optionally choose to support HTML4 browsers or not.
			return false;
		}
		// Bind to StateChange Event
		History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
			var State = History.getState(); // Note: We are using History.getState() instead of event.state
			//History.log(State.data, State.title, State.url);
			$.ajax({
				url: State.url,
				cache: false,
				headers: {'karacos-fragment': 'true'},
				success: function(data) {
					$(KaraCos.config.main_content).empty().append(data);
				}
			});
		});
	});
    
	return {
		"alert": function(message, buttons) {
			var 
			ui = this,
			button;
		if (typeof ui.alert_box === "undefined") {
			ui.alert_box = $('#kc_alert_box');
			if (ui.alert_box.length === 0) {
				ui.alert_box = $('<div id="kc_alert_box"/>');
				$('body').append(ui.alert_box);
			} //kc_alert_box
		} // now my alert_box elem exists
		// So append the message here :
		ui.alert_box.empty().append(message);
		if (typeof buttons !== "undefined") {
			//append buttons container
			ui.alert_box.append('<div class="kc_alert_btn_container"/>');
			$.each(buttons, function(index,button){
				//append each button
				ui.alert_box.children(":last")
					.append('<button>'+button.label+'</button>')
					.children(":last").button().click(
						function(event){
							var $button = $(this);
							if (typeof button.callback !== "undefined") {
								button.callback();
							}
							ui.alert_box.dialog('close');
						});
			});
		}
		ui.alert_box.dialog({width: '400px', modal:true});
		ui.alert_box.dialog('show');
		}
	}
	
});