import GLOBALS from "../../../../config/constant.js";
import statusCode from "../../../../config/statusCode.js";
import addressModel from "../../../../database/models/addressModel.js";
import userModel from "../../../../database/models/userModel.js";
import helper from "../../../../middleware/headerVerification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import twilio from "twilio";

//signup
const signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, rePassword, role } = req;

    const user = await userModel.findOne({ email });
    if (user) {
      return helper.sendApiResponse(req, res, statusCode.DUPLICATED_VALUE, {
        keyword: "EMAIL_ALREADY_EXIST",
        components: [],
      });
    }

    if (password !== rePassword) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "PASSWORDS_DO_NOT_MATCH",
        components: [],
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      loginStatus: "offline",
      status: "active",
      isDeleted: false,
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
    console.log("Signup error:", error.message);

    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "INTERNAL_SERVER_ERROR",
      components: [],
    });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req;

    const user = await userModel.findOne({ email });

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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      GLOBALS.JWT_SECRET,
      { expiresIn: GLOBALS.JWT_EXPIRES_IN }
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
    console.error("Login error:", error.message);

    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

//setAddress
const setAddress = async (req, res, user) => {
  try {
    const { country, state, city, street, pincode } = req;

    const setAddres = new addressModel({
      user: user.userId,
      country,
      state,
      city,
      street,
      pincode,
    });

    await setAddres.save();
    const updateAddress = userModel.findByIdAndUpdate(user.id, {
      $push: { addresses: setAddres._id },
    });

    const addressResponse = setAddres.toObject();
    return helper.sendApiResponse(
      req,
      res,
      statusCode.SUCCESS,
      { keyword: "SET_ADDRESS_SUCCESSFULLY", components: [] },
      addressResponse
    );
  } catch (error) {
    console.error("setAddress error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

//logout
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

//getProfile
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

//updateProfile

const profileUpdate = async (req, res, user) => {
  try {
    const { name, email, phoneNumber } = req;

    const { userId } = user;

    const existingUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          name,
          email,
          phoneNumber,
        },
        { new: true, runValidators: true }
      )
      .select("-password");

    if (existingUser) {
      helper.sendApiResponse(
        req,
        res,
        statusCode.SUCCESS,
        { keyword: "PROFILE_UPDATED", components: [] },
        existingUser
      );
    } else {
      helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "USER_NOT_FOUND",
        components: [],
      });
    }
  } catch (error) {
    console.error("updateProfile error:", error);
    helper.sendApiResponse(req, res, statusCode.INTERNAL_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

//otp-validation
const forgotPassword = async (req, res) => {
  try {
    const { email } = req;

    const user = await userModel.findOne({ email });
    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "EMAIL_NOT_FOUND",
        components: [],
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordToken = otp.toString();
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "OTP_SENT",
      components: [],
    });
  } catch (error) {
    console.error("Forgot password module error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req;

    const user = await userModel.findOne({ email });
    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "EMAIL_NOT_FOUND",
        components: [],
      });
    }

    if (
      user.resetPasswordToken !== otp.toString() ||
      Date.now() > user.resetPasswordExpires
    ) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "INVALID_OR_EXPIRED_OTP",
        components: [],
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "PASSWORD_RESET_SUCCESS",
      components: [],
    });
  } catch (error) {
    console.error("Reset password module error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const forgotPassword1 = async (req, res) => {
  try {
    const { phoneNumber } = req;

    if (!phoneNumber) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "PHONE_NUMBER_REQUIRED",
        components: [],
      });
    }

    const user = await userModel.findOne({ phoneNumber });
    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "PHONE_NUMBER_NOT_FOUND",
        components: [],
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await client.messages.create({
      body: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(process.env.TWILIO_ACCOUNT_SID)
    console.log(process.env.TWILIO_AUTH_TOKEN)
    console.log( process.env.TWILIO_PHONE_NUMBER)
    console.log(phoneNumber)

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "OTP_SENT",
      components: [],
    });
  } catch (error) {
    console.error("Forgot password module error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

const resetPassword1 = async (req, res) => {
  try {
    const { phoneNumber, otp, newPassword } = req;

    const user = await userModel.findOne({ phoneNumber });
    if (!user) {
      return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, {
        keyword: "PHONENUMBER_NOT_FOUND",
        components: [],
      });
    }

    if (
      user.resetPasswordToken !== otp.toString() ||
      Date.now() > user.resetPasswordExpires
    ) {
      return helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, {
        keyword: "INVALID_OR_EXPIRED_OTP",
        components: [],
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
      keyword: "PASSWORD_RESET_SUCCESS",
      components: [],
    });
  } catch (error) {
    console.error("Reset password module error:", error.message);
    return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
      keyword: "SERVER_ERROR",
      components: [],
    });
  }
};

export default {
  signup,
  login,
  setAddress,
  logout,
  getProfile,
  profileUpdate,
  forgotPassword,
  resetPassword,
  forgotPassword1,
  resetPassword1,
};
