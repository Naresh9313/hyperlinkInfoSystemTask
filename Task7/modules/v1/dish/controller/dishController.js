import dishModule from "../module/dishModule.js";
import helper from "../../../../middleware/headerVerification.js";
import statusCode from "../../../../config/statusCode.js";
import validaterules from "../validationRules.js";

//shop
// const addShop1 = async(req,res) => {
//   const authHeader =req.headers["authorization"];
//   const user = helper.validateHeaderToken(authHeader);
// }

const addShop = (req, res) => {
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
          {
            keyword: "DECRYPTION_FAILED",
            components: [],
          }
        );
      }

      req.body = decryptedReq;

      const validate = helper.checkValidationRules(
        req,
        validaterules.dishValidation
      );
      if (!validate) {
        return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }

      dishModule.addShop(req, res);
    });
  } catch (error) {
    console.error("createShop Controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//updateShop
const updateShop = (req, res) => {
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
          {
            keyword: "DECRYPTION_FAILED",
            components: [],
          }
        );
      }

      req.body = decryptedReq;

      const validate = helper.checkValidationRules(
        req,
        validaterules.dishValidation
      );
      if (!validate) {
        return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }

      dishModule.updateShop(req, res);
    });
  } catch (error) {
    console.error("updateShop Controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//deleteShop
const deleteShop = (req, res) => {
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

    if (req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    const shop = dishModule.deleteShop(req, res);
    if (!shop) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "SHOP_NOT_FOUND",
        components: [],
      });
    }

    return helper.sendApiResponse(req, res, 200, {
      keyword: "SHOP_DELETED_SUCCESS",
      components: [],
    });
  } catch (error) {
    console.error("deleteShop Controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};


//getShopById
const getShopById = (req, res) => {
  try {
    dishModule.getShopById(req, res);
  } catch (error) {
    console.error("getShopById  error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//category
const addCategory = (req, res) => {
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
          {
            keyword: "DECRYPTION_FAILED",
            components: [],
          }
        );
      }

      req.body = decryptedReq;

      const validate = helper.checkValidationRules(
        req,
        validaterules.dishValidation
      );
      if (!validate) {
        return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }

      dishModule.addCategory(req, res);
    });
  } catch (error) {
    console.error("addCategory Controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};


//udateCategory
const updateCategory = (req, res) => {
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
          {
            keyword: "DECRYPTION_FAILED",
            components: [],
          }
        );
      }

      req.body = decryptedReq;

      const validate = helper.checkValidationRules(
        req,
        validaterules.dishValidation
      );
      if (!validate) {
        return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }

      dishModule.updateCategory(req, res);
    });
  } catch (error) {
    console.error("updateCatgegory Controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//deleteCategory
const deleteCategory = (req, res) => {
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

    if (req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    const category = dishModule.deleteCategory(req, res);
    if (!category) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "CATEGORY_NOT_FOUND",
        components: [],
      });
    }

    return helper.sendApiResponse(req, res, 200, {
      keyword: "CATEGORY_DELETED_SUCCESS",
      components: [],
    });
  } catch (error) {
    console.error("deleteCategory error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//getCategoriesByShop
const getCategoriesByShop = (req, res) => {
  try {
    dishModule.getCategoriesByShop(req, res);
  } catch (error) {
    console.error("getcategoryById  error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//
const searchCategories = (req, res) => {
  try {
    dishModule.searchCategories(req, res);
  } catch (error) {
    console.error("searchCategories  error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//addItem
const addItem = (req, res) => {
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
          {
            keyword: "DECRYPTION_FAILED",
            components: [],
          }
        );
      }

      req.body = decryptedReq;

      const validate = helper.checkValidationRules(
        req,
        validaterules.dishValidation
      );
      if (!validate) {
        return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }

      dishModule.addItem(req, res);
    });
  } catch (error) {
    console.error("addItem Controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//updateItem
const updateItem = (req, res) => {
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
          {
            keyword: "DECRYPTION_FAILED",
            components: [],
          }
        );
      }

      req.body = decryptedReq;

      const validate = helper.checkValidationRules(
        req,
        validaterules.dishValidation
      );
      if (!validate) {
        return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }

      dishModule.updateItem(req, res);
    });
  } catch (error) {
    console.error("updateShop Controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//deleteItem
const deleteItem = (req, res) => {
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

    if (req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    const category = dishModule.deleteItem(req, res);
    if (!category) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "ITEM_NOT_FOUND",
        components: [],
      });
    }

    return helper.sendApiResponse(req, res, 200, {
      keyword: "ITEM_DELETED_SUCCESS",
      components: [],
    });
  } catch (error) {
    console.error("deleteItem error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//getItemByCategory
const getItemsByCategory = (req, res) => {
  try {
    dishModule.getItemsByCategory(req, res);
  } catch (error) {
    console.error("getcategoryById  error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

///user(menu+item)
const getFullMenuByShop = (req, res) => {
  try {
    dishModule.getFullMenuByShop(req, res);
  } catch (error) {
    console.error("getcategoryById  error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};


export default {
  addCategory,
  searchCategories,
  updateCategory,
  addShop,
  updateShop,
  getShopById,
  getCategoriesByShop,
  addItem,
  updateItem,
  getItemsByCategory,
  getFullMenuByShop,
  deleteShop,
  deleteCategory,
  deleteItem,
};
