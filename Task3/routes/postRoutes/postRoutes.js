const express = require("express");
const router = express.Router();

const postController = require("../../controller/postController/postController");
const { protect } = require("../../middleware/authMiddleware");

router.post("/createPost", protect, postController.createPost);
router.put("/updatePost", protect, postController.updatePosts);
router.delete("/softDeletePost", protect, postController.softDeletePost);
router.delete("/permanentDeletePost",protect,postController.permanentDeletePost);
router.get("/listPost",protect,postController.listPost);
router.get("/getOtherUserPosts",protect,postController.getOtherUserPosts)
router.get("/getMyPosts",protect,postController.getMyPosts)
router.post("/likeOrDislike",protect,postController.likeOrDislikePost);
router.post("/addComment",protect,postController.addComment);
router.put("/editComment",protect,postController.editComment);
router.delete("/deleteComment",protect,postController.deleteComment);
router.get("/listComment",protect,postController.listComments);

module.exports = router;
