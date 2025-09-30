import statusCode from "../../../config/statusCode.js";
import cartModules from "./cartModules.js";
import helper from "../../../middleware/headerVerification.js";

const addToCart = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    req.user = user;
    console.log(user);
    helper.decryption(req.body, (decryptedReq, err) => {
      if (err) {
        console.error("Decryption error:", err.message);
        return helper.sendApiResponse(
          req,
          res,
          statusCode.INTERNAL_SERVER_ERROR,
          { keyword: "DECRYPTION_FAILED", components: [] }
        );
      }

      req.body = decryptedReq;
      cartModules.addToCart(req, res);
    });
  } catch (error) {
    console.error("Cart Controller addToCart error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getCart = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    console.log(user);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    req.user = user;
    cartModules.getCart(req, res);
  } catch (error) {
    console.error("Cart Controller getCart error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const removeFromCart = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    req.user = user;

    helper.decryption(req.body, (decryptedReq, err) => {
      if (err) {
        console.error("Decryption error:", err.message);
        return helper.sendApiResponse(
          req,
          res,
          statusCode.INTERNAL_SERVER_ERROR,
          { keyword: "DECRYPTION_FAILED", components: [] }
        );
      }

      req.body = decryptedReq;
      cartModules.removeFromCart(req, res);
    });
  } catch (error) {
    console.error("Cart Controller removeFromCart error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

export default { addToCart, getCart, removeFromCart };
