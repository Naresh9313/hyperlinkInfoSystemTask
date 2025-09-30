import helper from "../../../../middleware/headerVerification.js";
import statusCode from "../../../../config/statusCode.js";
import validaterules from "../../validationRules.js";
import authModule from "../module/authModule.js";

const signup = (req, res) => {
  helper.decryption(req.body, (req) => {
    const validate = helper.checkValidationRules(
      req,
      validaterules.signupValidation
    );

    if (validate) {
      authModule.signup(req, res);
    } else {
      helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "VALIDATION_ERROR",
        components: [],
      });
    }
  });
};

const login = (req, res) => {
  helper.decryption(req.body, (req) => {
    const validate = helper.checkValidationRules(
      req,
      validaterules.loginValidation
    );

    if (validate) {
      authModule.login(req, res);
    } else {
      helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "VALIDATION_ERROR",
        components: [],
      });
    } 
  });
};

const getProfile = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    authModule.getProfile(req, res, user);
  } catch (error) {
    console.error("getProfile error!", error.message);
  }
};

export default { signup, login, getProfile };
