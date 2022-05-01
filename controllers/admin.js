const Auth = require("../models/auth");
const httpError = require("../utils/functions/httpError");
const User = require("../models/user");
const Company = require("../models/company");
const { sendMail } = require("../utils/functions/sendMail");
const Query = require("../utils/functions/query");

exports.getListOfAllCompanies = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user.role !== "admin") {
      throw httpError("Unauthorized access");
    }
    const companiesCount = await Company.countDocuments();
    const resultPerPage = 6;

    //creating object from our custom class and passing base = Company.find(), bigQ = req.query
    const companyObj = new Query(Company.find({ verified: false }), req.query);

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
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("Cannot able to fetch list of companies"));
  }
};

exports.updateCompanyStatus = async () => {
  try {
    const { companyId } = req.body;

    if (req.user.role !== "admin") {
      throw httpError("Unauthorized access");
    }

    if (!companyId) {
      throw httpError("Please provide company ID");
    }

    const existingCompany = await Company.findById(req.body.companyId);

    let user = existingCompany.listOfEmployees[0].userId;

    user = await User.findById(user);

    existingCompany.verified = true;

    await existingCompany.save();

    const subject = `Regarding company verification status`;
    const mailBody = `<p>Hello ${user.name}, verification status for registering company <b>${existingCompany.name}</b> has been verified successfully and has been listed in website.</p>`;

    sendMail(user.email, mailBody, subject);

    res.status(200).json({
      success: true,
      message: "Company has been verified successfully",
    });
  } catch (error) {
    if (error.error) return res.send(error);
    return res.send(httpError("Cannot able to fetch list of companies"));
  }
};
