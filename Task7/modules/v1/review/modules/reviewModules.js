import statusCode from "../../../../config/statusCode.js";
import ShopReview from "../../../../database/models/reviewModel.js";
import helper from "../../../../middleware/headerVerification.js";





const addShopReview1 = async (req, res) => {
  try {
    const { shopId, rating, comment } = req;

    if (!shopId || !rating) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "VALIDATION_ERROR",
        components: ["shopId and rating are required"],
      });
    }

    const existingReview = await ShopReview.findOne({
      user: req.user.userId,
      shop: shopId,
    });

    if (existingReview) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "REVIEW_ALREADY_EXISTS",
        components: ["You have already reviewed this shop"],
      });
    }

    const review = new ShopReview({
      user: req.user.userId,
      shop: shopId,
      rating,
      comment: comment || "",
    });

    await review.save();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "REVIEW_ADDED_SUCCESS",
      components: [],
    }, review);
  } catch (error) {
    console.error("addShopReview error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

export default {addShopReview};