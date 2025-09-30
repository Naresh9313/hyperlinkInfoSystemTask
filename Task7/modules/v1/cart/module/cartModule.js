import cartModel from "../../../../database/models/cartModel.js";
import dishModel from "../../../../database/models/dishModel.js";
import helper from "../../../../middleware/headerVerification.js";

// ✅ Add to Cart
const addToCart = async (req, res, user, dishId, quantity, shopId) => {
  try {
    const dish = await dishModel.findById(dishId);
    if (!dish) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "DISH_NOT_FOUND",
        components: [],
      });
    }

    let cart = await cartModel.findOne({ user: user.userId, shop: shopId });

    if (!cart) {
      cart = new cartModel({
        user: user.userId,
        shop: shopId,
        dishes: [{ dish: dishId, quantity, subtotal: dish.price * quantity }],
        total: dish.price * quantity,
      });
    } else {
      const index = cart.dishes.findIndex(
        (item) => item.dish.toString() === dishId
      );

      if (index >= 0) {
        cart.dishes[index].quantity += quantity;
        cart.dishes[index].subtotal = cart.dishes[index].quantity * dish.price;
      } else {
        cart.dishes.push({
          dish: dishId,
          quantity,
          subtotal: dish.price * quantity,
        });
      }

      cart.total = cart.dishes.reduce((acc, item) => acc + item.subtotal, 0);
    }

    await cart.save();

    return helper.sendApiResponse(req, res, 200, {
      keyword: "ITEM_ADDED_TO_CART",
      components: [],
    }, cart);
  } catch (error) {
    console.error("addToCart error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

// ✅ Remove from Cart
const removeCart = async (req, res, user, dishId, shopId) => {
  try {
    const cart = await cartModel.findOne({ user: user.userId, shop: shopId });
    if (!cart) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "CART_NOT_FOUND",
        components: [],
      });
    }

    const initialLength = cart.dishes.length;
    cart.dishes = cart.dishes.filter((item) => item.dish.toString() !== dishId);

    if (cart.dishes.length === initialLength) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "DISH_NOT_IN_CART",
        components: [],
      });
    }

    // Recalculate total
    cart.total = cart.dishes.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();

    return helper.sendApiResponse(req, res, 200, {
      keyword: "DISH_REMOVED_FROM_CART",
      components: [],
    }, cart);
  } catch (error) {
    console.error("removeCart error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

// ✅ Get Cart
const getCart = async (req, res, user, shopId) => {
  try {
    const cart = await cartModel.findOne({ user: user.userId, shop: shopId })
      .populate("dishes.dish", "name price imageUrl");

    if (!cart) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "CART_NOT_FOUND",
        components: [],
      });
    }

    return helper.sendApiResponse(req, res, 200, {
      keyword: "CART_FETCHED_SUCCESSFULLY",
      components: [],
    }, cart);
  } catch (error) {
    console.error("getCart error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

export default { addToCart, removeCart, getCart };
