define("karacos/lib/toolkit.FileUploader",
		['jquery'],
		function($){
	var
		karacos, auth,
		fileUploader,
		defaultConf = {
				method: 'POST',
				file_name_header: "X-File-Name",
				accept:  "application/json",
				send_multipart_form: false // true for classic form post
		};
	
	function FileUploader(config){
		var
			tmpconf = defaultConf;
		fileUploader = this;
		if (typeof config === "undefined") {
			tmpconf = defaultConf;
		} else {
			$.extend(tmpconf, config);
		}
		this.config = tmpconf;
		
		$('body').bind('kcauth', function(){
			karacos = KaraCos;
			auth = karacos.authManager;
			if (typeof fileUploader.config.url === "undefined") {
				fileUploader.config.url = karacos.config.page_url;
			}
			
		});
	}
	$.extend(FileUploader.prototype, {
		uploadFile: function(fileobj, callbacks) {
			var xhr = new XMLHttpRequest(), options = this.config, that = this, data;
			if (typeof callbacks !== "undefined") {
				if (typeof callbacks.onprogress === "function") {
					xhr.upload['onprogress'] = callbacks.onprogress;
				}
				if (typeof callbacks.onload === "function") {
					xhr.onload = callbacks.onload;
				}
				if (typeof callbacks.onabort === "function") {
					xhr.onabort = callbacks.onabort;
				}
				if (typeof callbacks.onerror === "function") {
					xhr.onerror = callbacks.onerror;
				}
			}
			xhr.open(options.method, options.url, true);
			xhr.setRequestHeader("Cache-Control", "no-cache");
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.setRequestHeader(options.file_name_header, fileobj.fileName);
			xhr.setRequestHeader("X-File-Size", fileobj.fileSize);
			xhr.setRequestHeader("Accept", options.accept);
//		l
			if (!options.send_multipart_form) {
				xhr.setRequestHeader("Content-Type", fileobj.type + ";base64");
				xhr.overrideMimeType(fileobj.type);
				xhr.send(fileobj.data);
			} else {
				if (window.FormData) {//Many thanks to scottt.tw
					var f = new FormData();
					f.append(options.fieldName, fileobj);
					xhr.send(f);
				}
				else if (fileobj.getAsBinary) {//Thanks to jm.schelcher
					var boundary = (1000000000000+Math.floor(Math.random()*8999999999998)).toString();
					var dashdash = '--';
					var crlf     = '\r\n';

					/* Build RFC2388 string. */
					var builder = '';

					builder += dashdash;
					builder += boundary;
					builder += crlf;

					builder += 'Content-Disposition: form-data; name="'+(typeof(options.fieldName) == "function" ? options.fieldName() : options.fieldName)+'"';
					builder += '; filename="' + fileobj.fileName + '"';
					builder += crlf;

					builder += 'Content-Type: application/octet-stream';
					builder += crlf;
					builder += crlf;

					/* Append binary data. */
					builder += fileobj.getAsBinary();
					builder += crlf;

					/* Write boundary. */
					builder += dashdash;
					builder += boundary;
					builder += dashdash;
					builder += crlf;

					xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
					xhr.sendAsBinary(builder);
				}
				else {
					if (typeof options.onBrowserIncompatible === "function") {
						options.onBrowserIncompatible();
					}
				}
			}
		}
	});
	return FileUploader;
	
});