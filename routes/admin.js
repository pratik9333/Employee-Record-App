const router = require("express").Router();

const { updateStatus, getListOfAllCompanies } = require("../controllers/admin");

//get List Of All Companies
router.route("/companies").get(isLoggedIn, getListOfAllCompanies);

//view Company
router.route("/company/update/status").get(isLoggedIn, updateCompanyStatus);

module.exports = router;
