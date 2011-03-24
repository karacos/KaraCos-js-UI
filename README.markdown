KaraCos UI
==========

## Dependencies :
* jQuery
* jQueryUI

KaraCos UI provides core ui elements linked with a KaraCos backend.

## Quickstart :
Initialize KaraCos (in the mako template) :

		<script>
			conf = { fqdn: '${instance['fqdn']}' };
			//declares your KaraCos namespace
			var KaraCos = new KaraCos(conf);
		</script>

The conf object content will activate modules and provide conf for each.

## The core Module :
 
### KaraCos.action(params)
Process a KaraCos action, params :
 
 		{
			url:'/',//required
			method:'', //required
			params: {},
			async: false,
			callback:function(data) {},
			error: function() {}
		}
		
### KaraCos.getform(params)
Data is the form data, form the server-provided jst form id exist, params :
 
	 {
		url: "/", // required
		form: "login", // required
		callback: function(data,form){},
		error: function(){},
		async: false 
	}

### RDFa integration (Backbone.js + VIE)
What ?
RDFa stands for RDF annotations, it itends to add some meaning to the data directly into the view.
Here is a simple example of a rdf entity in karacos :

		<div id="#myNode" typeof="karacos:WebNode" about="urn:uuid:e4325ff45346222456">
                <h2 property="title">Mon titre</h2>
               	<div  property="content">Mon contenu</div>
                </div>
		</div>
	
Note the typeof and about attribute added to #myNode, this defines the rdf entity.
Any child element of the entity with an attribute property becomes a property of the entity.
To map the entity in javascript, i use VIE :

	m = VIE.ContainerManager.getInstanceForContainer($('#myNode'));
	console.log(m)

This will shows an instance of a Backbone.js Model. Manipulating properties is easy,
and synchronising to backend is even easier : 

	Backbone.sync('_update',m);

This is still unfinished, this part of API has to be improved.

## The authentication module (core component)

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

### KaraCos.authManager.authenticationHeader(elemselector)

Draws authentication menu in elemselector/

### KaraCos.authManager.isUserConnected()

### KaraCos.authManager.provideLoginUI(callback, error)
params :

* callback : function
* error : function

Executes callback if user is connected, else shows a login window then process callback if login successed, otherwise process error

## logout()

## Upcoming stuff :
* AJAX browsing elements
* VIE based editable content
* Children's collection using Backend.js