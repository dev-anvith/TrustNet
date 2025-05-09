const mongoose = require("mongoose");

const pageviewSchema = new mongoose.Schema({
  clientId: { type: String, required: true },      
  timestamp: { type: Date, default: Date.now }     
});

module.exports = mongoose.model("Pageview", pageviewSchema);
