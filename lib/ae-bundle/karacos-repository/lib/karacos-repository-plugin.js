/*!
 * KaraCos
 * Author & Copyright (c) 2012 Nicolas Karageuzian
 * nka@nka.me
 *
 * KaraCos repository plugin
 * --------------------------
 * Interface between aloha repository manager and a KaraCos backend.
 * 
 * 
 */

define(
[ 'aloha', 'aloha/jquery' ],
function ( Aloha, jQuery ) {
	'use strict';
	
	var 
		karacos,
		$ = jQuery;
	
	$('body').bind('kcready', function() {
		karacos = KaraCos;
	});
	
	new ( Aloha.AbstractRepository.extend( {
		
		_constructor: function () {
			this._super( 'karacos' );
		},
		init: function () {
			
		},
		/**
		 * Searches karacos backend for given resource
		 *  
		 * @param {object} params object with properties
         * @property {String} queryString 
         * @property {array} objectTypeFilter OPTIONAL Object types that will be returned.
         * @property {array} filter OPTIONAL Attributes that will be returned.
         * @property {string} inFolderId OPTIONAL his is a predicate function that tests whether or not a candidate object is a child-object of the folder object identified by the given inFolderId (objectId).
         * @property {string} inTreeId OPTIONAL This is a predicate function that tests whether or not a candidate object is a descendant-object of the folder object identified by the given inTreeId (objectId).
         * @property {array} orderBy OPTIONAL ex. [{lastModificationDate:’DESC’}, {name:’ASC’}]
         * @property {Integer} maxItems OPTIONAL number items to return as result
         * @property {Integer} skipCount OPTIONAL This is tricky in a merged multi repository scenario
         * @property {array} renditionFilter OPTIONAL Instead of termlist an array of kind or mimetype is expected. If null or array.length == 0 all renditions are returned. See http://docs.oasis-open.org/cmis/CMIS/v1.0/cd04/cmis-spec-v1.0.html#_Ref237323310 for renditionFilter
		 */
		query: function ( p, callback ) {
			var kcRepo = this;
			if (typeof p.objectTypeFilter === "undefined" || p.objectTypeFilter === null) {
				p.objectTypeFilter = [];
			}
			if (typeof p.inFolderId === "string" && !p.recursive) {
				kcRepo.getChildren({inFolderId: p.inFolderId}, callback);
			} else {
				karacos.action({
					url: '/',
					method: '_search_by_name',
					params: {'name': p.queryString,
						'typeFilter': p.objectTypeFilter},
						callback: function(data) {
							var result = [];
							if (typeof callback === "function") {
								
								$.each(data.data,function(i,e) {
									var rsItem = {
											id: '/' + i,
											type: e.fileType,
											name: i,
											baseType: e.type,
											url: e.url,
											parentId: e.parent
											
									};
									if (e.fileType) {
										rsItem.rendition = [{
											url: e.url,
											filename: e.name,
											kind: 'thumbnail',
											height: 75,
											width: 75
										}];
									}
									result.push(rsItem );
								});
								callback.call(kcRepo,result);
							}
						}
				});
			}
		},
		/**
		 * Returns all children of a given motherId.
		 *
		 * @param {object} params object with properties
         * @property {array} objectTypeFilter OPTIONAL Object types that will be returned.
         * @property {array} filter OPTIONAL Attributes that will be returned.
         * @property {string} inFolderId OPTIONAL his is a predicate function that tests whether or not a candidate object is a child-object of the folder object identified by the given inFolderId (objectId).
         * @property {array} orderBy OPTIONAL ex. [{lastModificationDate:’DESC’}, {name:’ASC’}]
         * @property {Integer} maxItems OPTIONAL number items to return as result
         * @property {Integer} skipCount OPTIONAL This is tricky in a merged multi repository scenario
         * @property {array} renditionFilter OPTIONAL Instead of termlist an array of kind or mimetype is expected. If null or array.length == 0 all renditions are returned. See http://docs.oasis-open.org/cmis/CMIS/v1.0/cd04/cmis-spec-v1.0.html#_Ref237323310 for renditionFilter
         * @param {function} callback this method must be called with all result items
         */
		getChildren: function ( p, callback ) {
			var 
				parent = p.inFolderId,
				result = [],
				kcRepo = this;
			if (parent === "karacos") {
				karacos.action({
					url: '/',
					method: 'w_browse_types',
					params: {},
					callback: function(data) {
						if (typeof callback === "function") {
							
							$.each(data.data,function(i,e) {
								var rsItem = {
										id: '/' + i,
										type: "folder",
										name: i,
										baseType: "folder",
										parentId: "karacos",
										repositoryId: 'karacos'
										
									};
								result.push(rsItem);
							});
							callback.call(kcRepo,result);
						}
					}
				});
			} else {
				karacos.action({
					url: parent,
					method: 'w_browse_types',
					params: {},
					async: false,
					callback: function(data) {
						if (typeof callback === "function") {
							
							$.each(data.data,function(i,e) {
								var rsItem = {
										id: parent + "/" + i,
										type: "folder",
										name: i,
										baseType: "folder",
										parentId: parent,
										repositoryId: 'karacos'
										
									};
								result.push(rsItem);
							});
							
						}
					}
				});
				karacos.action({
					url: parent,
					method: 'get_atts',
					params: {},
					async: false,
					callback: function(data) {
						if (typeof callback === "function") {
							
							$.each(data.data.items,function(i,e) {
								var rsItem = {
										id: e.value,
										name: e.label,
										url: e.value,
										baseType: "document",
										type: e.mimeType,
										parentId: parent,
										repositoryId: 'karacos'
										
									};
								if (e.mimeType.match("image") !== null) {
									rsItem.renditions = [{
										url: e.value,
										mimeType: e.mimeType,
										filename: e.label,
										kind: 'thumbnail',
										height: 75,
										width: 75
									}];
								}
								result.push(rsItem);
							});
							
						}
					}
				});	
				callback.call(kcRepo,result);
			}
		},
		/**
		 * Get the repositoryItem with given id
		 * Callback: {GENTICS.Aloha.Repository.Object} item with given id
		 * @param itemId {String} id of the repository item to fetch
		 * @param callback {function} callback function
		 */
		getObjectById: function ( itemId, callback ) {
			
		},
		/**
         * Mark or modify an object as needed by that repository for handling, processing or identification.
         * Objects can be any DOM object as A, SPAN, ABBR, etc..
         * (see http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data)
         * @param obj jQuery object to make clean
         * @return void
         */
		markObject: function (obj, repositoryItem) {
			
		},
		/**
         * Make the given jQuery object (representing an object marked as object of this type)
         * clean. All attributes needed for handling should be removed. 
         * @param {jQuery} obj jQuery object to make clean
         * @return void
         */
        makeClean: function ( obj ) {
			
		}
		
	}))();
});