define("site/lib/toolkit.ImageProcessor",
		['jquery'],
		function($){
	
	function ImageProcessor() {
		
	}
	$.extend(ImageProcessor.prototype, {
		/**
		 * Callback take as parameter data of resized Image
		 * option is an object with max_width and max_height properties
		 */
		resizeImage: function(imgData, options, callback) {
			var tempimg = new Image(),
				that = this;
			tempimg.onload = function() {
				var 
					canvas = document.createElement('canvas'),
					data;
				targetsize = {
					height: tempimg.height,
					width: tempimg.width
				};
				if (tempimg.width > tempimg.height) {
					if (tempimg.width > options.max_width) {
						targetsize.width = options.max_width;
						targetsize.height = tempimg.height * options.max_width / tempimg.width;
					}
				} else {
					if (tempimg.height > options.max_height) {
						targetsize.height = options.max_height;
						targetsize.width = tempimg.width * options.max_height / tempimg.height;
					}

				}

				canvas.setAttribute('width', targetsize.width);
				canvas.setAttribute('height', targetsize.height);
				canvas.getContext('2d').drawImage(
					tempimg,
					0,
					0,
					tempimg.width,
					tempimg.height,
					0,
					0,
					targetsize.width,
					targetsize.height
				);
				data = canvas.toDataURL("image/png");
				if (typeof callback === "function") {
					callback(data);
				}
			}
			tempimg.src = imgData;
		}
	});
	return ImageProcessor;
});

