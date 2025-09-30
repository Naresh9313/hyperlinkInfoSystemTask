import bcrypt from "bcryptjs";
import statusCode from "../../../../config/statusCode.js";
import helper from "../../../../middleware/headerVerification.js";
import userModel from "../../../../database/models/userModel.js";
import GLOBALS from "../../../../config/constant.js";
import jwt from "jsonwebtoken";
const signup = async (req, res) => {
  try {
    const { username, email, mobileNo, password, role, deviceInfo } = req;
    const { deviceType, os, browser, ipAddress } = deviceInfo || {};

    const existUser = await userModel.findOne({
      $or: [{ email }, { mobileNo }],
    });
    if (existUser) {
      return helper.sendApiResponse(req, res, statusCode.DUPLICATED_VALUE, {
        keyword: "EMAIL_PHONE_ALREADY_EXIST",
        components: [],
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      mobileNo,
      password: hashedPassword,
      role,
      loginStatus: "offline",
      status: "active",
      isDeleted: false,
      deviceInfo: {
        deviceType,
        os,
        browser,
        ipAddress,
      },
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
    console.error("Signup error:", error);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, mobileNo, password } = req;

    const user = await userModel.findOne({
      $or: [{ email }, { mobileNo }],
    });

    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "USER_NOT_FOUND",
        components: [],
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return helper.sendApiResponse(req, res, statusCode.UNAUTHORIZED, {
        keyword: "INVALID_CREDENTIALS",
        components: [],
      });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      GLOBALS.JWT_SECRET,
      { expiresIn: GLOBALS.JWT_EXPIRES_IN }
    );

    user.loginStatus = "online";
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "LOGIN_SUCCESS", components: [] },
      { user: userResponse, token }
    );
  } catch (error) {
    console.error("login errror", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const logout = async (req, res, user) => {
  try {
    const { userId } = user;

    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "USER_NOT_FOUND",
        components: [],
      });
    }
    existingUser.loginStatus = "offline";
    await existingUser.save();

    helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "LOGOUT_SUCCESS",
      components: [],
    });
  } catch (error) {
    console.error("logout error", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const getProfile = async (req, res, user) => {
  try {
    const { userId } = user;
    const existingUser = await userModel.findById(userId).select("-password");
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
export default { signup, login, logout, getProfile };
