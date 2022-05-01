const router = require("express").Router();

const {
  updateCompanyStatus,
  getListOfAllCompanies,
} = require("../controllers/admin");

const isLoggedIn = require("../middleware/authentication");

//get List Of All Companies
router.route("/companies/all").get(isLoggedIn, getListOfAllCompanies);

//view Company
router.route("/company/update/status").put(isLoggedIn, updateCompanyStatus);

module.exports = router;
