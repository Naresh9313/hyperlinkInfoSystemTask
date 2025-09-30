
import statusCode from "../../../config/statusCode.js";
import helper from "../../../middleware/headerVerification.js";
import orderModule from "./orderModule.js";


const createOrder = (req, res) => {
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
      orderModule.createOrder(req, res);
    });
  } catch (error) {
    console.error("Order Controller createOrder error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "INTERNAL_SERVER_ERROR", components: [] });
  }
};

const getOrders = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, { keyword: "TOKEN_INVALID", components: [] });
    }

    req.user = user;
    orderModule.getOrders(req, res);
  } catch (error) {
    console.error("Order Controller getOrders error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "INTERNAL_SERVER_ERROR", components: [] });
  }
};

export default { createOrder, getOrders };