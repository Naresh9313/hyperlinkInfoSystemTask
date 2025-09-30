const Comment = require("../../model/commentModel/commentModel");
const Post = require("../../model/postModel/postModel");

module.exports.createPost = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    const post = await Post.create({
      user_id: req.user._id,
      title,
      content,
      status,
    });

    return res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Create post error!" 
    });
  }
};

module.exports.updatePosts = async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.query.id, user_id: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found or not authorized!",
      });
    }

    return res.status(200).json({
      message: "Post updated successfully!",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
       message: "Update post error!" 
      });
  }
};

module.exports.softDeletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.query.id, user_id: req.user._id },
      { is_deleted: true },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found or not authorized!"
      });
    }

    return res.status(200).json({ 
      message: "Post soft deleted successfully!",
      post
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Soft delete post error!"
    });
  }
};

module.exports.permanentDeletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: req.query.id,
      user_id: req.user._id,
    });

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found or not authorized!"
      });
    }

    return res.status(200).json({
      message: "Post permanently deleted successfully!"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Permanent delete post error!"
    });
  }
};



module.exports.listPost = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const posts = await Post.find({ is_deleted: false })
      .populate("user_id", "name email")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments({ is_deleted: false });
    return res.json({
      page,
      limit,
      total,
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "List post error!" 
    });
  }
};

module.exports.getOtherUserPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const posts = await Post.find({
      user_id: { $ne: req.query.userId },
      is_deleted: false,
    })  
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      page,
      limit
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
       message: "Get other user's posts error!" 
      });
  }
};

module.exports.getMyPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const posts = await Post.find({ 
      user_id: req.user._id, is_deleted: false
     })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
       message: "Get my posts error!"
       });
  }
};

module.exports.likeOrDislikePost = async (req, res) => {
  try {
    const { action } = req.body;
    const post = await Post.findById(req.query.id);
    if (!post) {
      return res.status(404).json({ 
        message: "Post not found!" 
      });
    }

    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    post.dislikes = post.dislikes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    if (action === "like") post.likes.push(req.user._id);
    if (action === "dislike") post.dislikes.push(req.user._id);

    await post.save();
    return res.status(200).json({ message: `Post ${action}d`, post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Like/Dislike post error!" });
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({
      user_id: req.user._id,
      post_id: req.query.postId,
      text,
    });
    return res
      .status(201)
      .json({ 
        message: "Comment added successfully!", comment 
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Edit comment error!" 
    });
  }
};

module.exports.editComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.query.commentId, user_id: req.user._id },
      { text: req.body.text },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ 
          message: "Comment not found or not authorized!" 
        });
    }
    return res
      .status(200)
      .json({
         message: "Comment updated successfully!", comment
         });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
       message: "Edit comment error!"
       });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findOneAndDelete({
      _id: req.query.commentId,
      user_id: req.user._id,
    });
    if (!deletedComment) {
      return res
        .status(404)
        .json({
           message: "Comment not found or not authorized!" 
          });
    }
    return res.status(200).json({ 
      message: "Comment deleted successfully!"
     });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Delete comment error!" 
    });
  }
};

module.exports.listComments = async (req, res) => {
  try {
    const postId = req.query.postId;

    const comments = await Comment.find({
      post_id: postId,
      is_deleted: false,
    }).populate("user_id", "name email");

    console.log(comments);
    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
       message: "List comments error!" 
      });
  }
};
