import statusCode from "../../../../config/statusCode.js";
import commentModel from "../../../../database/model/commentModel.js";
import newsModel from "../../../../database/model/newsModel.js";
import helper from "../../../../middleware/headerVerification.js"

const addComment = async (req, res, user, newsId) => {
    try {
        const { text } = req;
        const news = await newsModel.findById(newsId);
        if (!news) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.NOT_FOUND,
                { keyword: "NEWS_NOT_FOUND", components: [] }
            );
        }
        const addedComment = new commentModel({
            news: newsId,
            user: user._id,
            text
        })
        const News = await newsModel.findByIdAndUpdate(newsId,{ $inc: { commentCount: 1 } },{ new: true } )
        await addedComment.save();

        helper.sendApiResponse(
            req,
            res,
            statusCode.SUCCESS,
            { keyword: "COMMENT_ADDED", components: [] },
            addedComment
        );
    } catch (error) {
        console.error("Create news error:", error);
        helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
};

export default {addComment}