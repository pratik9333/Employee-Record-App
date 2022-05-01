const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [40, "User's name is too long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "Phone is required"],
    maxlength: [10, "Phone number should be 10 digits"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["employee", "admin"],
  },
  aadharNo: {
    type: Number,
    required: [true, "Aadhar number is required"],
    maxlength: [12, "Aadhar number should be 12 digits"],
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  companies: [
    {
      companyId: {
        type: mongoose.Schema.ObjectId,
        ref: "Company",
      },
      status: {
        type: String,
        enum: ["working", "worked"],
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  ],
  photo: {
    id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});

module.exports = mongoose.model("User", userSchema);

/*
. name
. email
. phone
. role
. aadhar no
. address
. workedOnCompanies [{
id : companid,
startDate: date,
endDate: date}]
. photo
*/
