function loadKaraCos() {
	require(
			[
			 "karacos/deps/history/scripts/uncompressed/amplify.store",
			 
			 "karacos/vendor/underscore-min",
			 "karacos/vendor/backbone-min",
			 'karacos/core/jquery.promise',
			 "karacos/vendor/jquery.json-2.2.min",
			 "karacos/vendor/vie",
			 "karacos/vendor/vie-containermanager",
			 "karacos/vendor/vie-collectionmanager",
			 //"order!karacos/vendor/vie-aloha",
			 "karacos/deps/jquery-tmpl"
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