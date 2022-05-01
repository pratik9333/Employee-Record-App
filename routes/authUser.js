const router = require("express").Router();

const { signup, login, logout } = require("../controllers/authUser");
const isLoggedIn = require("../middleware/authentication");

//signup route
router.route("/signup").post(signup);

//login route
router.route("/login").post(login);

//logout route
router.route("/logout").get(isLoggedIn, logout);

module.exports = router;
