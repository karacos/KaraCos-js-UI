(function(window, document){
	"use strict";
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
		console.log(method, JSON.stringify(model));
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
						url;
					
					if (typeof window.alohaQuery === "undefined") {
						this.$('head').append('<link href="/_browser/aloha/src/aloha.css" id="aloha-style-include" rel="stylesheet">')
						window.alohaQuery = this.$;
				
						//Ensure Namespace
						window.GENTICS = window.GENTICS || {};
						window.GENTICS.Utils = window.GENTICS.Utils || {};
						window.GENTICS.Aloha = window.GENTICS.Aloha || {};
						window.GENTICS.Aloha.settings = window.GENTICS.Aloha.settings || {};
						window.GENTICS.Aloha.ui = window.GENTICS.Aloha.ui || {};
						window.Aloha_loaded_plugins = window.Aloha_loaded_plugins || [];
						window.GENTICS_Aloha_pluginDir = window.GENTICS_Aloha_pluginDir || false;
						window.GENTICS_Aloha_base = window.GENTICS_Aloha_base || false;
						
						window.GENTICS_Aloha_base = '/_browser/aloha/src/';
						window.Aloha_loaded_plugins = window.Aloha_loaded_plugins||[];
						window.Aloha_loaded_plugins['format'] = true;
						window.Aloha_loaded_plugins['link'] = true;
						window.Aloha_loaded_plugins['linkchecker'] = true;
						window.Aloha_loaded_plugins['table'] = true;
						includes.push('util/base.js');
						includes.push('dep/ext-3.2.1/adapter/jquery/ext-jquery-adapter.js');
						includes.push('dep/ext-3.2.1/ext-all.js');
						includes.push('dep/jquery.getUrlParam.js');
						includes.push('dep/jquery.store.js');
						includes.push('core/jquery.js');
						includes.push('util/lang.js');
						includes.push('util/range.js');
						includes.push('util/position.js');
						includes.push('util/dom.js');
						includes.push('core/ext-alohaproxy.js');
						includes.push('core/ext-alohareader.js');
						includes.push('core/ext-alohatreeloader.js');
						includes.push('core/core.js');
						includes.push('core/ui.js');
						includes.push('core/ui-attributefield.js');
						includes.push('core/ui-browser.js');
						includes.push('core/editable.js');
						includes.push('core/event.js');
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
						includes.push('plugin/format/src/format.js');
						includes.push('plugin/link/src/link.js');
						includes.push('plugin/linkchecker/src/linkchecker.js');
						includes.push('plugin/table/src/table.js');
						for (var i=0,n=includes.length; i<n; ++i ) {
							value = includes[i];
							url = window.GENTICS_Aloha_base + '/' + value;
							window.jQuery.ajax({
								dataType : 'script',
								async: false,
								url: url,
							});		
							
						}
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
				}
		};

		function karacos(param) {
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
					console.log('immediate run of method');
					console.log(param);
					try {
						param();
					} catch (e) {
						console.log(e);
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
						console.log("running func " + i);
						console.log(karacos.initMethods[i]);
						karacos.initMethods[i]();
					} catch (e) {
						console.log(e);
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
	
	KaraCos = karacosConstructor();
	
	window.onerror = function (msg, url, linenumber) {
		return true;
	};
})(window, document);