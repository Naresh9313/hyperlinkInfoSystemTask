import statusCode from "../../../../config/statusCode.js";
import validaterules from "../../validationRules.js";
import helper from "../../../../middleware/headerVerification.js";
import categoryModule from "../module/categoryModule.js";




const getCategories = (req, res) => {
  try {
   
    categoryModule.getCategories(req, res);
  } catch (error) {
    console.error("getCategories error!", error.message);
  }
};


const getProducts = (req, res) => {
  try {
   
    categoryModule.getProducts(req, res);
  } catch (error) {
    console.error("getProducts error!", error.message);
  }
};
const getProductById = (req, res) => {
  try {
   
    categoryModule.getProductById(req, res);
  } catch (error) {
    console.error("getProductById error!", error.message);
  }
};




export default {getCategories,getProducts,getProductById}