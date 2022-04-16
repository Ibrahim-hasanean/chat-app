const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  members: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  messages: [{ type: mongoose.Types.ObjectId, ref: "message" }],
});

module.exports = mongoose.model("conversation", conversationSchema);
