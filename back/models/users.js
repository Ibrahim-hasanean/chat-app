const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, unique: true },
  password: { type: String },
  imageURL: { type: String },
});

module.exports = mongoose.model("user", userSchema);
