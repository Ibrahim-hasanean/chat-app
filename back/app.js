var express = require("express");
var logger = require("morgan");
const cors = require("cors");
const Conversation = require("./models/Conversations");
const Message = require("./models/messages");
const User = require("./models/users");
require("./config/mongoose");
const http = require("http");
var app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const verifyUser = require("./middleware/verifyUser");

const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRoutes);
app.use("/users", verifyUser, usersRoutes);

app.use((err, req, res, next) => {
  if (!err.status) return res.status(500).json({ message: err.toString() });
  return res.status(err.status).json({ message: err.toString() });
});

server.listen(4000, () => {
  console.log("server conncted on 4000");
});

let onlineFriends = [];
io.on("connection", (socket) => {
  console.log("socket connected");
  //   socket.emit("connect", "hello from server");
  socket.on("hello", (message) => console.log(message));

  socket.on("online", async ({ userId }) => {
    const user = await User.findById(userId);
    // user.socketId = socket.id;
    onlineFriends.push({ ...user._doc, socketId: socket.id });
    socket.userId = userId;
    io.emit("onlineFriend", { friends: onlineFriends });
  });

  socket.on("joinRoom", async ({ senderId, reciverId }) => {
    console.log("join room");
    if (socket.room) socket.leave(socket.room);
    let conversation = await Conversation.findOne({
      $and: [
        { members: { $in: [senderId] } },
        { members: { $in: [reciverId] } },
      ],
    });
    if (conversation) {
      socket.join(String(conversation._id));
      socket.room = String(conversation._id);
      socket.emit("joinRoom", conversation);
    }
  });

  socket.on("newMessage", async ({ message, senderId, reciverId }, cb) => {
    if (message && senderId && reciverId) {
      console.log(senderId, reciverId);
      let conversation = await Conversation.findOne({
        $and: [
          { members: { $in: [senderId] } },
          { members: { $in: [reciverId] } },
        ],
      });
      let newMessage = await Message.create({
        sender: senderId,
        message,
        conversation: conversation._id,
      });
      conversation.messages = [...conversation.messages, newMessage._id];
      await conversation.save();
      cb(true);
      io.in(socket.room).emit("newMessage", { message: newMessage });
    }
    cb(false);
  });

  socket.on("typing", () => {
    socket.in(socket.room).emit("typing");
  });
  socket.on("unTyping", () => {
    socket.in(socket.room).emit("unTyping");
  });

  socket.on("getUser", async ({ name }) => {
    let user = await User.findOne({ name });
    console.log("get user", user);
    socket.emit("getUser", { ...user._doc, socketId: socket.id });
  });
  //video events
  socket.on("me", () => {
    socket.emit("me", { id: socket.id, onlineFriends });
  });

  socket.on(
    "callUser",
    ({ userToCall, signal, from, name, stream, callType }) => {
      io.to(userToCall).emit("callUser", {
        signal,
        from,
        name,
        stream,
        callType,
      });
      console.log("call user", { userToCall, signal, from, name });
    }
  );

  socket.on("answerCall", ({ signal, to, stream }) => {
    io.to(to).emit("callAccepted", { signal, stream });
    console.log("answer call", { signal, to });
  });

  socket.on("declineCall", ({ to }) => {
    io.to(to).emit("declineCall");
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    onlineFriends = onlineFriends.filter((user) => user._id != socket.userId);
    io.emit("onlineFriend", { friends: onlineFriends });
    if (socket.room) socket.leave(socket.room);
    io.emit("userLeave", { socketId: socket.id });
  });
});
