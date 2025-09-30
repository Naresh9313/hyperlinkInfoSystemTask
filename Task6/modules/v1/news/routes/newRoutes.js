import  express from 'express';

import newController from "../controller/newsController.js";

const router = express.Router();

router.post("/addNews", newController.addNews);
router.get("/getNewsList",newController.getNewsList);
router.get("/getSingleNews",newController.getSingleNews)
router.get("/likeDislike",newController.likeDislike);

export default router;
