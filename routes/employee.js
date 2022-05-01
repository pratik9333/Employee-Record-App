const router = require("express").Router();

const {
  addCompany,
  updateCompanyDetails,
  leaveCompany,
  joinCompany,
  employeeDashboard,
} = require("../controllers/employee");
const isLoggedIn = require("../middleware/authentication");

//Add company
router.route("/company/register").post(isLoggedIn, addCompany);

//update company details
router.route("/company/update").put(isLoggedIn, updateCompanyDetails);

//leave company
router.route("/company/leave").put(isLoggedIn, leaveCompany);

//Join company
router.route("/company/join").put(isLoggedIn, joinCompany);

//get employee dashboard
router.route("/dashboard").get(isLoggedIn, employeeDashboard);

module.exports = router;
