(function(window, undefined) {
	"use strict";
	var $ = window.jQuery || jQuery;
	
	/**
	 * Creates a Promise Event
	 * For instance onDomReady is a promise event, all events bound to it after it's initial trigger are fired immediately
	 * @version 1.0.0
	 * @date March 08, 2011
	 * @package jquery-sparkle {@link http://www.balupton/projects/jquery-sparkle}
	 * @author Benjamin Arthur Lupton {@link http://balupton.com}
	 * @copyright 2011 Benjamin Arthur Lupton {@link http://balupton.com}
	 * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
	 * @param {String} eventName
	 * @return {jQuery}
	 */
	$.fn.firedPromiseEvent = $.fn.firedPromiseEvent || function(eventName){
		var
		$el = $(this),
		result = $el.data('defer-'+eventName+'-resolved') ? true : false;
		return result;
	};
	
	/**
	 * Creates a Promise Event
	 * For instance onDomReady is a promise event, all events bound to it after it's initial trigger are fired immediately
	 * @version 1.0.0
	 * @date March 08, 2011
	 * @package jquery-sparkle {@link http://www.balupton/projects/jquery-sparkle}
	 * @author Benjamin Arthur Lupton {@link http://balupton.com}
	 * @copyright 2011 Benjamin Arthur Lupton {@link http://balupton.com}
	 * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
	 * @param {String} eventName
	 * @return {jQuery}
	 */
	$.fn.createPromiseEvent = $.fn.createPromiseEvent || function(eventName){
		// Prepare
		var
		$this = $(this),
		events,
		boundHandlers;
		
		// Check
		if ( typeof $this.data('defer-'+eventName+'-resolved') !== 'undefined' ) {
			// Promise event already created
			return $this;
		}
		$this.data('defer-'+eventName+'-resolved',false);
		
		// Handle
		events = $.fn.createPromiseEvent.events = $.fn.createPromiseEvent.events || {
			// Bind the event
			bind: function(callback){
				var $this = $(this);
				return $this.bind(eventName,callback);
			},
			
			// Trigger the event
			trigger: function(event){
				//console.log('trigger');
				// Prepare
				var
				$this = $(this),
				Deferred = $this.data('defer-'+eventName),
				specialEvent;
				
				// setup deferred object if the event has been triggered
				// but not been setup before
				if ( !Deferred ) {
					specialEvent =  $.event.special[eventName];
					specialEvent.setup.call(this);
					Deferred = $this.data('defer-'+eventName);
				}
				
				// Update Status
				$this.data('defer-'+eventName+'-resolved',true);
				
				// Fire Deferred Events
				Deferred.resolve();
				
				// Prevent
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
				
				// Chain
				return $this;
			},
			
			// Do something when the first event handler is bound to a particular element.
			setup: function( data, namespaces ) {
				//console.log('setup');
				var $this = $(this);
				$this.data('defer-'+eventName, new $.Deferred());
			},
			
			// Do something when the last event handler is unbound from a particular element.
			teardown: function( namespaces ) {
				//console.log('teardown');
				var $this = $(this);
				$this.data('defer-'+eventName, null);
			},
			
			// Do something each time an event handler is bound to a particular element.
			add: function ( handleObj ) {
				//console.log('add');
				// Prepare
				var
				$this = $(this),
				Deferred = $this.data('defer-'+eventName),
				specialEvent =  $.event.special[eventName];
				
				// Check
				if ( !Deferred ) {
					specialEvent.setup.call(this);
					return specialEvent.add.apply(this,[handleObj]);
				}
				
//				if ($this.data('defer-'+eventName+'-resolved')) {
//					handleObj.handler();
//				} else {
					// Attach
					console.log('attach');
					Deferred.done(handleObj.handler);
//				}
				
			},
			
			// Do something each time an event handler is unbound from a particular element.
			remove: function ( handleObj ) {
				//console.log('remove');
			}
		};
		
		// Fetch already bound events
		boundHandlers = [];
		$.each(
				($this.data('events') || {})[eventName] || [],
				function(i,event){
					boundHandlers.push(event.handler);
				}
		);
		
		// Unbind already bound events
		$this.unbind(eventName);
		
		// Bind to the actual event
		$this.bind(eventName, events.trigger);
		
		// Create the Helper
		$.fn[eventName] = $.fn[eventName] || events.bind;
		
		// Create the Special Event
		$.event.special[eventName] = $.event.special[eventName] || {
			setup: events.setup,
			teardown: events.teardown,
			add: events.add,
			remove: events.remove
		};
		
		// Rebind already bound events to the new custom event
		$.each(boundHandlers,function(i,handler){
			$this.bind(eventName,handler);
		});
		
		// Chain
		return $this;
	};
})(window);