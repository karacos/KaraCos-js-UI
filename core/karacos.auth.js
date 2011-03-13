(function(){
	/**
	 * 
	 * @returns
	 */
	function authManager(config) {
	
		/**
		 * Draw authentication header in elem.
		 * If no elem specified, looksup for #header_auth_button
		 * @param elem jQuery object where button will be written (can be multiple)
		 */
		this.authenticationHeader = function(elem){
			var that = this,
			isconnected = this.isUserConnected(),
			username = this.user_actions_forms.user,
			logout,
			login,
			fblogin;
			if (elem === undefined) {
				// default id
				elem = jQuery('#header_auth_button');
			}
			if (typeof elem === 'string') {
				elem = KaraCos(elem);
			}
			if (elem.length !== 0) { // if not none
				elem.empty();
				if (isconnected) {
					if (this.user_actions_forms.fullname) {
						username = this.user_actions_forms.fullname;
					}
					elem.append('<p>Bienvenue '+ username +'</p>');
					//TODO i18n
					logout = jQuery('<button>Se déconnecter</button>');
					logout.click(function(){
						that.logout();
					});
					elem.append(logout);
				} else {
					if (that.config.facebook) {
						fblogin = jQuery('<button>Se connecter avec facebook</button>');
						fblogin.click(function(){
							FB.login(function(response) {
								  if (response.session) {
								    // user successfully logged in
								  } else {
								    // user cancelled login
								  }
								});
							}, {perms:'email'});
						elem.append(fblogin);
					
				}
				elem.append('<button>Se connecter (inscription au site)</button>');
			}
			}
		};
		
		/**
		 * 
		 * 
		 */
		this.processFBCookie = function(){
			var that = this;
			jQuery.ajax({ url: "/_process_facebook_cookie",
				context: document.body,
				type: "GET",
				async: true,
				dataType: "json",
				contentType: 'application/json',
				success: function(data) {
					that.user_actions_forms = data.data;
				}});
		};
		
		/**
		 * 
		 * @returns {Boolean}
		 */
		this.isUserConnected = function(){
			var that = this;
			if (this.userConnected === undefined) {
				if (this.user_actions_forms.user.search('anonymous') >= 0) {
					// user not connected in karacos
					if (typeof FB !== 'undefined') {
						FB.getLoginStatus(function(response) {
							if (response.session) { // logged in and connected user, someone you know
								// process login to karacos with fb id
								that.processFBCookie();
								return that.userConnected = true;
							} else { // Not connected in KaraCos nor in facebook
								return that.userConnected = false;
							}
						});
					} else {
						return this.userConnected = false;
					}
				} else { // user known in karacos
					return this.userConnected = true;
				}
			}
			return this.userConnected;
		};
		
		/**
		 * 
		 */
		this.logout = function(){
			var that = this;
			KaraCos.action({url:"/",
				method:"logout", 
				params:{},
				callback: function(){
					if (typeof FB !== 'undefined') {
						FB.logout();
					}
					that.userConnected = false;
				}
			});
		};
		
		/**
		 * 
		 * @param callback
		 * @returns
		 */
		this.provideLoginUI = function(callback){
			var that = this;
			if (this.isUserConnected()) {
				callback();
				return;
			}
			this.loginWindow = $('#login_form_window');
			if (this.loginWindow.length === 0) {
				jQuery('body').append('<div id="login_form_window"/>');
				this.loginWindow = $('#login_form_window');
			} // sa.length
			KaraCos.getForm({
				url: "/",
				form: "login",
				callback: function(data, form) {
					
					var login_form_template = jsontemplate.Template(form);
					that.loginWindow.empty().append(login_form_template.expand(data));
					$('#karacos_login_accordion').accordion({
						autoHeight: false,
						navigation: true});
					if (typeof FB !== 'undefined') {
						$.each($('.kc_fb_box'), function (index, elem) {
							FB.XFBML.parse(elem);
						});
					} else {
						$('.kc_fb_box').empty();
					}
					that.loginWindow.find('.form_login_button').button()
					.click(function() {
						var data = { method: "",
								params: {},
								id: 1}
						$.each($(this).closest('form').serializeArray(), function(i, field) {
							if (field.name === "method") {
								data.method = field.value;
							} else {
								data.params[field.name] = field.value;
							}
						}); // each
						jQuery.ajax({ url: "/",
							dataType: "json",
							async: false,
							contentType: 'application/json',
							context: document.body,
							type: "POST",
							data: $.toJSON(data),
							success: function(data) {
								if (data.success) {
									that.loginWindow.dialog('close');
									if (typeof callback !== "undefined") {
										callback();
									}
								}
							},
						}); // POST login form
					});  // click
					that.loginWindow.dialog({width: '600px', modal:true}).show();
				} // get form success
			});			
		};
		//*****************************************************
		// Start the constructor
		var that = this;
		this.config = config;
		KaraCos.action({
			url:'/',
			method:'get_user_actions_forms',
			async: false,
			callback:function(data) {
				that.user_actions_forms = data.data;
			}
		});
		if (this.config.facebook) {
			jQuery.getScript('http://connect.facebook.net/en_US/all.js', function() { 
				FB.init(that.config.facebook);
				/* Below are facebook events
				 * Facebook events :
				 * auth.login -- fired when the user logs in
				 * auth.logout -- fired when the user logs out
				 * auth.sessionChange -- fired when the session changes
				 * auth.statusChange -- fired when the status changes
				 * xfbml.render -- fired when a call to FB.XFBML.parse() completes
				 * edge.create -- fired when the user likes something (fb:like)
				 * edge.remove -- fired when the user unlikes something (fb:like)
				 * comment.create -- fired when the user adds a comment (fb:comments)
				 * comment.remove -- fired when the user removes a comment (fb:comments)
				 * fb.log -- fired on log message
				 */
				FB.Event.subscribe('auth.login', function(response) {
					that.userConnected = true;
					that.processFBCookie();
					that.authenticationHeader();
				});
				FB.Event.subscribe('auth.logout', function(response) {
					that.userConnected = false;
					that.authenticationHeader();
				});
				FB.getLoginStatus(function(response) {
					if (response.session) { // logged in and connected user, someone you know
						// process login to karacos with fb id
						that.processFBCookie();
						that.userConnected = true;
					} else { // Not connected in KaraCos nor in facebook
						that.userConnected = false;
					}
				});
				that.authenticationHeader();
			}); // get script facebook
		}
	}; // function authManager
	KaraCos(function(){
		KaraCos.authManager = new authManager(KaraCos.config.auth);
	});
})();