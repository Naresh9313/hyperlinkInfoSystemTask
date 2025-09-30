import statusCode from "../../../../config/statusCode.js";
import cartModel from "../../../../database/models/cartModel.js";
import orderModel from "../../../../database/models/orderModel.js";
import helper from "../../../../middleware/headerVerification.js";

const createOrderFromCart = async (req, res, user, payment = {}) => {
  try {
    const cart = await cartModel.findOne({ user: user.userId });
    if (!cart || cart.dishes.length === 0) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "CART_EMPTY",
        components: [],
      });
    }

    const order = new orderModel({
      user: user.userId,
      shop: cart.shop,
      dishes: cart.dishes.map((item) => ({
        dish: item.dish,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      total: cart.total,
      payment: payment || { method: "COD", status: "Pending" },
    });

    await order.save();

    cart.dishes = [];
    cart.total = 0;
    await cart.save();

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "ORDER_CREATED",
        components: [],
      },
      order
    );
  } catch (error) {
    console.error("createOrderFromCart error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const cancelOrder = async (req, res, user) => {
  try {
    const { id } = req.query;

    const order = await orderModel.findOne({ _id: id, user: user.userId });
    if (!order) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "ORDER_NOT_FOUND",
        components: [],
      });
    }

    if (order.status === "Delivered") {
      return helper.sendApiResponse(req, res, 400, {
        keyword: "CANNOT_CANCEL_DELIVERED_ORDER",
        components: [],
      });
    }

    order.status = "Cancelled";
    await order.save();

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "ORDER_CANCELLED_SUCCESS",
        components: [],
      },
      order
    );
  } catch (error) {
    console.error("cancelOrder error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getUserOrders = async (req, res, user) => {
  try {
    const orders = await orderModel
      .find({ user: user.userId })
      .populate("dishes.dish shop");
    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "USER_ORDERS",
        components: [],
      },
      orders
    );
  } catch (error) {
    console.error("getUserOrders error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("user dishes.dish shop");
    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "ALL_ORDERS",
        components: [],
      },
      orders
    );
  } catch (error) {
    console.error("getAllOrders error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const updateOrderStatus = async (req, res, orderId, status) => {
  try {
    const order = await orderModel.findById(orderId);
    console.log(order);
    if (!order) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "ORDER_NOT_FOUND",
        components: [],
      });
    }
    order.status = status;
    await order.save();
    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "ORDER_STATUS_UPDATED",
        components: [],
      },
      order
    );
  } catch (error) {
    console.error("updateOrderStatus error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

export default {
  createOrderFromCart,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
