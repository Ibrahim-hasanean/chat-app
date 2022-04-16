const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    message: { type: String },
    conversation: { type: mongoose.Types.ObjectId, ref: "conversation" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
