import statusCode from "../../../../config/statusCode.js";
import categoryModel from "../../../../database/models/categoryModel.js";
import doctorModel from "../../../../database/models/doctorModel.js";
import helper from "../../../../middleware/headerVerification.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    console.log(categories);
    helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "ALL_CATEGORY_FETCHED", components: [] },
      categories
    );
  } catch (error) {
    console.error("getAllCategories error", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    let filter = {};

    if (category) {
      const categoryDoc = await categoryModel.findOne({
        name: { $regex: new RegExp("^" + category + "$", "i") },
      });

      if (!categoryDoc) {
        return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
          keyword: "CATEGORY_NOT_FOUND",
          components: [],
        });
      }

      filter.category = categoryDoc._id;
    }

    const totalDoctors = await doctorModel.countDocuments(filter);

    const doctors = await doctorModel
      .find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("category", "name")
      .lean();

    const pagination = {
      total: totalDoctors,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalDoctors / limitNum),
    };

    return helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "ALL_DOCTORS_FETCHED", components: [] },
      { doctors, pagination }
    );
  } catch (error) {
    console.error("getAllDoctors error", error);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const getDoctorDetails = async (req, res) => {
  try {
    const { doctorId } = req.query;
    if (!doctorId) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "DOCTOR_ID_REQUIRED",
        components: [],
      });
    }

    const doctor = await doctorModel.findById(doctorId).populate("category");

    if (!doctor) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "DOCTOR_NOT_FOUND",
        components: [],
      });
    }

    helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "GET_DOCTOR_DETAILS_FETCHED", components: [] },
      doctor
    );
  } catch (error) {
    console.error("getDoctorDetails error", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default { getAllCategories, getAllDoctors, getDoctorDetails };
