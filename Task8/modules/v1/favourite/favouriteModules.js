import statusCode from "../../../config/statusCode.js";
import favouriteModel from "../../../database/models/favouriteModel.js";
import productModel from "../../../database/models/productModel.js";
import helper from "../../../middleware/headerVerification.js";

const addFavourite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "INVALID_REQUEST", components: [] });
    }

    const product = await productModel.findById(productId);
    if (!product) return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "PRODUCT_NOT_FOUND", components: [] });

    let favourite = await favouriteModel.findOne({ user: userId });

    if (!favourite) {
      favourite = new favouriteModel({
        user: userId,
        products: [{ product: productId }],
      });
    } else {
      const exists = favourite.products.some(p => p.product.toString() === productId);
      if (exists) {
        return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "PRODUCT_ALREADY_FAVOURITE", components: favourite.products },product);
      }
      favourite.products.push({ product: productId });
    }

    await favourite.save();
    return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "PRODUCT_ADDED_TO_FAVOURITE", components: favourite.products });
  } catch (error) {
    console.error("Favourite Module addFavourite error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
  }
};

const getFavourite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favourite = await favouriteModel.findOne({ user: userId }).populate("products.product", "name price imageUrl");

    if (!favourite || favourite.products.length === 0) {
      return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "FAVOURITE_EMPTY", components: [] });
    }

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "FAVOURITE_FETCHED_SUCCESS", components: favourite.products },favourite);
  } catch (error) {
    console.error("Favourite Module getFavourite error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
  }
};


const removeFavourite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "INVALID_REQUEST", components: [] });
    }

    const favourite = await favouriteModel.findOne({ user: userId });
    if (!favourite) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "FAVOURITE_NOT_FOUND", components: [] });
    }

    const index = favourite.products.findIndex(p => p.product.toString() === productId);
    if (index === -1) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "PRODUCT_NOT_IN_FAVOURITE", components: [] });
    }

    favourite.products.splice(index, 1);
    await favourite.save();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "PRODUCT_REMOVED_FROM_FAVOURITE", components: favourite.products });
  } catch (error) {
    console.error("Favourite Module removeFavourite error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
  }
};

export default { addFavourite, getFavourite, removeFavourite };

