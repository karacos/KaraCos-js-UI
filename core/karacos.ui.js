define("karacos/core/karacos.ui", ["jquery"], function($){
	var karacos;
	$('body').createPromiseEvent('kcui');
	$('body').bind('kcui', function() {console.log("UI initialization done")});
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
			'init': function(config) {
				function initToolkit(toolkit){
					ui.toolkit = toolkit;
					$('body').trigger('kcui');
				}
				var ui = this;
				console.log("Initializing UI");
				if (typeof config.toolkit === "string") {
					require([config.toolkit], initToolkit);
				} else {
					require(["karacos/modules/toolkit.jQuery.ui"], initToolkit);
				}
				
			},
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