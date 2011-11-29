function loadKaraCos() {
	require(
			[
			 "order!karacos/deps/history/scripts/uncompressed/amplify.store",
			 
			 "order!karacos/vendor/underscore-min",
			 "order!karacos/vendor/backbone-min",
			 'order!karacos/core/jquery.promise',
			 "order!karacos/vendor/jquery.json-2.2.min",
			 "order!karacos/vendor/vie",
			 "order!karacos/vendor/vie-containermanager",
			 "order!karacos/vendor/vie-collectionmanager",
			 "order!karacos/vendor/vie-aloha",
			 "order!karacos/deps/jquery-tmpl"
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