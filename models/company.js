const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Company name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  contactNo: {
    type: Number,
    required: [true, "Contact number is required"],
    maxlength: [10, "Contact number should be 10 digits"],
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    unique: true,
  },
  shortSummary: {
    type: String,
    required: true,
    maxlength: [100, "Summary should not be more than 100 words"],
  },
  listOfEmployees: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
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
  lastUpdatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Company", companySchema);

/*
name
. establishDate : date
. Location
List of employees : [{userId}]
. photo
. website (optional)
. contactNo
. Email
. Company short summary
. lastUpdatedBy
.verified : boolean
*/
