import  express from 'express';

import cartController from "../controller/cartController.js";

const router = express.Router();

router.post("/addToCart", cartController.addToCart);
router.delete('/removeCart', cartController.removeCart);
router.get ('/myCart', cartController.getCart);

export default router;
