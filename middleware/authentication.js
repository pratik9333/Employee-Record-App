const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

const { httpError } = require("../utils/functions/httpError");

const isLoggedIn = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
      throw httpError("Please login to access this page");
    }

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    req.user.password = undefined;
    req.user.__v = undefined;
    req.user.createdAt = undefined;
    next();
  } catch (error) {
    if (error.error) {
      return res.send(error);
    }
    return res.send(httpError("Authenticaion Failed"));
  }
};

module.exports = isLoggedIn;
