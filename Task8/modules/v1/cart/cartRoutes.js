import  express from 'express';
import cartController from './cartController.js';


const router = express.Router();



//category
router.post("/addCart",cartController.addToCart)
router.get("/getCart",cartController.getCart)
router.delete("/removeCart",cartController.removeFromCart)


export default router