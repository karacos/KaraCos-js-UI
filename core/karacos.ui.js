define("karacos/core/karacos.ui",
		["jquery",
		 "karacos/vendor/vie"], function($){
	var karacos;
	require(["karacos/vendor/vie-containermanager",
	         "karacos/vendor/vie-collectionmanager"], function(){
		VIE.ContainerManager.findAdditionalInstanceProperties = function(element, modelInstance){
			if (element.attr("lang") !== undefined) {
				modelInstance.set({lang: element.attr("lang")});
			}
			if (element.attr("url") !== undefined) {
				modelInstance.set({url: element.attr("url")});
			}
		};
		
	});
	$('body').createPromiseEvent('kcui');
	$('body').bind('kcauth', function(){
		karacos = window.KaraCos;
	});
	if (!('map' in Array.prototype)) {
	    Array.prototype.map= function(mapper, that /*opt*/) {
	        var other= new Array(this.length);
	        for (var i= 0, n= this.length; i<n; i++)
	            if (i in this)
	                other[i]= mapper.call(that, this[i], i, this);
	        return other;
	    };
	}
	if(!Array.prototype.reduce) {
		Array.prototype.reduce=function(fun){
			var len=this.length>>>0;
			if(typeof fun!="function")
				throw new TypeError;
			if(len==0&&arguments.length==1)
				throw new TypeError;
			var i=0;
			if(arguments.length>=2)
				var rv=arguments[1];
			else {
				do {
					if(i in this){
						var rv=this[i++];
						break
					}
					if(++i>=len)
						throw new TypeError;
				} while(true)}
			for(;i<len;i++) {
				if(i in this)
					rv=fun.call(undefined,rv,this[i],i,this);
			}
			return rv;
		};
	}
	return {
		/**
		 * UI initialization
		 */
		'init': function(config) {
			/**
			 * Callback for toolkit require
			 * @param toolkit
			 * @returns
			 */
			var 
				initToolkit = function(toolkit){
					ui.toolkit = toolkit;
					if (typeof toolkit.init === "function") {
						toolkit.init(function() {
							$('body').trigger('kcui');
							
						});
					} else {
						$('body').trigger('kcui');
					}
					console.log("UI initialization done");
				},
				ui = this;
			console.log("Initializing UI");
			if (typeof config.toolkit === "string") {
				// use of user defined toolkit
				// such toolkit should implement other methods of this object :
				// alert(message, buttons)
				// headerButtons(parent,options)
				// see below for more doc
				require([config.toolkit], initToolkit);
			} else {
				// Default toolkit : jquery-ui
				require(["karacos/modules/toolkit.jQuery.ui"], initToolkit);
			}
			
		},
		
		/**
		 * UI alert, showing a message and buttons
		 */
		'alert': function(message, buttons) {
			var ui = this;
			ui.toolkit.alert(message, buttons);
		},
		/**
		 * params : 
		 * 		parent : container of header. buttons will be appended
		 * 		options :
		 * 			logout: callback function for triggering after logout button
		 */
		'headerButtons': function(parent,options) {
			ui = this;
			if (typeof ui.toolkit.headerButtons === "function") {
				ui.toolkit.headerButtons(parent,options);
			}
		}
	}
});