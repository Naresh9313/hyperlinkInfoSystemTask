import  express from 'express';

import commentController from "../controller/commentController.js";

const router = express.Router();

router.post("/addComment", commentController.addComment);
export default router;
