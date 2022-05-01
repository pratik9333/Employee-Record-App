const router = require("express").Router();

const { getListOfCompanies, viewCompany } = require("../controllers/user");

//get List Of Companies
router.route("/companies").get(getListOfCompanies);

//view Company
router.route("/company").get(viewCompany);

module.exports = router;
