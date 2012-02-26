// prevent no console...
if (window.console === undefined || window.console === null) {
	window.console = {};
}
if (console.log === undefined || console.log === null) {
	console.log = function(){};
}
// check if an extension fo require exists, creates otherwise
if (window.kc_requireConf === undefined || window.kc_requireConf === null) {
	window.kc_requireConf = {}
} 
kc_requireConf.baseUrl = "/_browser/aloha/src/lib";
kc_requireConf.waitSeconds = 15;
kc_requireConf.locale = "fr-fr";
if (kc_requireConf.paths === undefined || kc_requireConf.paths === null) {
	window.kc_requireConf.paths = {}
}
kc_requireConf.paths.karacos = "/_browser/karacos-ui"; 
kc_requireConf.paths.fragment = "/fragment";

function startKaraCos() {
	(function(jQuery){
		var kQuery = jQuery.noConflict( true );
		window.jQuery = window.$ = kQuery;
		jQuery(function() {
		  	window.Aloha = window.Aloha || {};
		  
			window.kcQuery = window.kQuery = jQuery;
			Aloha.settings = {	baseUrl: "/_browser/aloha/src/lib",
							locale: "fr",
							jQuery: jQuery,
							floatingmenu: {
								width: 430
							},
							bundles: {
								custom: "/_browser/karacos-ui/lib/ae-bundle"
							}, 
							plugins: {
								load: [ 'common/format',
								        'common/link',
								        'common/image',
								        'common/highlighteditables',
								        'common/paste',
								        'custom/karacos-repository'
								        ],
								format: {
									editables: {
										'[property*="title"]': [],
										'[property*="description"]': []
									}
								},
								link: {
									editables: {
										'[property*="title"]': [],
										'[property*="description"]': []
									}
								},
								 image: {
									'max_width': '50px',
									'max_height': '50px',
									editables: {
										'[property*="title"]':undefined,
										'[property*="description"]': undefined
									}
								},
								draganddropfiles: {
									upload : { config: { callback: function dropFileCallback(responseString,fileItem) {
												try {
													var result = jQuery.parseJSON(responseString);
													if (result.success)
														return result.data;
												} catch(e) {
													return false;
												}
											} // function callback
										} // config
									}, // upload
									
									editables: {
										
										'[property*="description"]': {},
										'[property*="title"]': {},
										'[typeof*="Domain"] [property*="content"]': {}
									
									}
								} // draganddropfiles
							} //plugins
						};
		  	require(["karacos/main"],function(){
				console.log("loaded karacos/main");
		  	});
		
		});
	})(window.jQuery);
}
if (window.onload === null) {
	window.onload = startKaraCos;
} else {
	startKaraCos();
}
