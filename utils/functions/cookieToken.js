const getCookieToken = (auth, res) => {
  const token = auth.getJwtToken();

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
