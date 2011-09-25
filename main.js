require(
[
 "order!karacos/jquery",
],
 function() {
	function loadKaraCos() {
		require(
		[
		 "order!karacos/deps/history/scripts/uncompressed/amplify.store",
		 "order!karacos/deps/history/scripts/uncompressed/history.adapter.jquery",
		 "order!karacos/deps/history/scripts/uncompressed/history",
		 "order!karacos/deps/history/scripts/uncompressed/history.html4",
		 "karacos/deps/jquery-ui-1.8.14.custom"
		 ],
		 function() {
			require.ready(function(){
				$(function(){
					require(["karacos/core/karacos"]);
				});
			 });
		});
	}
	if ( typeof window.JSON === 'undefined' ) {
		require(
		[
		 "deps/history/scripts/compressed/json2"
		 ],
		 function(){
			loadKaraCos();
		});
	} else {
		loadKaraCos();
	}
});