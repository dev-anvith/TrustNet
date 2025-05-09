const mongoose = require("mongoose");

const viewerCountSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },  // Unique client identifier
  count: { type: Number, required: true, default: 0 },      // Current viewer count
  lastUpdated: { type: Date, default: Date.now }             // Timestamp for when the count was last updated
});

module.exports = mongoose.model("viewers", viewerCountSchema);  