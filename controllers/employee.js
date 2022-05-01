const Company = require("../models/company");
const User = require("../models/user");
const httpError = require("../utils/functions/httpError");
const cloudinary = require("cloudinary");

exports.addCompany = async (req, res) => {
  try {
    const { name, email, contactNo, location, shortSummary } = req.body;

    if (!name || !email || !contactNo || !location || !shortSummary) {
      throw httpError("Please provide all required details for registration");
    }

    const getExistingCompany = await Company.find({ name });

    if (getExistingCompany.length > 0) {
      throw httpError("Company with given name already exists");
    }

    if (req.files) {
      const file = req.files.photo;
      //uploading file to cloudinary
      const response = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "company",
        width: 150,
        crop: "scale",
      });
      req.body.photo = {
        id: response.public_id,
        url: response.secure_url,
      };
    }

    req.body.listOfEmployees = [
      {
        userId: req.user._id,
        status: "working",
        startDate: new Date(),
        endDate: null,
      },
    ];
    req.body.lastUpdatedBy = req.user._id;

    await Company.create(req.body);

    return res.status(200).json({
      success: true,
      message:
        "Company will be registered after successfull verification and will be notified via mail",
    });
  } catch (error) {
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("Failed to register, please try again"));
  }
};

exports.updateCompanyDetails = async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      throw httpError("Please provide company ID");
    }

    const existingCompany = await Company.findById(companyId);

    if (!existingCompany) {
      throw httpError(
        "Provided company ID is wrong or company does not exists"
      );
    }

    if (req.files) {
      const file = req.files.photo;
      const imageId = existingCompany.photo.id;

      if (existingCompany.photo.id) {
        //delete photo on cloudinary
        await cloudinary.v2.uploader.destroy(imageId);
      }

      //uploading file to cloudinary
      const response = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });

      req.body.photo = {
        id: response.public_id,
        url: response.secure_url,
      };
    }

    req.body.lastUpdatedBy = req.user._id;

    await Company.findByIdAndUpdate(existingCompany._id, req.body);

    return res.status(200).json({
      success: true,
      message: "Company details has been updated",
    });
  } catch (error) {
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("Failed to update, please try again"));
  }
};

exports.leaveCompany = async (req, res) => {
  try {
    let flag = 0;
    if (!req.body.companyId) {
      throw httpError("Please provide company ID");
    }
    const existingCompany = await Company.findById(req.body.companyId);
    const user = await User.findById(req.user._id);

    if (!existingCompany) {
      throw httpError(
        "Provided company ID is wrong or company does not exists"
      );
    }

    for (let user of existingCompany.listOfEmployees) {
      if (user.userId.toString() === req.user._id.toString()) {
        if (user.status === "worked") {
          throw httpError(`You already leaved ${existingCompany.name}`);
        }
        user.status = "worked";
        user.endDate = new Date();
        flag = 1;
        break;
      }
    }

    if (flag == 0)
      throw httpError(`You do not work in ${existingCompany.name}`);

    for (let company of user.companies) {
      if (company.companyId.toString() === existingCompany._id.toString()) {
        company.status = "worked";
        company.endDate = new Date();
        break;
      }
    }

    await user.save();
    await existingCompany.save();

    return res.status(200).json({
      success: true,
      message: `${user.name} has successfully leaved ${existingCompany.name}!`,
    });
  } catch (error) {
    console.log(error);
    if (error.error) return res.send(error);
    return res.send(httpError("Failed to leave company, please try again"));
  }
};

exports.joinCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    if (!companyId) {
      throw httpError("Please provide company ID");
    }
    const existingCompany = await Company.findById(companyId);
    const user = await User.findById(req.user._id);

    if (!existingCompany) {
      throw httpError(
        "Provided company ID is wrong or company does not exists"
      );
    }

    for (let company of user.companies) {
      if (company.status === "working") {
        throw httpError("User can only join one company at a time");
      }
    }

    existingCompany.listOfEmployees.push({
      userId: user._id,
      status: "working",
      startDate: new Date(),
      endDate: null,
    });
    user.companies.push({
      companyId,
      status: "working",
      startDate: new Date(),
      endDate: null,
    });

    await user.save();
    await existingCompany.save();
    return res.status(200).json({
      success: true,
      message: `${user.name} has successfully joined ${existingCompany.name}!`,
    });
  } catch (error) {
    if (error.error) return res.send(error);
    return res.send(httpError("Failed to join company, please try again"));
  }
};

exports.employeeDashboard = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error.error) return res.send(error);
    return res.send(httpError("Failed to leave company, please try again"));
  }
};
