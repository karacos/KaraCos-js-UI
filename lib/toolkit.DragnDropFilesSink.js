define("karacos/lib/toolkit.DragnDropFilesSink", 
		["jquery"],
		function($) {
		var dragnDropFilesSink,
			karacos, auth;
		function DragnDropFilesSink(config) {
			dragnDropFilesSink = this;
			if (typeof config === "undefined") {
				config = {};
			}
			this.config = config;
			$('body').bind('kcauth', function(){
				karacos = KaraCos;
				auth = karacos.authManager;
				if (typeof dragnDropFilesSink.config.url === "undefined") {
					dragnDropFilesSink.config.url = karacos.config.page_url;
				}
			});
		}
		
		$.extend(DragnDropFilesSink.prototype, {
			dropEventHandler: function(event) {
				var 
					that = this, len
					, dropimg;
				this.files = event.dataTransfer.files;
				this.droppedFilesCount = this.files.length;
				
//				if (jQuery.browser.msie) {
//					var textdata = event.dataTransfer.getData('Text');
//					var urldata = event.dataTransfer.getData('URL');
//					var imagedataW = window.event.dataTransfer.getData('URL');
//					var textdataW = window.event.dataTransfer.getData('Text');
//					var x = textdataW;
//				}
				// if no files where dropped, use default handler
				if (!event.dataTransfer && !event.dataTransfer.files) {
					event.sink = false;
					return true;
				}
				if (this.droppedFilesCount < 1) {
					event.sink = false;
					return true;
				}
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.cancelBubble = true;
				}
				
				this.target = jQuery(event.target);
				
				this.filesObjs = [];
				len = this.droppedFilesCount;
				
				
				if (event.stopPropagation) {
					event.stopPropagation();
				} else {
					event.returnValue = false;
				}
				// Here we have all checks done, event is a drop file event
				
				$('body').trigger("dropFiles",this);
				return false;
			},
			setBodyDropHandler: function() {
				var that = this;
				if (!document.body.BodyDragSinker){
					document.body.BodyDragSinker = true;
					this.onstr = "";
					this.mydoc = document;
					this.methodName = "addEventListener";
					if (jQuery.browser.msie) {
						this.onstr = "on";
						this.methodName = "attachEvent";
						this.mydoc = document.body;
					}

					// sets the default handler
					this.mydoc[this.methodName](this.onstr+"drop", function(event) {that.dropEventHandler(event)} , false);
				// TODO: improve below to allow default comportment behaviour if drop event is not a files drop event
				this.mydoc[this.methodName](this.onstr+"dragenter", function(event) {
					if (event.preventDefault)
						event.preventDefault();
					else
						event.cancelBubble = true;
					if (event.stopPropagation)
						event.stopPropagation();
					else
						event.returnValue = false;
					return false;
				}, false);
				this.mydoc[this.methodName](this.onstr+"dragleave", function(event) {
					if (event.preventDefault)
						event.preventDefault();
					else
						event.cancelBubble = true;
					if (event.stopPropagation)
						event.stopPropagation();
					else
						event.returnValue = false;
					return false;
				}, false);
				this.mydoc[this.methodName](this.onstr+"dragover", function(event) {
					if (event.preventDefault)
						event.preventDefault();
					else
						event.cancelBubble = true;
					if (event.stopPropagation)
						event.stopPropagation();
					else
						event.returnValue = false;
					//return false;
				}, false);



				} // if
				// end body events
				//==================
			}
		});
		
		return DragnDropFilesSink;
});