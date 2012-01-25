require(
	['jquery'],
	function($) {
	//var $ = window.kcQuery;
	//$(function(){
		$('body').createPromiseEvent('kcauth');
		$('body').bind('kccore',function(){ //
			//var KaraCos = karacos;
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
					menucontainer;
					
					if (elem === undefined) {
						// default id
						elem = $('#header_auth_button');
					}
					if (typeof elem === 'string') {
						elem = $(elem);
					}
					menucontainer = elem.find('#karacos_actions_toolbar');
					if (menucontainer.length === 0) {
						menucontainer = $('<div id="karacos_actions_toolbar"></div>');
						elem.append(menucontainer);
					}
					// request (and draw action menu for current node
					$('body').bind('kcui', function(){
						$('body').trigger('authStateChange');
//					require(['/fragment/actions_menu.js?instance_id=' +
//			         KaraCos.config.page_id + "&base_id=" + KaraCos.config.page_base_id],
//			         function(menutool) {
//							menutool.drawMenu(menucontainer.empty());
//						});
					});
				};
				
				/**
				 * Send facebook data to karacos
				 * 
				 */
				this.processFBCookie = function(){
					var that = this;
					function sendFacebookInfo(data) {
						KaraCos.action({ url: "/",
							method: 'modify_person_data',
							params: data,
							callback: function(data) {
								that.user_actions_forms = data.data;
							}
						});
						
					}
					function grabGraphData(url, callback) {
						FB.api(url, function(response) {
							var data = {};
							data["facebook" + url ] = response;
							sendFacebookInfo(data);
							if (callback) {
								callback(response);
							}
						})
					}
			        KaraCos.$.ajax({ url: "/_process_facebook_cookie",
		    	          context: document.body,
		    	          type: "GET",
		    	          async: true,
		    	          cache: false,
		    	          dataType: "json",
		    	          contentType: 'application/json',
		    	          success: function(data) {
		    	            that.user_actions_forms = data.data;
			          }});
					grabGraphData('/me');
					grabGraphData('/me/friends');
					grabGraphData('/me/likes');
					grabGraphData('/me/groups');
					grabGraphData('/me/music');
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
							this.userConnected = true;
						}
					}
					return this.userConnected;
				};
				
				/**
				 * 
				 */
				this.logout = function(callback){
					var auth = this;
					KaraCos.action({url:"/",
						method:"logout", 
						params:{},
						callback: function(){
							if (typeof FB !== 'undefined') {
								FB.logout();
							}
							auth.userConnected = false;
							KaraCos.action({
								url:'/',
								method:'get_user_actions_forms',
								async: false,
								callback:function(data) {
									auth.user_actions_forms = data.data;
									if (typeof callback === "function") {
										callback();
									}
								}
							});
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
						cache: false,
						headers: {'karacos-fragment': 'true'},
						success: function(data) {
							KaraCos(KaraCos.config.main_content).empty().append(data);
						}
					});
					auth.authenticationHeader();
					
				};
				this.getUserActions = function() {
					var auth = this;
					if (typeof auth.current_page === "undefined" || KaraCos.config.page_url !== auth.current_page[0]) {
						KaraCos.action({url:KaraCos.config.page_url,
							method:"get_user_actions_forms", 
							params:{},
							async: false,
							callback: function(result){
								auth.current_page = [KaraCos.config.page_url, result.data] ;
							}
						});
					}
					return auth.current_page[1];
				};
				this.hasAction = function(actionName) {
					var
						getUserActions = false;
					if (typeof this.current_page === "undefined"){
						getUserActions = true;
					} else {
						if (KaraCos.config.page_url !== this.current_page[0]) {
							getUserActions = true;
						}
					}
					if (getUserActions) {
						this.getUserActions();
					} 
					return this.current_page[1].actions.map(
							function(e,i,a) {
								if (e.action === actionName) {
									return true;
								}
							}).reduce(function(r,e,i) {
								//console.log(arguments)
								if (r === true || e === true) {
									return true;
								}
							});
								
				};
				/**
				 * Check if user is authorized to compute given action name
				 * 
				 */
				this.hasDomainAction = function(actionName) {
					var result = false;
					
					// TODO : bench this solution and the next one...
//					$.each(this.user_actions_forms.actions, function(id,action){
//						if (action.action === actionName) {
//							result = true;
//						}
//					})
//					
					return KaraCos.authManager.user_actions_forms.actions.map(
							function(e,i,a) {
								if (e.action === actionName) {
									return true;
								}
							}).reduce(function(r,e,i) {
								//console.log(arguments)
								if (r === true || e === true) {
									return true;
								}
								
							});
				};
				
				this.getForm = function(actionName) {
					return KaraCos.authManager.user_actions_forms.actions.map(
							function(e,i,a) {
								if (e.action === actionName) {
									return e;
								}
							}).reduce(function(r,e,i) {
								//console.log(arguments);
								if (r !== undefined || e !== undefined) {
									if (e !== undefined) {
										return e;
									} else {
										return r;
									}
								}
								
							});
					
				};
				/**
				 * 
				 * @param callback
				 * @returns
				 */
				this.provideLoginUI = function(callback, error, message){
					var 
						that = this;
					if (this.isUserConnected()) {
						callback();
						return;
					}
					if (typeof error !== "function") {
						message = error;
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
							var 
								login_form_template = jsontemplate.Template(form, KaraCos.jst_options);
							
							data.redirect_uri = "http://" + KaraCos.config.fqdn + KaraCos.config.page_url;
							data.message = message;
							
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
											that.current_page = undefined;
											that.user_actions_forms = undefined;
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
							that.loginWindow.dialog({width: '600px', modal:true, 'title': "Connexion au site"}).show();
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
				if (this.config.facebook) { //processing facebook initialization
					try {
						KaraCos.$.ajax({
							url:'http://connect.facebook.net/en_US/all.js',
							async: true,
							cache: false,
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
										that.authenticationHeader();
									} // done
								});
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
			$('body').bind('kcready',function(){
				if (window.console && console.log) {
					console.log("authManager initialization");
				}
				//KaraCos = karacos;
				KaraCos.authManager = new authManager(KaraCos.config.auth);
				$('body').trigger('kcauth', KaraCos.authManager);
			});
		});
	});
