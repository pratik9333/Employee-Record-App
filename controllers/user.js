const Company = require("../models/company");
const User = require("../models/user");
const httpError = require("../utils/functions/httpError");
const Query = require("../utils/functions/query");

exports.getListOfCompanies = async (req, res) => {
  try {
    const companiesCount = await Company.countDocuments();
    const resultPerPage = 6;

    //creating object from our custom class and passing base = Company.find(), bigQ = req.query
    const companyObj = new Query(Company.find({ verified: true }), req.query);

    companyObj.search();

    companyObj.pager(resultPerPage);

    let Companies = await companyObj.base;

    let filteredCompanies = Company.length;

    res.status(200).json({
      success: true,
      Companies,
      totalCompaniesCount: companiesCount,
      filteredCompanies: filteredCompanies,
    });
  } catch (error) {
    if (error.error) return res.send(error);
    return res.send(httpError("Cannot able to fetch list of companies"));
  }
};

exports.viewCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    if (!companyId) {
      throw httpError("Please provide company ID");
    }
    const existingCompany = await Company.findById(companyId).populate(
      "listOfEmployees.userId",
      "name email"
    );

    if (!existingCompany) {
      throw httpError(
        "Provided company ID is wrong or company does not exists"
      );
    }
    return res.status(200).json({
      success: true,
      existingCompany,
    });
  } catch (error) {}
};
