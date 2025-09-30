import statusCode from "../../../config/statusCode.js";
import cartModel from "../../../database/models/cartModel.js";
import productModel from "../../../database/models/productModel.js";
import helper from "../../../middleware/headerVerification.js";

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    if (!productId || quantity <= 0) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "INVALID_REQUEST",
        components: [],
      });
    }

    const product = await productModel.findById(productId);
    if (!product)
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "PRODUCT_NOT_FOUND",
        components: [],
      });

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({
        user: userId,
        products: [
          { product: productId, quantity, subtotal: product.price * quantity },
        ],
        total: product.price * quantity,
      });
    } else {
      const index = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (index >= 0) {
        cart.products[index].quantity += quantity;
        cart.products[index].subtotal =
          cart.products[index].quantity * product.price;
      } else {
        cart.products.push({
          product: productId,
          quantity,
          subtotal: product.price * quantity,
        });
      }
      cart.total = cart.products.reduce((acc, p) => acc + p.subtotal, 0);
    }

    await cart.save();
    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "PRODUCT_ADDED_TO_CART",
      components: cart.products,
      total: cart.total,
    });
  } catch (error) {
    console.error("Cart Module addToCart error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("products.product", "name price imageUrl");

    if (!cart) {
      return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
        keyword: "CART_EMPTY",
        components: [],
        total: 0,
      });
    }

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "CART_FETCHED_SUCCESS",
        components: cart.products,
        total: cart.total,
      },
      cart
    );
  } catch (error) {
    console.error("Cart Module getCart error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "INVALID_REQUEST",
        components: [],
      });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "CART_NOT_FOUND",
        components: [],
      });
    }

    const index = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (index === -1) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "PRODUCT_NOT_IN_CART",
        components: [],
      });
    }

    cart.products.splice(index, 1);

    cart.total = cart.products.reduce((acc, p) => acc + p.subtotal, 0);

    await cart.save();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "PRODUCT_REMOVED_FROM_CART",
      components: cart.products,
      total: cart.total,
    });
  } catch (error) {
    console.error("Cart Module removeFromCart error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default { addToCart, getCart, removeFromCart };
