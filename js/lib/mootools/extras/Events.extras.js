goog.provide('Events.extras');

Events.implement({

  // Add event listeners en masse
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.addEvent(eventType, callback);
    }, this);
  },

  // Remove event listeners en masse
  stopListening: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.removeEvent(eventType, callback);
    }, this);
  }

});
