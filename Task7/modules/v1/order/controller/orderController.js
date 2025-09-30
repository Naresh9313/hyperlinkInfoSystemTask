import statusCode from "../../../../config/statusCode.js";
import helper from "../../../../middleware/headerVerification.js";
import orderModule from "../module/orderModule.js";

const createOrder = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    if (!user) {
      return helper.sendApiResponse(req, res, 401, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    helper.decryption(req.body, (decryptedReq, err) => {
      if (err) {
        return helper.sendApiResponse(req, res, 500, {
          keyword: "DECRYPTION_FAILED",
          components: [],
        });
      }

      const payment = decryptedReq.payment || {};
      orderModule.createOrderFromCart(req, res, user, payment);
    });
  } catch (error) {
    console.error("createOrder controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    if (!user) {
      return helper.sendApiResponse(req, res, 401, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    orderModule.cancelOrder(req, res, user);
  } catch (error) {
    console.error("cancelOrder controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    if (!user) {
      return helper.sendApiResponse(req, res, 401, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    orderModule.getUserOrders(req, res, user);
  } catch (error) {
    console.error("getMyOrders controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    if (!user || user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN",
        components: [],
      });
    }

    orderModule.getAllOrders(req, res);
  } catch (error) {
    console.error("getAllOrders controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user || (user.role !== "chef" && user.role !== "admin")) {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN",
        components: [],
      });
    }

    console.log("User:", user);

    helper.decryption(req.body, (decryptedReq, err) => {
      if (err) {
        console.error("Decryption error:", err.message);
        return helper.sendApiResponse(req, res, 500, {
          keyword: "DECRYPTION_FAILED",
          components: [],
        });
      }

      const { orderId, status } = decryptedReq;
      console.log("Order ID:", orderId, "Status:", status);

      if (!orderId || !status) {
        return helper.sendApiResponse(req, res, 400, {
          keyword: "INVALID_REQUEST",
          components: [],
        });
      }

      orderModule.updateOrderStatus(req, res, orderId, status);
    });
  } catch (error) {
    console.error("updateOrderStatus controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

export default {
  createOrder,
  cancelOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
