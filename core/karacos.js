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
		//if(model.hasChanged()) {
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
				//dataObject.id = idparts[2]; 
			} 
//			else {
//				if (model.type.split(":")[0] === "karacos") {
//					for (var property in that.pagedata) {
//						if (!(property in dataObject)) {
//							dataObject[property] = that.pagedata[property];
//						}
//					}
//				}
//			}
			$.ajax({ url: url,
				dataType: "json",
				contentType: 'application/json',
				data: $.toJSON({
					'method' : method,
					'id' : 1,
					'params' : dataObject //that.pagedata
				}),
				context: document.body,
				type: "POST",
				success: function(data) {
					if (data.success) {
						return true;
					} else {
						return false;
					}
				},
				failure: function() {
					return false;
				}});
			return result;
		//}
	};
	
	VIE.ContainerManager.findAdditionalInstanceProperties = function(element, modelInstance){
		if (element.attr("lang") != "") {
			modelInstance.set({lang: element.attr("lang")});
		}
		if (element.attr("url") != "") {
			modelInstance.set({url: element.attr("url")});
		}
	}
	
	function karacosConstructor() {
		var that = {'$': jQuery};
		/**
		 * Process a KaraCos action
		 * @param url
		 * @param method
		 * @param params
		 * @param callback
		 * @param error
		 */
		
		that.action = function(object) {
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
		};
		that.getForm = function(object) {
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