const getCookieToken = (user, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  };

  //restricting data to pass on frontend
  user.password = undefined;
  user.__v = undefined;
  user.createdAt = undefined;

  res.cookie("token", token, options);

  res.status(200).json({
    success: true,
    token: token,
    user,
  });
};

module.exports = getCookieToken;
