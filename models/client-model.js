const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientId: { type: String, unique: true }, 
  name: { type: String, required: true },                  
  email: { type: String, required: true, unique: true },    
  createdAt: { type: Date, default: Date.now },             
  updatedAt: { type: Date, default: Date.now },             
  settings: {
    widgetPosition: { type: String, default: "bottom-right" }, 
    widgetColor: { type: String, default: "#4CAF50" }          
  },
  password: {type: String}
});

module.exports = mongoose.model("clients", clientSchema);