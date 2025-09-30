import statusCode from "../../../../config/statusCode.js";
import bcrypt from "bcrypt"
import helper from "../../../../middleware/headerVerification.js"
import userModel from "../../../../database/model/userModel.js"
import GLOBALS from "../../../../config/constant.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import cityModel from "../../../../database/model/cityModel.js";
import categoryModel from "../../../../database/model/categoryModel.js";
import Country from "../../../../database/model/countryModel.js";
import State from "../../../../database/model/stateModel.js";
import City from "../../../../database/model/cityModel.js";

//signup
const signup = async (req, res) => {
    try {
        const { username, email, mobileNo, password, role, deviceInfo } = req;
        const { deviceType, os, browser, ipAddress } = deviceInfo || {};

        // Check if user already exists
        const existUser = await userModel.findOne({ $or: [{ email }, { mobileNo }] });
        if (existUser) {
            return helper.sendApiResponse(req, res, statusCode.DUPLICATED_VALUE, { keyword: "EMAIL_PHONE_ALREADY_EXIST", components: [] });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
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
                ipAddress
            }
        });

        const savedUser = await newUser.save();

        const userResponse = savedUser.toObject();
        delete userResponse.password;

        return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "USER_CREATED", components: [] }, userResponse);

    } catch (error) {
        console.error("Signup error:", error);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
    }
};


//login
const login = async (req, res) => {
    try {

        const { email, mobileNo, password } = req

        //find user email or mobile number
        const user = await userModel.findOne({
            $or: [{ email }, { mobileNo }]
        })


        if (!user) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.NOT_FOUND,
                { keyword: "USER_NOT_FOUND", components: [] }
            )
        }


        //compare password

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.UNAUTHORIZED,
                { keyword: "INVALID_CREDENTIALS", components: [] }
            )
        }
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            GLOBALS.JWT_SECRET,
            { expiresIn: GLOBALS.JWT_EXPIRES_IN }
        );

        // Update login status
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
        helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
    }
}


//logout
const logout = async (req,res,user) => {
    try{

        //coming from JWT Payload
        const {userId}= user; 

        //existing user
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.NOT_FOUND,
                { keyword: "USER_NOT_FOUND", components: [] }
            );
        }
        existingUser.loginStatus = "offline";
        await existingUser.save();

        helper.sendApiResponse(
            req,
            res,
            statusCode.SUCCESS,
            { keyword: "LOGOUT_SUCCESS", components: [] }
        );

    }catch(error){
        console.error("logout error",error);
        helper.sendApiResponse(req,res,statusCode.INTERNAL_SERVER_ERROR,{keyword:"SERVER_ERROR",components:[]});
    }

}


//getProfile
const getProfile = async (req,res,user) => {
    try{
        const {userId} = user;
        const existingUser = await userModel.findById(userId).select("-password");
        if (!existingUser) {
            return helper.sendApiResponse(
                req,
                res,
                statusCode.NOT_FOUND,
                { keyword: "USER_NOT_FOUND", components: [] }
            );
        }

        helper.sendApiResponse(
            req,
            res,
            statusCode.SUCCESS,
            { keyword: "PROFILE_FETCHED", components: [] },
            existingUser
        );

    }catch(error){
        console.error("logout error",error);
        helper.sendApiResponse(req,res,statusCode.INTERNAL_SERVER_ERROR,{keyword:"SERVER_ERROR",components:[]});
    }
}


const profileUpdate = async (req, res, user) => {
    try {
        const {
           username,
           email,
           mobileNo,
           role
        } = req;

        const { userId } = user;

        const existingUser = await userModel.findByIdAndUpdate(userId, {
        username,
        email,
        mobileNo,
        role,
        }, { new: true, runValidators: true }).select("-password");

        if (existingUser) {
            helper.sendApiResponse(
                req,
                res,
                statusCode.SUCCESS,
                { keyword: "PROFILE_UPDATED", components: [] },
                existingUser
            )
        } else {
            helper.sendApiResponse(
                req,
                res,
                statusCode.NOT_FOUND,
                { keyword: "USER_NOT_FOUND", components: [] }
            )
        }

    } catch (error) {
        console.error("updateProfile error:", error);
        helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
}



//forgotPassword

const forgotPassword = async (req, res) => {
    try {
        const { email } = req;
        
        const user = await userModel.findOne({ email });
        if (!user) {
            return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "EMAIL_NOT_FOUND", components: [] });
        }

        // Generate a secure token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS   
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: `You requested a password reset.\n\n
            Token: ${token}\n\n
            This token is valid for 1 hour.\n\n
            Use it to reset your password securely.`
        };

        await transporter.sendMail(mailOptions);

        return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "RESET_TOKEN_SENT", components: [] });

    } catch (error) {
        console.error('Forgot password module error:', error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
    }
};


//reset password 
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req;

        // Find user by token and ensure token is not expired
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "INVALID_OR_EXPIRED_TOKEN", components: [] });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and remove reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "PASSWORD_RESET_SUCCESS", components: [] });

    } catch (error) {
        console.error('Reset password module error:', error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
    }
};





//setUserCity
const setUserCity = async (req, res, user) => {
    try {
        const { countryId, stateId, cityId } = req;

        const country = await Country.findById(countryId);
        const state = await State.findById(stateId);
        const city = await City.findById(cityId);

        if (!country || !state || !city) {
            return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "INVALID_LOCATION", components: [] });
        }

     
        if (String(state.country) !== String(country._id)) {
            return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, { keyword: "STATE_NOT_IN_COUNTRY", components: [] });
        }

        if (String(city.state) !== String(state._id)) {
            console.error('CITY_NOT_IN_STATE:', { cityState: city.state.toString(), stateId: state._id.toString() });
            return helper.sendApiResponse(req, res, statusCode.BAD_REQUEST, { keyword: "CITY_NOT_IN_STATE", components: [] });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user.userId,
            { country: country._id, state: state._id, city: city._id },
            { new: true }
        )
        .populate("country", "name code")
        .populate("state", "name")
        .populate("city", "name")
        .lean();

        if (!updatedUser) {
            return helper.sendApiResponse(req, res, statusCode.NOT_FOUND, { keyword: "USER_NOT_FOUND", components: [] });
        }

        return helper.sendApiResponse(req, res, statusCode.SUCCESS, { keyword: "LOCATION_UPDATED", components: [] }, updatedUser);

    } catch (error) {
        console.error("SetUserCity error:", error);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_ERROR, { keyword: "SERVER_ERROR", components: [] });
    }
};




const getCities = async (req, res, user, stateIds, cityIds) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};
        if (stateIds && stateIds.length > 0) {
            query.state = { $in: stateIds };
        }
        if (cityIds && cityIds.length > 0) {
            query._id = { $in: cityIds };
        }

        const total = await City.countDocuments(query);

        const cities = await City.find(query)
            .sort({ name: 1 }) 
            .skip(skip)
            .limit(limit)
            .populate("state", "name")
            .lean();

        return helper.sendApiResponse(
            req,
            res,
            statusCode.SUCCESS,
            { keyword: "CITIES_FETCHED", components: [] },
            {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                cities
            }
        );

    } catch (error) {
        console.error("Get cities error:", error);
        return helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
};
//getCategories
 const getCategories = async (req, res) => {
    try {
      const categories = await categoryModel.find({});
  
      return helper.sendApiResponse(req, res, statusCode.SUCCESS, {
        keyword: "GET_CATEGORY_FIND",
        components: [],
      },
      categories);
    } catch (error) {
      console.error("Get Categories error:", error.message);
      return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, {
        keyword: "SERVER_ERROR",
        components: [],
      });
    }
  };



  

export default {
    signup,
    login,
    logout,
    getProfile,
    profileUpdate,
    forgotPassword,
    resetPassword,
    getCities,
    getCategories,
    setUserCity
}