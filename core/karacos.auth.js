(function(window, document){
	var KaraCos = window.KaraCos;
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
				elem = KaraCos.$('#header_auth_button');
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
					logout = KaraCos('<button>Se déconnecter</button>');
					logout.click(function(){
						that.logout();
					});
					elem.append(logout);
				} else {
					if (typeof FB !== 'undefined') {
						fblogin = KaraCos('<button>Se connecter avec facebook</button>');
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
				login = KaraCos('<button>Se connecter (inscription au site)</button>');
				login.click(function(){
					that.provideLoginUI(function(){
						that.authenticationHeader(elem);
					});
				});
				elem.append(login);
			}
			}
		};
		
		/**
		 * 
		 * 
		 */
		this.processFBCookie = function(){
			var that = this;
			KaraCos.$.ajax({ url: "/_process_facebook_cookie",
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
						return this.userConnected;
					}
				} else { // user known in karacos
					this.userConnected = true;
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
					} else {
						that.userConnected = false;
						that.authenticationHeader();
					}
				}
			});
		};
		
		/**
		 * 
		 */
		this.login = function(useractionsforms){
			that.userConnected = true;
			that.user_actions_forms = useractionsforms;
			that.authenticationHeader();
			
		};
		/**
		 * 
		 * @param callback
		 * @returns
		 */
		this.provideLoginUI = function(callback, error){
			var that = this;
			if (this.isUserConnected()) {
				callback();
				return;
			}
			this.loginWindow = $('#login_form_window');
			if (this.loginWindow.length === 0) {
				KaraCos.$('body').append('<div id="login_form_window"/>');
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
						$('.kc_fb_title').remove();
						$('.kc_fb_box').remove();
					}
					that.loginWindow.find('.form_login_button').button()
					.click(function() {
						var params = {},
							method = 'login';
						$.each($(this).closest('form').serializeArray(), function(i, field) {
							if (field.name === "method") {
								method = field.value;
							} else {
								params[field.name] = field.value;
							}
						}); // each
						KaraCos.action({ url: "/",
							method: method,
							async: false,
							params: params,
							callback: function(data) {
								if (data.success) {
									that.login(data.data);
									that.loginWindow.dialog('close');
									if (typeof callback !== "undefined") {
										callback();
									} else {
										error();
									}
								}
							},
							error: function(data) {
								that.userConnected = false;
								error();
							}
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
			try {
				KaraCos.$.ajax({
					url:'http://connect.facebook.net/en_US/all.js',
					async: true,
					dataType: 'script',
					success: function() { 
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
							} // done
						});
						that.authenticationHeader();
					},
					failure: function() {
						alert('Error while loading facebook');
					}
				}); // get script facebook
				
			} catch (e) {
				console.log('Facebook loading failure');
			}
		}
	}; // function authManager
	KaraCos(function(){
		KaraCos.authManager = new authManager(KaraCos.config.auth);
	});
})(window, document);