import  express from 'express';

import orderController from "../controller/orderController.js";

const router = express.Router();

router.post("/createOrder", orderController.createOrder);
router.delete("/cancelOrder", orderController.cancelOrder);
router.get("/getMyOrders",orderController.getMyOrders)
router.get("/getAllOrders",orderController.getAllOrders)
router.put("/updateOrderStatus",orderController.updateOrderStatus)
export default router;
