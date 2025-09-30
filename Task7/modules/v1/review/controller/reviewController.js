import statusCode from "../../../../config/statusCode.js";
import reviewModules from "../modules/reviewModules.js";
import helper from "../../../../middleware/headerVerification.js";

// const addShopReview = async (req, res) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const user = helper.validateHeaderToken(authHeader);
//     if (!user) {
//       return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
//         keyword: "TOKEN_INVALID",
//         components: [],
//       });
//     }

//     helper.decryption(req.body, (decryptedReq, err) => {
//       if (err) {
//         return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
//           keyword: "DECRYPTION_FAILED",
//           components: [],
//         });
//       }

//       reviewModules.addShopReview(req, res, user);
//     });
//   } catch (error) {
//     console.error("addreview controller error:", error.message);
//     return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
//       keyword: "INTERNAL_SERVER_ERROR",
//       components: [],
//     });
//   }
// };


const addShopReview = async (req,res) => {
  try{

  }catch(error){
    return helper.sendApiResponse(re)
  }
}
export default {addShopReview}