function loadKaraCos() {
	require(
			[
			 "order!karacos/deps/history/scripts/uncompressed/amplify.store",
			 "order!karacos/deps/history/scripts/uncompressed/history",
			 "order!karacos/deps/history/scripts/uncompressed/history.html4",
			 "order!karacos/deps/history/scripts/uncompressed/history.adapter.jquery",
			 "order!karacos/vendor/underscore-min",
			 "order!karacos/vendor/backbone-min",
			 'order!karacos/core/jquery.promise',
			 "order!karacos/vendor/jquery.json-2.2.min",
			 "order!karacos/deps/jquery-ui-1.8.14.custom",
			 "order!karacos/vendor/vie",
			 "order!karacos/vendor/vie-containermanager",
			 "order!karacos/vendor/vie-collectionmanager",
			 "order!karacos/vendor/vie-aloha"
			],
			 function() {
				require(["karacos/core/karacos"]);
				
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