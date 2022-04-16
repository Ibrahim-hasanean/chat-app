const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/chat-app",
  { useNewUrlParser: true, useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("mongoose connected");
  }
);
