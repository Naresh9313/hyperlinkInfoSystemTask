import statusCode from "../../../config/statusCode.js";
import cartModel from "../../../database/models/cartModel.js";
import orderModel from "../../../database/models/orderModel.js";
import helper from "../../../middleware/headerVerification.js";


const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await cartModel.findOne({ user: userId }).populate("products.product", "name price");
    if (!cart || cart.products.length === 0) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "CART_EMPTY", components: [], total: 0 });
    }

    const order = new orderModel({
      user: userId,
      products: cart.products.map(p => ({
        product: p.product._id,
        quantity: p.quantity,
        subtotal: p.subtotal,
      })),
      total: cart.total,
    });

    await order.save();

    cart.products = [];
    cart.total = 0;
    await cart.save();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "ORDER_PLACED_SUCCESS", components: order.products, total: order.total });
  } catch (error) {
    console.error("Order Module createOrder error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await orderModel.find({ user: userId }).populate("products.product", "name price imageUrl");

    if (!orders || orders.length === 0) {
      return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "NO_ORDERS", components: [] });
    }

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "ORDERS_FETCHED_SUCCESS", components: orders },orders);
  } catch (error) {
    console.error("Order Module getOrders error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
  }
};

export default { createOrder, getOrders };