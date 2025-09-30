import statusCode from "../../../../config/statusCode.js";
import authModule from "../module/authModule.js";
import helper from "../../../../middleware/headerVerification.js";
import validaterules from "../../validationRules.js";

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

// const setAddress = (req, res) => {
//   const authHeader = req.headers["authorization"];
//   const user = helper.validateHeaderToken(authHeader);

//   if (!user) {
//     return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
//       keyword: "TOKEN_INVALID",
//       components: [],
//     });
//   }

//   helper.decryption(req.body, (decryptedReq) => {
//     authModule.setAddress(decryptedReq, res, user);
//   });
// };

const logout = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "TOKEN_INVALID",
        components: [],
      });
    }

    authModule.logout(req, res, user);
  } catch (error) {
    console.error("logout error!", error.message);
  }
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
    console.error("logout error!", error.message);
  }
};

const profileUpdate = (req, res) => {
  const authHeader = req.headers["authorization"];
  const user = helper.validateHeaderToken(authHeader);
  if (!user) {
    return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
      keyword: "rest_keywords_token_not_found",
      components: [],
    });
  }

  const data = req.body;

  helper.decryption(data, (req) => {
    const validate = helper.checkValidationRules(
      req,
      validaterules.profileUpdateValidation
    );
    if (validate) {
      authModule.profileUpdate(req, res, user);
    } else {
      helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "VALIDATION_ERROR",
        components: [],
      });
    }
  });
};

const forgotPassword = (req, res) => {
  try {
    helper.decryption(req.body, (decryptedReq) => {
      const validate = helper.checkValidationRules(decryptedReq);
      if (validate) {
        authModule.forgotPassword(decryptedReq, res);
      } else {
        helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }
    });
  } catch (error) {
    console.error("Forgot password controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const resetPassword = (req, res) => {
  try {
    helper.decryption(req.body, (decryptedReq) => {
      const validate = helper.checkValidationRules(decryptedReq);
      if (validate) {
        authModule.resetPassword(decryptedReq, res);
      } else {
        helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }
    });
  } catch (error) {
    console.error("Reset password controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const forgotPassword1 = (req, res) => {
  try {
    helper.decryption(req.body, (decryptedReq) => {
      const validate = helper.checkValidationRules(decryptedReq);
      if (validate) {
        authModule.forgotPassword1(decryptedReq, res);
      } else {
        helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }
    });
  } catch (error) {
    console.error("Forgot password controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const resetPassword1 = (req, res) => {
  try {
    helper.decryption(req.body, (decryptedReq) => {
      const validate = helper.checkValidationRules(decryptedReq);
      if (validate) {
        authModule.resetPassword1(decryptedReq, res);
      } else {
        helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
          keyword: "VALIDATION_ERROR",
          components: [],
        });
      }
    });
  } catch (error) {
    console.error("Reset password controller error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default {
  signup,
  login,
  // setAddress,
  logout,
  getProfile,
  profileUpdate,
  forgotPassword,
  resetPassword,
  forgotPassword1,
  resetPassword1,
};
