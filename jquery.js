
define(
	[],
	function() {
		if (window.kcQuery === undefined) {
			var loadedJQuery = window.$.noConflict(true);
			define("jquery",[],function(){return window.jQuery = window.kcQuery = loadedJQuery});
			return window.jQuery = window.kcQuery = loadedJQuery;// loadedJQuery;
		} else {
			return window.jQuery = window.kcQuery;
		}
	});