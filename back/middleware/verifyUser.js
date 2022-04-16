const jwt = require("jsonwebtoken");
const User = require("../models/users");
const verifyUser = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization)
    return res
      .status(400)
      .json({ status: 400, message: "token must be provided" });
  const token = authorization.split(" ")[1];
  if (!token)
    return res
      .status(400)
      .json({ status: 400, message: "token must be provided" });
  jwt.verify(token, "secret key", async (err, decode) => {
    try {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: 401, message: "unauthurized" });
      }
      let user = await User.findById(decode.userId);
      if (!user) {
        return res.status(400).json({ status: 400, message: "user not found" });
      }
      if (user.suspend) {
        return res
          .status(401)
          .json({ status: 401, message: "user is suspended" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: "smth wrong" });
    }
  });
};
module.exports = verifyUser;
