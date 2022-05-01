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
const user = require("./routes/user");
const admin = require("./routes/admin");

//router middleware
app.use("/api/v1/auth", authUser);
app.use("/api/v1/employee", employee);
app.use("/api/v1", user);
app.use("/api/v1", admin);

app.get("/api/v1", (req, res) => {
  res.status(200).json({ message: "Greetings from our api" });
});

module.exports = app;
