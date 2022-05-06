const cloudinary = require("cloudinary");
const getCookieToken = require("../utils/functions/cookieToken");
const httpError = require("../utils/functions/httpError");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw httpError("please provide email and password");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw httpError("email is incorrect");
    }

    bcrypt.compare(password, user.password, async (err, success) => {
      //validating email and password
      if (success) {
        getCookieToken(user, res);
      } else {
        throw httpError("password is incorrect");
      }
    });
  } catch (error) {
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("Login failed, please try again"));
  }
};

exports.signup = async (req, res) => {
  const { name, email, phone, password, aadharNo, address } = req.body;
  const role = req.body.role ? req.body.role : "employee";
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
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "scale",
      },
      async (err, response) => {
        if (err) {
          throw httpError("Photo failed to upload");
        }
        //creating user
        try {
          // creating hash of our password and saving to db
          password = await bcrypt.hash(password, 10);
          const user = await User.create({
            name,
            email,
            phone,
            aadharNo,
            address,
            role,
            password,
            photo: {
              id: response.public_id,
              url: response.secure_url,
            },
          });

          //this will create token, store in cookie and will send response to frontend
          getCookieToken(user, res);
        } catch (error) {
          return res.send(
            httpError("User registration failed, please try again")
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("User registration failed, please try again"));
  }
};

exports.logout = async (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logout Success",
  });
};
