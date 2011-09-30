
define(
	['vendor/jquery-1.6.1'],
	function() {
			var loadedJQuery = window.$.noConflict(true);
			define("jquery",[],function(){return loadedJQuery});
			return window.jQuery = window.kcQuery = loadedJQuery;// loadedJQuery;
	});