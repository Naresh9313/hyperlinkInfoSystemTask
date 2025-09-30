import Category from "../../../../database/models/categotyModel.js";
import Product from "../../../../database/models/productModel.js";
import Brand from "../../../../database/models/brandModel.js"
import helper from "../../../../middleware/headerVerification.js";
import statusCode from "../../../../config/statusCode.js";

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "CATEGORIES_FETCHED_SUCCESS",
      components: [],
      count: categories.length,
      data: categories,
    },
  categories);
  } catch (error) {
    console.error("getCategories error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};


const getProducts = async (req, res) => {
  try {
    const { category, brand, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (category) {
      const catDoc = await Category.findOne({ name: category });
      if (!catDoc) return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "CATEGORY_NOT_FOUND", components: [] });
      filter.category = catDoc._id;
    }

    if (brand) {
      const brandDoc = await Brand.findOne({ name: brand });
      if (!brandDoc) return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "BRAND_NOT_FOUND", components: [] });
      filter.brand = brandDoc._id;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .populate("category", "name")
      .populate("brand", "name")
      .lean();

    const total = await Product.countDocuments(filter);

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "PRODUCTS_FETCHED_SUCCESS",
      components: [],
      count: total,
      page: Number(page),
      limit: Number(limit),
      data: products,
    },
  products);
  } catch (error) {
    console.error("getProducts error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
  }
};





const getProductById = async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "PRODUCT_NOT_FOUND",
        components: [],
      });
    }

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "PRODUCT_FETCHED_SUCCESS",
      components: [],
    },product);
  } catch (error) {
    console.error("getProductById error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default { getCategories, getProducts, getProductById };
