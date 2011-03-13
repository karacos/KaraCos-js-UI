KaraCos UI
==========

## Dependencies :
* jQuery
* jQueryUI

KaraCos UI provides core ui elements linked with a KaraCos backend.

## Quickstart :
Initialize KaraCos :

		<script>
			conf = {};
			KaraCos(conf)
		</script>

The conf object content will activate modules and provide conf for each.

## The core Module :
 
### KaraCos.action(params)
Process a KaraCos action, params :
 
 		{
			url:'/',//required
			method:'', //required
			async: false,
			callback:function(data) {},
			error: function() {}
		}
		
### KaraCos.getform(params)
 data is the form data, form the server-provided jst form id exist, params :
 
	 {
		url: "/", // required
		form: "login", // required
		callback: function(data,form){},
		error: function(){},
		async: false 
	}

## The authentication module

 	conf = {
			auth: {
				// enables facebook (requires menestrel MDomain)
				facebook: { appId:'your_app_id',
						cookie:true, 
						status:true,
						xfbml:true 
					}
				}
			};

 
## Upcoming stuff :
* AJAX browsing elements
* VIE based editable content
* Children's collection using Backend.js