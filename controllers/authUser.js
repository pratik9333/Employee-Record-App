const Auth = require("../models/auth");
const cloudinary = require("cloudinary");
const getCookieToken = require("../utils/functions/cookieToken");
const { httpError } = require("../utils/functions/httpError");
const User = require("../models/user");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw httpError("please provide email and password");
  }

  try {
    const authUser = await Auth.findOne({ email });

    if (!authUser) {
      throw httpError("email is incorrect");
    }

    const validatePassword = await authUser.validatePassword(password);

    //validating email and password
    if (!validatePassword) {
      throw httpError("password is incorrect");
    }

    const user = await User.find({ email: authUser.email });

    getCookieToken(user, res, req);
  } catch (error) {
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("Login failed, please try again"));
  }
};

exports.signup = async (req, res) => {
  const { name, email, phone, password, aadharNo, address } = req.body;

  try {
    if (!req.files) {
      return res.status(400).json({ error: "Photo is required to signup" });
    }

    if (!name || !email || !password || !phone || !aadharNo || !address) {
      throw httpError("All fields are required");
    }

    const findExistingEmail = await Auth.findOne({ email });

    if (findExistingEmail) {
      throw httpError(
        "Email is already registered, please try again with another email"
      );
    }

    const file = req.files.photo;

    //uploading file to cloudinary
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    await Auth.create({ email, password });

    //creating user
    const user = await User.create({
      name,
      email,
      phone,
      aadharNo,
      address,
      photo: {
        id: result.public_id,
        url: result.secure_url,
      },
    });

    //this will create token, store in cookie and will send response to frontend
    getCookieToken(user, res);
  } catch (error) {
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("User registration failed, please try again"));
  }
};

exports.logout = async (res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logout Success",
  });
};
