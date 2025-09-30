import statusCode from "../../../../config/statusCode.js";
import helper from "../../../../middleware/headerVerification.js";
import userModule from "../module/userModule.js";

const addFavourite = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }
    console.log(user);
    
    const userId = user.userId
    helper.decryption(req.body,(decryptedReq)=>{
      userModule.addFavouriteDoctor(userId, decryptedReq, res, req);
    })

    
  } catch (error) {
    console.error("Add Favourite Error", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};


const bookAppointment = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    const userId = user.userId;

    helper.decryption(req.body, (decryptedReq) => {
      if (!decryptedReq) decryptedReq = req.body; 
      userModule.bookAppointment(userId, decryptedReq, res, req);
    });
  } catch (error) {
    console.error("Controller Book Appointment Error", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default { addFavourite,bookAppointment };
