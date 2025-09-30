import newsModule from "../module/newsModule.js";
import helper from "../../../../middleware/headerVerification.js"
import validaterules from "../../validationRules.js"
import statusCode from "../../../../config/statusCode.js";

const addNews = async(req,res) => {
    try{
        const authHeader = req.headers["authorization"];
        const user = helper.validateHeaderToken(authHeader); 
        if (!user) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.UNAUTHORIZED,
                { keyword: "TOKEN_INVALID", components: [] }
            );
        }
        helper.decryption(req.body, (req) => {

            const validate = helper.checkValidationRules(req, validaterules.signupValidation)
            
            if (validate) {
                newsModule.addNews(req, res)
            } else {
                helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "VALIDATION_ERROR", components: [] });
            }
        })
    }catch(error){

    }
}


const getNewsList = (req,res) => {
    try{
        const authHeader = req.headers["authorization"];
        const user = helper.validateHeaderToken(authHeader); 
        if (!user) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.UNAUTHORIZED,
                { keyword: "TOKEN_INVALID", components: [] }
            );
        }
        newsModule.getNewsList(req,res,user)
        
    }catch(error){
        console.error('getNewsList error:', error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });

    }
}


const getSingleNews = (req,res) => {
    try{
        const authHeader = req.headers["authorization"];
        const user = helper.validateHeaderToken(authHeader); 
        if (!user) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.UNAUTHORIZED,
                { keyword: "TOKEN_INVALID", components: [] }
            );
        }
        newsModule.getSingleNews(req,res,user)
        
    }catch(error){
        console.error('getSingleNews error:', error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });

    }
}

const likeDislike = (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const user = helper.validateHeaderToken(authHeader);

        if (!user) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.UNAUTHORIZED,
                { keyword: "TOKEN_INVALID", components: [] }
            );
        }

        let { newsId } = req.query;

        if (!newsId) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.NOT_FOUND,
                { keyword: "NEWS_ID_NOT_PROVIDED", components: [] }
            );
        }

        // decrypt news id
        // newsId = helper.decString(newsId);

        newsModule.likeDislike(req, res, user, newsId);

    } catch (error) {
        console.error("Like/Dislike middleware error:", error);
        helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
};


export default{addNews,getNewsList,getSingleNews,likeDislike}
    
