import statusCode from "../../../../config/statusCode.js";
import categoryModel from "../../../../database/models/categoryModel.js";
import dishModel from "../../../../database/models/dishModel.js";
import shopModel from "../../../../database/models/shopModel.js";
import helper from "../../../../middleware/headerVerification.js";

//shop
// const addShop1 = async (req,res) => {
//   try{
//     const {name,address,city,state,imageUrl} = req;
//     if(user.role !=="chef"){
//       return helper.sendApiResponse(req,res,statusCode.FORBIDDEN,{
//         Keyword:"CHEF_ONLY",
//         components:[],
//       })
//     }

//     if(!name || !address){
//       return  helper.sendApiResponse(req,res,statusCode.VALIDATION_ERROR,{
//         Keyword:"REQUIRED_ALL",
//         components:[],
//       })
//     }

//     const shop = new shopModel ({
//       name,
//       address,
//       city,
//       state,
//       imageUrl
//     })

//     await shop.save();
  

//     return helper.sendApiResponse(req,res,statusCode.SUCCESS,{
//       Keyword:"SUCCESS",
//       components:[]
//     })

//   }catch(error){
//     return helper.sendApiResponse(req,res,statusCode.INTERNAL_SERVER_ERROR,{
//       keyword:"SERVER_ERROR",
//       components:""
//     })
//   }
// }



const addShop = async (req, res) => {
  try {
    const { name, address, city, state, imageUrl } = req.body;

    if (!req.user || req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    if (!name || !address) {
      return helper.sendApiResponse(req, res, 400, {
        keyword: "NAME_AND_ADDRESS_REQUIRED",
        components: [],
      });
    }

    const shop = new shopModel({
      name,
      address,
      city,
      state,
      imageUrl,
      chef: req.user.userId,
    });

    await shop.save();

    return helper.sendApiResponse(
      req,
      res,
      201,
      {
        keyword: "SHOP_CREATED_SUCCESS",
        components: [],
      },
      shop
    );
  } catch (error) {
    console.error("createShop error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const updateShop = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, address, city, state, imageUrl } = req.body;

    if (!req.user || req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    const shop = await shopModel.findOne({ _id: id, chef: req.user.userId });
    if (!shop) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "SHOP_NOT_FOUND",
        components: [],
      });
    }

    if (name) shop.name = name;
    if (address) shop.address = address;
    if (city) shop.city = city;
    if (state) shop.state = state;
    if (imageUrl) shop.imageUrl = imageUrl;

    await shop.save();

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "SHOP_UPDATED_SUCCESS",
        components: [],
      },
      shop
    );
  } catch (error) {
    console.error("updateShop error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const deleteShop = async (req, res) => {
  try {
    const { id } = req.query;

    const shop = await shopModel.findOne({ _id: id, chef: req.user.userId });
    if (!shop) return null;

    await shop.deleteOne();

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "SHOP_DELETE_SUCCESS",
        components: [],
      },
      shop
    );
  } catch (error) {
    console.error("deleteShop error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getShopById = async (req, res) => {
  try {
    const { id } = req.query;

    const shop = await shopModel.findById(id).populate("chef", "name email");

    if (!shop) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "SHOP_NOT_FOUND",
        components: [],
      });
    }

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "SHOP_FETCHED_SUCCESS",
        components: [],
      },
      shop
    );
  } catch (error) {
    console.error("getShopById error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//category
const addCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    if (!req.user || req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, statusCode.FORBIDDEN, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    const category = new categoryModel({
      name,
      chef: req.user.userId,
      imageUrl,
    });

    await category.save();

    return helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      {
        keyword: "CATEGORY_ADDED_SUCCESS",
        components: [],
      },
      category
    );
  } catch (error) {
    console.error("addCategory error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, imageUrl } = req.body;

    if (!req.user || req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, statusCode.FORBIDDEN, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    const category = await categoryModel.findOne({
      _id: id,
      chef: req.user.userId,
    });
    if (!category) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "CATEGORY_NOT_FOUND",
        components: [],
      });
    }

    if (name) category.name = name;
    if (imageUrl) category.imageUrl = imageUrl;

    await category.save();

    return helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      {
        keyword: "CATEGORY_UPDATED_SUCCESS",
        components: [],
      },
      category
    );
  } catch (error) {
    console.error("updateCategory error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getCategoriesByShop = async (req, res) => {
  try {
    const { shopId } = req.query;

    const shop = await shopModel.findById(shopId);
    if (!shop) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "SHOP_NOT_FOUND",
        components: [],
      });
    }

    const categories = await categoryModel.find({ chef: shop.chef });

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "CATEGORIES_FETCHED_SUCCESS",
        components: [],
      },
      categories
    );
  } catch (error) {
    console.error("getCategoriesByShop error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const deleteCategory = async (req) => {
  const { id } = req.query;

  const category = await categoryModel.findOne({
    _id: id,
    chef: req.user.userId,
  });
  if (!category) return null;

  await category.deleteOne();
  return category;
};

const searchCategories = async (req, res) => {
  try {
    const { keyword } = req.query;

    const query = keyword ? { name: { $regex: keyword, $options: "i" } } : {};

    const categories = await categoryModel.find(query);

    return helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      {
        keyword: "CATEGORIES_FETCHED_SUCCESS",
        components: [],
      },
      categories
    );
  } catch (error) {
    console.error("searchCategories error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};


//addItem

const addItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, imageUrl } = req.body;

    if (!req.user || req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    if (!name || !description || !price || !categoryId) {
      return helper.sendApiResponse(req, res, 400, {
        keyword: "REQUIRED_FIELDS_MISSING",
        components: [],
      });
    }

    const category = await categoryModel.findOne({
      _id: categoryId,
      chef: req.user.userId,
    });
    if (!category) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "CATEGORY_NOT_FOUND",
        components: [],
      });
    }

    const dish = new dishModel({
      name,
      description,
      price,
      category: category._id,
      chef: req.user.userId,
      imageUrl,
    });

    await dish.save();

    return helper.sendApiResponse(
      req,
      res,
      201,
      {
        keyword: "ITEM_ADDED_SUCCESS",
        components: [],
      },
      dish
    );
  } catch (error) {
    console.error("addItem error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, description, price, categoryId, imageUrl } = req.body;

    if (!req.user || req.user.role !== "chef") {
      return helper.sendApiResponse(req, res, 403, {
        keyword: "FORBIDDEN_CHEF_ONLY",
        components: [],
      });
    }

    const dish = await dishModel.findOne({ _id: id, chef: req.user.userId });
    if (!dish) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "ITEM_NOT_FOUND",
        components: [],
      });
    }

    if (categoryId) {
      const category = await categoryModel.findOne({
        _id: categoryId,
        chef: req.user.userId,
      });
      if (!category) {
        return helper.sendApiResponse(req, res, 404, {
          keyword: "CATEGORY_NOT_FOUND",
          components: [],
        });
      }
      dish.category = category._id;
    }

    if (name) dish.name = name;
    if (description) dish.description = description;
    if (price) dish.price = price;
    if (imageUrl) dish.imageUrl = imageUrl;

    await dish.save();

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "ITEM_UPDATED_SUCCESS",
        components: [],
      },
      dish
    );
  } catch (error) {
    console.error("updateItem error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const deleteItem = async (req) => {
  const { id } = req.query;

  const item = await dishModel.findOne({ _id: id, chef: req.user.userId });
  if (!item) return null;

  await item.deleteOne();
  return item;
};

const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "CATEGORY_NOT_FOUND",
        components: [],
      });
    }

    const items = await dishModel.find({ category: categoryId });

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "ITEMS_FETCHED_SUCCESS",
        components: [],
      },
      items
    );
  } catch (error) {
    console.error("getItemsByCategory error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

const getFullMenuByShop = async (req, res) => {
  try {
    const { shopId } = req.query;

    const shop = await shopModel.findById(shopId);
    if (!shop) {
      return helper.sendApiResponse(req, res, 404, {
        keyword: "SHOP_NOT_FOUND",
        components: [],
      });
    }

    const categories = await categoryModel.find({ chef: shop.chef });

    const menu = await Promise.all(
      categories.map(async (category) => {
        const items = await dishModel.find({ category: category._id });
        return {
          categoryId: category._id,
          categoryName: category.name,
          imageUrl: category.imageUrl,
          items,
        };
      })
    );

    return helper.sendApiResponse(
      req,
      res,
      200,
      {
        keyword: "MENU_FETCHED_SUCCESS",
        components: [],
      },
      menu
    );
  } catch (error) {
    console.error("getFullMenuByShop error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

export default {
  getCategoriesByShop,
  deleteShop,
  deleteItem,
  deleteCategory,
  getShopById,
  addCategory,
  searchCategories,
  updateCategory,
  addShop,
  updateShop,
  getCategoriesByShop,
  addItem,
  updateItem,
  getItemsByCategory,
  getFullMenuByShop,
};
