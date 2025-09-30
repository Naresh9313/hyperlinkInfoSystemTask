import favouriteModules from "./favouriteModules.js";
import helper from "../../../middleware/headerVerification.js";
import statusCode from "../../../config/statusCode.js";

const addFavourite = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, { keyword: "TOKEN_INVALID", components: [] });
    }

    req.user = user;

    helper.decryption(req.body, (decryptedReq, err) => {
      if (err) {
        console.error("Decryption error:", err.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "DECRYPTION_FAILED", components: [] });
      }

      req.body = decryptedReq;
      favouriteModules.addFavourite(req, res);
    });
  } catch (error) {
    console.error("Favourite Controller addFavourite error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "INTERNAL_SERVER_ERROR", components: [] });
  }
};

const getFavourite = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, { keyword: "TOKEN_INVALID", components: [] });
    }

    req.user = user;
    favouriteModules.getFavourite(req, res);
  } catch (error) {
    console.error("Favourite Controller getFavourite error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "INTERNAL_SERVER_ERROR", components: [] });
  }
};

const removeFavourite = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, { keyword: "TOKEN_INVALID", components: [] });
    }

    req.user = user;

    helper.decryption(req.body, (decryptedReq, err) => {
      if (err) {
        console.error("Decryption error:", err.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "DECRYPTION_FAILED", components: [] });
      }

      req.body = decryptedReq;
      favouriteModules.removeFavourite(req, res);
    });
  } catch (error) {
    console.error("Favourite Controller removeFavourite error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "INTERNAL_SERVER_ERROR", components: [] });
  }
};

export default { addFavourite, getFavourite, removeFavourite };
