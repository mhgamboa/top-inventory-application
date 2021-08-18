//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var BoardGameSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: String,
  price: Number,
  category: String,
  stock: Number,
  url: String,
});

//Export model
module.exports = mongoose.model("BoardGame", BoardGameSchema);
