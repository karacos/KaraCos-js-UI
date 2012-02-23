/*!
 * KaraCos
 * Author & Copyright (c) 2012 Nicolas Karageuzian
 * nka@nka.me
 *
 * KaraCos imageList
 * --------------------------
 * Shows an images list in sidebar
 * 
 * 
 */

define([
        'aloha',
        'aloha/jquery',
        'aloha/plugin',
        'aloha/pluginmanager',
        'image/image-plugin',
        'browser/browser-plugin',
        'repository/repository-plugin'],
function imageListClosure( 
		 Aloha,
		 jQuery,
		 Plugin,
		 PluginManager,
		 imagePlugin,
		 Browser,
		 kcRepository) {
	'use strict';
	
	var 
		karacos,
		$ = jQuery,
		ImagesBrowser = Browser.extend( {
			
		});
	
	$('body').bind('kcready', function() {
		karacos = KaraCos;
	});
	
	return Plugin.create('imageslist', {
		dependencies: [ 'image', 'browser', 'repository' ],
		defaultSettings: {
			sidebar: Aloha.Sidebar.left
		},
		/**
		 * Plugin initialization method
		 */
		init: function() {
			var plugin = this,
				pluginUrl = Aloha.getPluginUrl('imagelist'),
				config = {
					repositoryManager : Aloha.RepositoryManager,
					
					repositoryFilter  : [],
					objectTypeFilter  : [ 'website', 'file', 'image', 'language' /*, '*' */ ],
					renditionFilter	  : [ '*' ],
					filter			  : [ 'language' ],
					
					columns : {
						icon         : { title: '',     width: 30,  sortable: false, resizable: false },
						name         : { title: 'Name', width: 320, sorttype: 'text' },
						language     : { title: '',     width: 30,  sorttype: 'text' },
						translations : { title: '',     width: 350, sorttype: 'text' }
					},
					
					rootPath : Aloha.getPluginUrl( 'browser' ) + '/'
				};
//				
			this.browser = new ImagesBrowser( config );
//			
//			// Extend the default settings with the custom ones (done by default)
//			plugin.startAspectRatio = plugin.settings.fixedAspectRatio; 
//			plugin.config = plugin.defaultSettings;
//			plugin.settings = jQuery.extend(true, plugin.defaultSettings, plugin.settings);
//			
			plugin.addPanels();
		},
//		/**
//		 * Add sidebar panels
//		 */
		addPanels: function() {
			var plugin = this,
				sidebar = plugin.settings.sidebar;
			
			sidebar.addPanel({
				id       : 'Imagelist-panel-target',
				title    : "Images", //TODO: nls
				content  : '',
				expanded : true,
				activeOn : 'img, image',
				/* */
				onInit     : function () {
					 var panel = this,
						 content = panel.setContent('<div class=""></div>').content; 
				},
				/* */
				onActivate: function (effective) {
					var sidebar = this;
					sidebar.effective = effective;
				}
				
			});
			sidebar.addPanel({
				id       : 'Imagebrowser-panel-target',
				title    : "Controls", //TODO: nls
				content  : '',
				expanded : true,
				activeOn : 'img, image',
				/* */
				onInit     : function () {
					 var panel = this,
						 content = panel.setContent('<div><button>Browser</button></div>').content; 
					 content.find('button').click(function() {
						 plugin.browser.show();
					 });
					 
				},
				/* */
				onActivate: function (effective) {
					var sidebar = this;
					sidebar.effective = effective;
				}
				
			});
			
			sidebar.show();
		}
	});
	
});