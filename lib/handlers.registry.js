/**
 * 
 */
define("karacos/lib/handlers.registry", ["jquery"], function($){
	var karacos, auth, handlersRegistry;
	$('body').bind('kcauth', function(){
		karacos = KaraCos;
		auth = karacos.authManager;
	});
	handlersRegistry = {
		/**
		 * Container for handlers.
		 * each handler signature :
		 *    data : json value returned by te backend
		 *    $form: jQuery collection with original action form
		 *    callback: callback function( error, result)
		 *        if error !== null, backend returned an error or unexpected result
		 *        handler may process known error values before considering releasing an error callback
		 */
		returnHandlers: {},
		/**
		 * Form validation handlers
		 * takes a jQuery collection with original action form as unique parameter
		 */
		formValidation: {},
		/**
		 * 
		 */
		handle_action_form: function(form, callback) {
			var action_name = form.find('[kc-action]').attr("kc-action");
			// form.find('[kc-action]').length()
			if (typeof handlersRegistry.formValidation[action_name] === "function") {
				handlersRegistry.formValidation[action_name](form);
			}
			if (typeof handlersRegistry.returnHandlers[action_name] === "function") {
				form.find('button').click(function(e) {
					e.preventDefault();
					e.stopImmediatePropagation();
					form.submit();
				});
				form.bind('submit',function(e) {
					var
						$form = $(e.target),
						method,
						params = {},
						url = $form.attr('action') ;
					e.preventDefault();
					e.stopImmediatePropagation();
					try { // disable button causing the action but silently fail if unappropriate
						$('[kc-action="'+action_name+'"]').button("disable");
					} catch(e) {}
					$.each($form.serializeArray(), function(i,e) {
						if (e.name === "method") {
							method = e.value;
						} else {
							params[e.name] = e.value;
						}
					});
					$.ajax({
						url: url,
						type: 'POST',
						dataType: "json",
						cache: false,
						contentType: 'application/json',
						context: document.body,
						async: true,
						data: $.toJSON({method: method, id:1, params: params}),
						success: function(data) {
							handlersRegistry.returnHandlers[action_name](data, $form, callback);
						}
					})
				});
			}
		}
	}
	return handlersRegistry;
});