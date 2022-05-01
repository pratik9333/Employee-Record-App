const jsonwebtoken = require("jsonwebtoken");
const Auth = require("../models/auth");
const User = require("../models/user");
const httpError = require("../utils/functions/httpError");

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
    const auth = await Auth.findById(decoded.id);
    req.user = await User.findOne({ email: auth.email });

    req.user.password = undefined;
    req.user.__v = undefined;
    req.user.createdAt = undefined;
    next();
  } catch (error) {
    console.log(error);
    if (error.error) {
      return res.send(error);
    }
    return res.send(httpError("Authenticaion Failed"));
  }
};

module.exports = isLoggedIn;
