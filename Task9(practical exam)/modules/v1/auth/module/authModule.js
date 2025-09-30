import statusCode from "../../../../config/statusCode.js";
import User from "../../../../database/models/userModel.js";
import bcrypt from "bcrypt";
import helper from "../../../../middleware/headerVerification.js";
import english from "../../../../languages/en.js";
import Gloabals from "../../../../config/constant.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, loginType, social_id } =req;

    if (!["n", "g"].includes(loginType || "n")) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "INVALID_LOGIN_TYPE",
        components: [],
      });
    }

    let user;
    if (loginType === "g") {
      user = await User.findOne({ $or: [{ email }, { social_id }] });
    } else {
      user = await User.findOne({ email });
    }

    if (user) {
      return helper.sendApiResponse(req, res, statusCode.DUPLICATE_VALUE, {
        keyword: "USER_ALREADY_EXIST",
        components: [],
      });
    }

    if (loginType === "g") {
      if (!social_id) {
        return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
          keyword: "SOCIAL_ID_REQUIRED",
          components: [],
        });
      }

      const newUser = new User({
        fullName,
        email,
        mobileNumber: mobileNumber || "",
        password: "",
        loginType: "g",
        social_id,
        loginStatus: "offline",
        status: "active",
      });

      const savedUser = await newUser.save();
      const userResponse = savedUser.toObject();
      delete userResponse.password;

      return helper.sendApiResponse(
        req,
        res,
        statusCode.SUCCESS,
        { keyword: "USER_CREATED_GOOGLE", components: [] },
        userResponse
      );
    }

    const nameRegex = /^[A-Za-z ]+$/;
    if (
      !fullName ||
      !nameRegex.test(fullName) ||
      fullName.length < 3 ||
      fullName.length > 50
    ) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "INVALID_FULLNAME",
        components: [],
      });
    }

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "INVALID_MOBILE_NUMBER",
        components: [],
      });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "INVALID_EMAIL",
        components: [],
      });
    }

    if (!password || password.length < 6 || password.length > 20) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "INVALID_PASSWORD",
        components: [],
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
      loginType: "n",
      loginStatus: "offline",
      status: "active",
    });

    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "USER_CREATED", components: [] },
      userResponse
    );
  } catch (error) {
    console.log("Signup Error:", error);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password, loginType, social_id } = req;

    if (!["n", "g"].includes(loginType || "n")) {
      return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
        keyword: "INVALID_LOGIN_TYPE",
        components: [],
      });
    }

    let user;
    if (loginType === "g") {
      if (!email || !social_id) {
        return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
          keyword: "EMAIL_AND_SOCIAL_ID_REQUIRED",
          components: [],
        });
      }

      user = await User.findOne({ email, social_id });
      if (!user) {
        return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
          keyword: "USER_NOT_FOUND",
          components: [],
        });
      }
    } else {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
          keyword: "INVALID_EMAIL",
          components: [],
        });
      }

      if (!password || password.length < 6 || password.length > 20) {
        return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, {
          keyword: "MIN_6_DIGIT",
          components: [],
        });
      }

      user = await User.findOne({ email });
      if (!user) {
        return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
          keyword: "USER_NOT_FOUND",
          components: [],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
          keyword: "INVALID_PASSWORD",
          components: [],
        });
      }
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      Gloabals.JWT_SECRET,
      { expiresIn: Gloabals.JWT_EXPIRES_IN }
    );

    user.loginStatus = "online";
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "LOGIN_SUCCESS", components: [] },
      { user: userResponse, token }
    );
  } catch (error) {
    console.log("ERROR", error);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};


const getProfile = async (req, res, user) => {
  try {
    const { userId } = user;
    const existingUser = await User.findById(userId).select("-password");
    if (!existingUser) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "USER_NOT_FOUND",
        components: [],
      });
    }

    helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "PROFILE_FETCHED", components: [] },
      existingUser
    );
  } catch (error) {
    console.error("logout error", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default { signup, login, getProfile };
