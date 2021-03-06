const httpError = require("../utils/functions/httpError");
const User = require("../models/user");
const Company = require("../models/company");
const { sendMail } = require("../utils/functions/sendMail");
const Query = require("../utils/functions/query");

exports.getListOfAllCompanies = async (req, res) => {
  try {
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
    if (error.error) return res.send(error);
    return res.send(httpError("Cannot able to fetch list of companies"));
  }
};

exports.updateCompanyStatus = async (req, res) => {
  try {
    const { companyId } = req.body;

    if (req.user.role !== "admin") {
      throw httpError("Unauthorized access");
    }

    if (!companyId) {
      throw httpError("Please provide company ID");
    }

    const existingCompany = await Company.findById(req.body.companyId);

    if (!existingCompany) {
      throw httpError("Company ID is invalid or company does not exist");
    }

    let user = existingCompany.listOfEmployees[0].userId;

    user = await User.findById(user);

    existingCompany.verified = true;

    user.companies.push({
      companyId: existingCompany._id,
      status: "working",
      startDate: new Date(),
      endDate: null,
    });

    await existingCompany.save();
    await user.save();

    const subject = `Regarding company verification status`;
    const mailBody = `<p>Hello ${user.name}, verification status for registering company <b>${existingCompany.name}</b> has been verified successfully and has been listed in website.</p>`;

    sendMail(user.email, mailBody, subject);

    res.status(200).json({
      success: true,
      message: "Company has been verified successfully",
    });
  } catch (error) {
    if (error.error) return res.send(error);
    return res.send(httpError("Cannot able to verify status"));
  }
};
