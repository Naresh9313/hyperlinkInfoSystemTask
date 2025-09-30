import  express from 'express';
import orderController from './orderController.js';


const router = express.Router();



//category
router.post("/createOrder",orderController.createOrder)
router.get("/getOrder",orderController.getOrders)
// router.delete("/removeCart",orderController.removeFromCart)


export default router