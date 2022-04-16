const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/login", async (req, res, next) => {
  let { name, password } = req.body;
  try {
    let user = await User.findOne({ name });
    if (!user) {
      let error = new Error("user not found");
      error.status = 400;
      return next(error);
    }
    let comparePAssword = await bcrypt.compare(password, user.password);
    if (!comparePAssword) {
      let error = new Error("wrong password");
      error.status = 400;
      return next(error);
    }
    let token = jwt.sign({ userId: user._id, name: user.name }, "secret key", {
      expiresIn: "1w",
    });
    return res.status(200).json({ user, token });
  } catch (e) {
    e.status = 400;
    next(e);
  }
});

router.post("/signup", async (req, res, next) => {
  let { name, password } = req.body;
  let user = await User.findOne({ name });
  if (user) {
    let error = new Error("user conflict");
    error.status = 409;
    return next(error);
  }
  try {
    password = await bcrypt.hash(password, 12);
    let newUser = await User.create({ name, password });
    let token = jwt.sign(
      { userId: newUser._id, name: newUser.name },
      "secret key",
      {
        expiresIn: "1w",
      }
    );
    return res.status(200).json({ user: newUser, token });
  } catch (e) {
    console.log(e);
    e.status = 400;
    next(e);
  }
});

module.exports = router;
