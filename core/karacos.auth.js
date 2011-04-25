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
			that.menucontainer = KaraCos('<span id="karacos_actions_toolbar" class="ui-widget-header ui-corner-bl ui-corner-br" style="padding: 10px 4px;"></span>');
			elem.empty().append(that.menucontainer);
			if (that.menucontainer.length !== 0) { // if not none
				that.menucontainer.empty();
				if (isconnected) {
					if (this.user_actions_forms.fullname) {
						username = this.user_actions_forms.fullname;
					}
					KaraCos.$.ajax({ url: '/fragment/actions_menu.html?instance_id=' +
							KaraCos.config.page_id + "&base_id=" + KaraCos.config.page_base_id,
						async: true,
						context: document.body,
						type: "GET",
						success: function(data) {
							that.menucontainer.empty().append(data);
						}
					});
					
				} else {
					if (typeof FB !== 'undefined') {
						fblogin = KaraCos('<button>Se connecter avec facebook</button>');
						fblogin.button().click(function(){
							FB.login(function(response) {
								  if (response.session) {
								    // user successfully logged in
								  } else {
								    // user cancelled login
								  }
								});
							}, {perms:'email'});
						that.menucontainer.append(fblogin);
					
				}
				login = KaraCos('<button>Se connecter (inscription au site)</button>');
				login.button().click(function(){
					that.provideLoginUI(function(){
						that.authenticationHeader(elem);
					});
				});
				that.menucontainer.append(login);
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
			var auth = this;
			KaraCos.action({url:"/",
				method:"logout", 
				params:{},
				callback: function(){
					if (typeof FB !== 'undefined') {
						FB.logout();
					}
					auth.userConnected = false;
					auth.authenticationHeader();
				}
			});
		};
		
		/**
		 * 
		 */
		this.login = function(useractionsforms){
			var auth = this;
			auth.userConnected = true;
			auth.user_actions_forms = useractionsforms;
			KaraCos.$.ajax({
				url: History.getState().url,
				headers: {'karacos-fragment': 'true'},
				success: function(data) {
					KaraCos(KaraCos.config.main_content).empty().append(data);
				}
			});
			auth.authenticationHeader();
			
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
					
					var login_form_template = jsontemplate.Template(form, KaraCos.jst_options);
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
		that.authenticationHeader();
	}; // function authManager
	KaraCos(function(){
		KaraCos.authManager = new authManager(KaraCos.config.auth);
	});
})(window, document);
