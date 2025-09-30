import commentModules from "../modules/commentModules.js";
import validaterules from "../../validationRules.js"
import statusCode from "../../../../config/statusCode.js";
import helper from "../../../../middleware/headerVerification.js"



const addComment = (req, res) => {
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
                statusCode.VALIDATION_ERROR,
                { keyword: "MISSING_FIELDS", components: [] }
            );
        }
        // newsId = helper.decString(newsId);

        helper.decryption(req.body, (req) => {
            const validate = helper.checkValidationRules(req, validaterules.createCommentValidation);
            if (validate) {
                commentModules.addComment(req,res,user,newsId)
            } else {
                helper.sendApiResponse(
                    req,
                    res,
                    statusCode.VALIDATION_ERROR,
                    { keyword: "VALIDATION_ERROR", components: [] }
                );
            }
        });

    } catch (error) {
        console.error("Add comment middleware error:", error);
        return helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
};



export default{
    addComment
}