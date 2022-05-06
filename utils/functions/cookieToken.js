const jsonwebtoken = require("jsonwebtoken");

const getCookieToken = (user, res) => {
  const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  };

  res.cookie("token", token, options);

  res.status(200).json({
    success: true,
    token: token,
  });
};

module.exports = getCookieToken;
