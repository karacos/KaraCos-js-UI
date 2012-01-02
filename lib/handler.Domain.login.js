define("karacos/lib/handler.Domain.login",
	["jquery",
	 "karacos/lib/handlers.registry"
	], function($, handlersRegistry){
		var karacos, auth;
		$('body').bind('kcauth', function(){
			karacos = KaraCos;
			auth = karacos.authManager;
		};
		handlersRegistry.returnHandlers['login'] = function(data, $form, callback) {
			if (data.success === true && typeof callback === "function") {
				callback(null, data);
			} else {
				callback(data, null);
			}
		};
		return handlersRegistry;
});