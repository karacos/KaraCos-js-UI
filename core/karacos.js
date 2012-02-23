(function($){
	$(function(){
		require(
				[
			 	"order!karacos/deps/json-template",
		        "order!karacos/deps/modernizr-1.6.min"
			    ],
				function(){
					"use strict";
					var $ = window.kcQuery;
					$('body').createPromiseEvent('kcready');
					$('body').createPromiseEvent('kccore');
					$(function(){
						//var $ = window.$;
						// Sync with backend
						Backbone.sync = function(method, model) {
							if (window.console && console.log) {
								console.log(method, JSON.stringify(model));
							}
							var url = model.get('url'),
								dataObject = model.toJSON(),
								method = '_update',
								result = false,
								idparts;
							delete dataObject.id;
							delete dataObject.url;
							
							if (model.getType() === "karacos:method") {
								idparts = model.id.split(":");
								method = idparts[3];
							} 
							$.ajax({ url: url,
								dataType: "json",
								contentType: 'application/json',
								async: false,
								cache: false,
								data: $.toJSON({
									'method' : method,
									'id' : 1,
									'params' : dataObject //that.pagedata
								}),
								context: document.body,
								type: "POST",
								success: function(data) {
									result = data;
								},
								failure: function() {
									result = false;
								}});
							return result;
						};

						VIE.ContainerManager.findAdditionalInstanceProperties = function(element, modelInstance){
							if (element.attr("lang") !== undefined) {
								modelInstance.set({lang: element.attr("lang")});
							}
							if (element.attr("url") !== undefined) {
								modelInstance.set({url: element.attr("url")});
							}
						};
						

					    
						
					    function karacosConstructor() {
							var that = {'$': window.jQuery,
									/**
									 *Options for jsontemplate
									 */
									'jst_options': {
										'more_formatters': {}
							        },
							        
							        /**
							         * Helper for activating Aloha
							         */
							        'activate_aloha': function(callback) {
							        	require(['vendor/ext-3.2.1/adapter/jquery/ext-jquery-adapter-debug'],
							        		function(){
							        			var
								        			scriptEl = document.createElement('link'),
								        			appendEl = document.head || document.getElementsByTagName('head')[0],
							        				loading = $('#alohaLoading');
							        			if (loading.length === 0) {
							        				loading = $('<div id="alohaLoading">');
							        				$('body').append(loading);
							        			}
							        			loading.dialog({modal: 'true', title:"Chargement de l'editeur"}).show();
							        			scriptEl.rel = 'stylesheet';
							        			scriptEl.href = '/_browser/aloha/src/css/aloha.css';
							        			scriptEl.id = 'aloha-style-include';
							        			scriptEl.setAttribute('type','text/css'); // */
							        			appendEl.appendChild(scriptEl);
							        			// Insert element for Aloha plugins lookup
							        			$('body').append('<div style="display: none"><img src="/_browser/aloha/src/require.js" data-aloha-plugins="common/format,common/link,common/image,extra/browser,extra/draganddropfiles,karacos/repository,karacos/imageslist"/></div>');
							        			require(['vendor/ext-3.2.1/ext-all-debug'],function() {
						        					require(['aloha-bootstrap'], function() {
						        						Aloha.ready(function(){
						        							loading.dialog('close');
						        							if (typeof callback === "function") {
						        								callback();
						        							}
						        						});
						        						window.jQuery = window.kcQuery;
						        					});	
							        			});
							        		} // wrapped function
							        	); // require
									},
							        /**
									 * Process a KaraCos action
									 * @param url
									 * @param method
									 * @param params
									 * @param callback
									 * @param error
									 */
									'action': function(object) {
										var data = { method: object.method,
												params: object.params || {},
												id: 1},
												async = (object.async === undefined) ? true : object.async;
										that.$.ajax({ url: object.url,
											dataType: "json",
											async: async,
											contentType: 'application/json',
											context: document.body,
											type: "POST",
											cache: false,
											data: $.toJSON(data),
											success: function(result) {
												if (result.success) {
													if (typeof object.callback === "function") {
														object.callback(result);
													}
												} else {
													if (typeof object.error === "function") {
														object.error(result);
													}
												}
											},
											failure: function() {
												if (typeof object.error === "function") {
													object.error();
												}
											}
										}); // POST
									},
									/**
									 * object param attributes :
									 * 		url string url
									 * 		form string form name
									 * 		callback function (data, form) -> success with params required
									 * 		error function() -> failure while getting form data and form
									 * 		noparams successfully called method with no params
									 */
									'getForm': function(object) {
										var url = (object.url === undefined || object.url === "") ? "/" : object.url,
												acturl = (url.substring(url.length - 1) == "/" ? url : (url +"/")) +
												object.form;
										
										that.$.ajax({ url: acturl,
											dataType: "json",
											async: true,
											cache: false,
											contentType: 'application/json',
											context: document.body,
											type: "GET",
											success: function(data) {
												if (data.success === true && typeof data.form === 'object') {
													$.ajax({ url: "/fragment/" + object.form +".jst",
														context: document.body,
														type: "GET",
														async: false,
														cache: false,
														success: function(form) {
															if (typeof object.callback !== "undefined") {
																object.callback(data,form);
															}
														},
														// TODO: Tests around parameters
														failure: function(p1,p2,p3) {
															params;
															object.error();
														}
													});
												} else if (data.success === true && typeof data.form === 'undefined') {
													// there is no params to give to method, call has already been processed
													if (object.noparams) {
														object.noparams(data);
													}
													
												} else {
													if (typeof object.error !== "undefined") {
														object.error(data);
													}
												}
											},
											failure: function() {
												if (typeof object.error !== "undefined") {
													object.error();
												}
											}
										}); // GET
									},
									'button': function(elems, callback) {
										var len = elems.length,
											elem;
										while (--len >= 0) {
											elem = $(elems.get(len));
											elem.click(function(event){
												var model = VIE.ContainerManager.getInstanceForContainer(elem),
													result;
												event.stopImmediatePropagation();
												event.preventDefault();
												result = Backbone.sync('process',model);
												if (typeof callback !== "undefined") {
													callback(result);
												}
											});
											
										}
										return elems;
									},
									'log': function(message) {
										if (window.console && console.log) {
											console.log(message);
										}
									},
									'change_page': function(data) {
										this.config.page_id = data.id;
										this.config.page_base_id = data.base_id;
										if (typeof data.page_url === "string") {
											this.config.page_url = data.page_url;
										}
										$("head title").text(data.title);
										$('head meta[property*="og:title"]').attr('content', data.title);
										$('head meta[property*="og:type"]').attr('content', data.type);
										$('head meta[property*="og:url"]').attr('content', data.url);
										if (typeof data.description === "string") {
											$('head meta[name*="description"]').attr('content',$(data.description).text());
										}
										if (typeof data.keywords === "string") {
											$('head meta[name*="keywords"]').attr('content',$(data.keywords).text());
										}
										$('head [property*="og:title"]').attr('content', data.title);
									},
									'parse_social': function() {
										if (this.config.auth.facebook) {
											if (typeof FB !== "undefined") {
												FB.XFBML.parse();
											}
										}
										if (typeof gapi !== "undefined") {
											gapi.plusone.go("social_plugins");
										}
									}
							}, karacos = null;

							karacos = function(param) {
								var len;
								if (typeof param === 'undefined') {
									return that;
								}
								if (typeof param === 'function') {
									if (window.console && console.log) {
										console.log("Binding function for karacosReady");
										console.log(param);
									}
									$('body').bind('kcready', param);
								} 
								if (typeof param === 'object') {
									if (typeof karacos.config !== "undefined") {
										throw Error("KaraCos object already initialized")
									}
									karacos.config = param;
									$('body').bind('kccore', function(){
										that.$.extend(true,karacos,that);
										window.KaraCos = KaraCos = karacos;
										define('karacos',[], function(){
											return karacos;
										});
										require(["karacos/core/karacos.ui"], function(ui) {
											ui.init(param);
											karacos.ui = ui;
										})
										if (window.console && console.log) {
											console.log("Triggering event kcready");
										}
										$('body').trigger('kcready',[karacos]);
									});
								}
								if (typeof param === 'string') {
									//do special stuff ? else process as jQuery selector
									return that.$(param);
								}
							}
							return karacos;
						}; // karacosConstructor
						window.KaraCos = karacosConstructor();
						$(function (){	
							console.log('Looking for karacos.auth');
							require(["karacos/core/karacos.auth"],
									function(){
								console.log('Triggering event kccore');
								$('body').trigger('kccore');
							});
							
						});
						window.onerror = function (msg, url, linenumber) {
							return true;
						};
					});
				});
	})
	define('karacos',[], function(){
		return window.KaraCos;
	});
})(window.kcQuery);
