require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//cookies and file middleware
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//import all routes here
const authUser = require("./routes/authUser");
const employee = require("./routes/employee");
//router middleware
app.use("/api/v1/auth", authUser);
app.use("/api/v1/employee", employee);

module.exports = app;
