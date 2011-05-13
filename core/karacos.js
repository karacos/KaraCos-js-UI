(function(window, document){
	"use strict";
	var win = window;
	//Dependencies 
	if (Backbone === 'undefined') {
		jQuery.ajax({
			url:'http://github.com/karacos/KaraCos-UI-js/raw/deps/Backbone.js',
			async: false,
			dataType: 'script',
			success: function() { 
				
			}
		});
	}
	if (VIE === 'undefined') {
		jQuery.ajax({
			url:'http://github.com/karacos/KaraCos-UI-js/raw/deps/VIE.js',
			async: false,
			dataType: 'script',
			success: function() { 
				
			}
		});
	}
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
		
		if (model.type === "karacos:method") {
			idparts = model.id.split(":");
			method = idparts[3];
		} 
		$.ajax({ url: url,
			dataType: "json",
			contentType: 'application/json',
			async: false,
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
		if (element.attr("lang") != "") {
			modelInstance.set({lang: element.attr("lang")});
		}
		if (element.attr("url") != "") {
			modelInstance.set({url: element.attr("url")});
		}
	}

    // Prepare
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log(State.data, State.title, State.url);
        KaraCos.$.ajax({
			url: State.url,
			headers: {'karacos-fragment': 'true'},
			success: function(data) {
				KaraCos(KaraCos.config.main_content).empty().append(data);
			}
		});
    });

	function karacosConstructor() {
		var that = {'$': window.jQuery,
				/**
				 *Options for jsontemplate
				 */
				'jst_options': {
					'more_formatters': {}
		        },
		        'activate_aloha': function() {
		        	var
		    		includes = [],
		    		$body = $('body'),
		    		counter = 0,
		    		scriptEl,
		    		appendEl = document.head;
		    	function loadJsFileAtIncludesCounter() {
		    		scriptEl = document.createElement('script');
		    		scriptEl.src = window.GENTICS_Aloha_base + '/' + includes[counter++];
		    		scriptEl.setAttribute('defer','defer'); 
		    		scriptEl.onload = function(event) {
		    			$body.trigger('alohaLoadJs',{'file':includes[counter],'ref': counter});
		    		};
		    		appendEl.appendChild(scriptEl);
		    	}

					if (typeof window.alohaQuery === "undefined") {
						this.$('head').append('<link href="/_browser/aloha/src/aloha.css" id="aloha-style-include" rel="stylesheet">')
						window.alohaQuery = this.$;
//				
						// Define recursive event handler
						$body.bind('alohaLoadJs', function(event, data){
							if (includes.length > counter) {
								loadJsFileAtIncludesCounter();
							}else {
								//Last file loaded
								var $body = $('body');
								$body.createPromiseEvent('aloha');
								window.Aloha.init();
							}
						});
//						//Ensure Namespace
						window.GENTICS = window.GENTICS || {};
						window.GENTICS.Utils = window.GENTICS.Utils || {};
						window.Aloha = window.Aloha || {};
						window.Aloha.settings = window.Aloha.settings || {};
						window.Aloha.ui = window.Aloha.ui || {};
						window.Aloha_loaded_plugins = window.Aloha_loaded_plugins || [];
						window.Aloha_pluginDir = window.Aloha_pluginDir || false;
						window.Aloha_base = window.Aloha_base || false;						
						window.GENTICS_Aloha_base = '/_browser/aloha/src';
						window.Aloha_loaded_plugins = window.Aloha_loaded_plugins||[];
//						window.Aloha_loaded_plugins['format'] = true;
//						window.Aloha_loaded_plugins['link'] = true;
//						window.Aloha_loaded_plugins['image'] = true;
//						window.Aloha_loaded_plugins['highlighteditables'] = true;
						/*
						window.Aloha_loaded_plugins['link'] = true;
						window.Aloha_loaded_plugins['linkchecker'] = true;
						window.Aloha_loaded_plugins['table'] = true;
						window.Aloha_loaded_plugins['format'] = true;
						*/
						var appendEl = document.head,
					    	scriptEl = document.createElement('div');
						scriptEl.src = '/_browser/aloha/src/aloha.js';
						scriptEl.id = 'aloha-script-include';
						scriptEl.setAttribute('data-plugins', "format,link,highlighteditables,image");
						//scriptEl.setAttribute('defer','defer'); // */
						appendEl.appendChild(scriptEl);
						
						includes.push('util/base.js');
						includes.push('dep/ext-3.2.1/adapter/jquery/ext-jquery-adapter.js');
						includes.push('dep/ext-3.2.1/ext-all.js');
						includes.push('dep/jquery.json-2.2.min.js');
						includes.push('dep/jquery.getUrlParam.js');
						includes.push('dep/jquery.store.js');
						includes.push('util/lang.js');
						includes.push('util/range.js');
						includes.push('util/position.js');
						includes.push('core/jquery.aloha.js');
						includes.push('util/dom.js');
						includes.push('core/ext-alohaproxy.js');
						includes.push('core/ext-alohareader.js');
						includes.push('core/ext-alohatreeloader.js');
						includes.push('core/core.js');
						includes.push('core/ui.js');
						includes.push('core/ui-attributefield.js');
						includes.push('core/ui-browser.js');
						includes.push('core/editable.js');
						includes.push('core/floatingmenu.js');
						includes.push('core/ierange-m2.js');
						includes.push('core/log.js');
						includes.push('core/markup.js');
						includes.push('core/message.js');
						includes.push('core/plugin.js');
						includes.push('core/selection.js');
						includes.push('core/sidebar.js');
						includes.push('core/repositorymanager.js');
						includes.push('core/repository.js');
						includes.push('core/repositoryobjects.js');
//						includes.push('plugin/format/src/format.js');
//						includes.push('plugin/link/src/link.js');
//						includes.push('plugin/image/src/image.js');
//						includes.push('plugin/highlighteditables/src/highlighteditables.js');
						
						
						//Initialize
						loadJsFileAtIncludesCounter();
					}
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
						data: $.toJSON(data),
						success: function(result) {
							if (result.success) {
								if (typeof object.callback !== "undefined") {
									object.callback(result);
								}
							} else {
								if (typeof object.error !== "undefined") {
									object.error(result);
								}
							}
						},
						failure: function() {
							if (typeof object.error !== "undefined") {
								object.error();
							}
						}
					}); // POST
				},
				'getForm': function(object) {
					var url = (object.url === undefined || object.url === "") ? "/" : object.url,
							acturl = (url.substring(url.length - 1) == "/" ? url : (url +"/")) +
							object.form;
					
					that.$.ajax({ url: acturl,
						dataType: "json",
						async: true,
						contentType: 'application/json',
						context: document.body,
						type: "GET",
						success: function(data) {
							if (data.success) {
								$.ajax({ url: "/fragment/" + object.form +".jst",
									context: document.body,
									type: "GET",
									async: false,
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
							} else {
								if (typeof error !== "undefined") {
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
						elem = KaraCos.$(elems.get(len));
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
				'alert': function(message, buttons) {
					var button;
					if (typeof KaraCos.alert_box === "undefined") {
						KaraCos.alert_box = KaraCos('#kc_alert_box');
						if (KaraCos.alert_box.length === 0) {
							KaraCos('body').append('<div id="kc_alert_box"/>');
							KaraCos.alert_box = KaraCos("#kc_alert_box");
						} //kc_alert_box
					} // now my alert_box elem exists
					// So append the message here :
					KaraCos.alert_box.empty().append(message);
					if (typeof buttons !== "undefined") {
						//append buttons container
						KaraCos.alert_box.append('<div class="kc_alert_btn_container"/>');
						KaraCos.$.each(buttons, function(index,button){
							//append each button
							KaraCos.alert_box.children(":last")
								.append('<button>'+button.label+'</button>')
								.children(":last").button().click(
									function(event){
										var $button = KaraCos.$(this);
										if (typeof button.callback !== "undefined") {
											button.callback();
										}
										KaraCos.alert_box.dialog('close');
									});
						});
					}
					KaraCos.alert_box.dialog({width: '400px', modal:true});
					KaraCos.alert_box.dialog('show');
				},
				'log': function(message) {
					if (window.console && console.log) {
						console.log(message);
					}
				}
		};

		function karacos(param) {
			var len;
			if (typeof param === 'undefined') {
				return that;
			}
			if (typeof param === 'function') {
				if (that.initMethods === undefined) {
					that.initMethods = [];
				}
				if (typeof that.config === "undefined") {
					that.initMethods.push(param);
				} else {
					if (window.console && console.log) {
						console.log('immediate run of method');
						console.log(param);
					}
					try {
						param();
					} catch (e) {
						if (window.console && console.log) {
							console.log(param);
						}
					}
				}
				return;
			} 
			if (typeof param === 'object') {
				if (typeof karacos.config !== "undefined") {
					throw Error("KaraCos object already initialized")
				}
				that.$.extend(true,karacos,that);
				karacos.config = param;
				len = karacos.initMethods.length;
				KaraCos = karacos;
				for (var i = 0; i < len ; i++) {
					try{
						if (window.console && console.log) {
							console.log("running func " + i);
							console.log(karacos.initMethods[i]);
						}
						karacos.initMethods[i]();
					} catch (e) {
						if (window.console && console.log) {
							console.log(e);
						}
					}
				}
				return karacos;
			}
			if (typeof param === 'string') {
				//do special stuff ? else process as jQuery selector
				return that.$(param);
			}
		}
		return karacos;
	}; // karacosConstructor
	
	window.KaraCos = karacosConstructor();
	
	window.onerror = function (msg, url, linenumber) {
		return true;
	};
})(window, document);