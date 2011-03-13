(function(){
	
	function karacosConstructor() {
		var that = {};
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
			jQuery.ajax({ url: object.url,
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
			
			jQuery.ajax({ url: acturl,
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
							failure: function(p1,p2,p3) {
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
				if (that.config === undefined) {
					that.initMethods.push(param);
				} else {
					param();
				}
				return;
			} 
			if (typeof param === 'object') {
				if (karacos.config !== undefined) {
					throw Error("KaraCos object already initialized")
				}
				jQuery.extend(true,karacos,that);
				karacos.config = param;
				jQuery.each(karacos.initMethods, function(i,m) {m();});
				return karacos;
			}
			if (typeof param === 'string') {
				//do special stuff ? else process as jQuery selector
				return jQuery(param);
			}
		}
		return karacos;
	};
	this.KaraCos = karacosConstructor();
})();