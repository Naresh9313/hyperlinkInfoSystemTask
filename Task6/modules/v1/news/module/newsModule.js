import statusCode from "../../../../config/statusCode.js";
import newsModel from "../../../../database/model/newsModel.js";
import  helper from "../../../../middleware/headerVerification.js"



const addNews = async (req, res) => {
    try {
        const { title, description, category } = req;  

        if (!title || !description) {
            return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
                keyword: "TITLE_AND_DESCRIPTION_REQUIRED",
                components: []
            });
        }

        const news = new newsModel({
            title,
            description,
            category
        });

        await news.save();

        return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
            keyword: "NEWS_ADDED_SUCCESS",
            components: news
        },news);

    } catch (error) {
        console.error("Add News error:", error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
            keyword: "SERVER_ERROR",
            components: []
        });
    }
};


const getNewsList = async (req,res) => {
    try{
        const { search = "", page = 1, limit = 10 } = req.query;

        const filter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const news = await newsModel
            .find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await newsModel.countDocuments(filter);

        const pagination = {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            
        };

        return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
            keyword: "GET_NEWS_FIND",
            components: [], 
            pagination,
        },news);

    }catch(error){
        console.error("get news list error:", error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
            keyword: "SERVER_ERROR",
            components: []
        });
    }
}


const getSingleNews = async (req, res) => {
    try {
        const { newsId } = req.query;

        if (!newsId) {
            return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
                keyword: "NEWS_ID_REQUIRED",
                components: []
            });
        }

        const news = await newsModel.findById(newsId);

        if (!news) {
            return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
                keyword: "NEWS_NOT_FOUND",
                components: []
            });
        }

        return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
            keyword: "SINGLE_NEWS_FETCHED",
            components: news
        },news);

    } catch (error) {
        console.error("Get Single News error:", error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
            keyword: "SERVER_ERROR",
            components: []
        });
    }
};




// const likeDislike = async (req, res, user, newsId) => {
//     try {
//         const news = await newsModel.findById(newsId);

//         if (!news) {
//             return helper.sendApiResponse(
//                 req,
//                 res,
//                 statusCode.NOT_FOUND,
//                 { keyword: "NEWS_NOT_FOUND", components: [] }
//             );
//         }

//         const alreadyLiked = news.likes.includes(user.id);

//         if (alreadyLiked) {
//             news.likes = news.likes.filter(
//                 (uid) => uid.toString() !== user.id.toString()
//             );
//             news.likesCount = Math.max(0,news.likesCount - 1)
//         } else {
//             news.likes.push(user.id);
//             news.likesCount = (news.likesCount || 0) + 1;
//         }

//         await news.save();

//         return helper.sendApiResponse(
//             req,
//             res,
//             statusCode.SUCCESS,
//             { keyword: alreadyLiked ? "NEWS_DISLIKED" : "NEWS_LIKED", components: [] },
//             { likesCount: news.likes.length }
//         );

//     } catch (error) {
//         console.error("Like/Dislike error:", error);
//         return helper.sendApiResponse(
//             req,
//             res,
//             statusCode.INTERNAL_ERROR,
//             { keyword: "SERVER_ERROR", components: [] }
//         );
//     }
// };


const likeDislike = async (req, res, user, newsId) => {
    try {
        const news = await newsModel.findById(newsId);

        if (!news) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.NOT_FOUND,
                { keyword: "NEWS_NOT_FOUND", components: [] }
            );
        }

        const alreadyLiked = news.likes.includes(user.id);

        if (alreadyLiked) {
            news.likes = news.likes.filter(
                (uid) => uid && uid.toString() !== user.id.toString()
            );
            news.likesCount = Math.max(0, (news.likesCount || 0) - 1);
        } else {
            news.likes.push(user.id);
            news.likesCount = (news.likesCount || 0) + 1;
        }

        await news.save();

        return helper.sendApiResponse(
            req,
            res,
            statusCode.SUCCESS,
            { keyword: alreadyLiked ? "NEWS_DISLIKED" : "NEWS_LIKED", components: [] },
            { likesCount: news.likes.length }
        );

    } catch (error) {
        console.error("Like/Dislike error:", error);
        return helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
};

export default {
    addNews,
    getNewsList,
    getSingleNews,
    likeDislike
}