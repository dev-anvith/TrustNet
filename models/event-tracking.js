const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    clientId: { type: String, required: true },                  // Associated client
    eventType: { type: String, required: true },                 // Event type (e.g., "signup", "pageview")
    timestamp: { type: Date, default: Date.now },                // Time of the event
    metadata: { type: Object, default: {} }                      // Optional metadata (e.g., user details, page info)
  });
  
module.exports = mongoose.model("events", eventSchema);  