const router = require("express").Router();
const User = require("../models/users");
const Messages = require("../models/messages");
const Conversation = require("../models/Conversations");
router.get("/", async (req, res) => {
  let users = await User.find({});
  return res.status(200).json({ users });
});

router.get("/me", (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get("/messages", async (req, res, next) => {
  try {
    let { senderId, reciverId } = req.query;
    console.log(senderId, reciverId);
    if (!senderId || !reciverId) {
      let error = new Error("senerId and reciverId required");
      error.status = 400;
      console.log(error.toString());
      return next(error);
    }
    const conversation = await Conversation.findOne({
      $and: [
        { members: { $in: [senderId] } },
        { members: { $in: [reciverId] } },
      ],
    }).populate("messages");
    if (!conversation) {
      let newConversation = await Conversation.create({
        members: [senderId, reciverId],
      });
      console.log(newConversation);
    }
    return res.status(200).json({ messages: conversation?.messages });
  } catch (e) {
    console.log(e.toString());
    next(e);
  }
});

module.exports = router;
