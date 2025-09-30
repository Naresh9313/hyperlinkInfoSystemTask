import helper from "../../../../middleware/headerVerification.js";
import cartModule from "../module/cartModule.js";

// ✅ Add to Cart
const addToCart = async (req, res) => {
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

      const { dishId, quantity, shopId } = decryptedReq;

      if (!dishId || !shopId || quantity <= 0) {
        return helper.sendApiResponse(req, res, 400, {
          keyword: "INVALID_REQUEST",
          components: [],
        });
      }

      cartModule.addToCart(req, res, user, dishId, quantity, shopId);
    });
  } catch (error) {
    console.error("addToCart Controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

// ✅ Remove from Cart
const removeCart = async (req, res) => {
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

      const { dishId, shopId } = decryptedReq;

      if (!dishId || !shopId) {
        return helper.sendApiResponse(req, res, 400, {
          keyword: "INVALID_REQUEST",
          components: [],
        });
      }

      cartModule.removeCart(req, res, user, dishId, shopId);
    });
  } catch (error) {
    console.error("removeCart Controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

// ✅ Get Cart
const getCart = async (req, res) => {
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

      const { shopId } = decryptedReq;

      if (!shopId) {
        return helper.sendApiResponse(req, res, 400, {
          keyword: "INVALID_REQUEST",
          components: [],
        });
      }

      cartModule.getCart(req, res, user, shopId);
    });
  } catch (error) {
    console.error("getCart Controller error:", error.message);
    return helper.sendApiResponse(req, res, 500, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

export default { addToCart, removeCart, getCart };
