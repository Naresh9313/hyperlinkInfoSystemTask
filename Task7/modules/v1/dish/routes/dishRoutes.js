import  express from 'express';

import dishController from "../controller/dishController.js";

const router = express.Router();



//category
router.post("/addCategory", dishController.addCategory);
router.put("/updateCategory",dishController.updateCategory)
router.get("/getCategoriesByShop",dishController.getCategoriesByShop)
router.delete("/deleteCategory",dishController.deleteCategory)
router.get("/searchCategories",dishController.searchCategories)

//shop
router.post("/addShop", dishController.addShop);
router.put("/updateShop", dishController.updateShop);
router.get("/getShop", dishController.getShopById);
router.delete("/deleteShop",dishController.deleteShop);

//item
router.post("/addItem", dishController.addItem);
router.put("/updateitem", dishController.updateItem);
router.get("/getItemsByCategory", dishController.getItemsByCategory);
router.delete("/deleteItem",dishController.deleteItem);



//user(menu+item)
router.get("/getFullMenuByShop", dishController.getFullMenuByShop);

export default router;
