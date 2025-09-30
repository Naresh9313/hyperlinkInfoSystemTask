import statusCode from "../../../../config/statusCode.js";
import helper from "../../../../middleware/headerVerification.js"
import userModule from "../module/userModule.js";
import validaterules from "../../validationRules.js"

const signup = (req, res) => {


    helper.decryption(req.body, (req) => {

        const validate = helper.checkValidationRules(req, validaterules.signupValidation)
        
        if (validate) {
            userModule.signup(req, res)
        } else {
            helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "VALIDATION_ERROR", components: [] });
        }
    })

}

const login = (req,res)=>{

    helper.decryption(req.body, (req) => {

        const validate = helper.checkValidationRules(req, validaterules.loginValidation)

        if (validate) {
            userModule.login(req, res)
        } else {
            helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "VALIDATION_ERROR", components: [] });
        }
    })
}


const logout = (req,res) => {
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

        userModule.logout(req, res, user);
    }catch(error){
        console.error('logout error!',error.message);

    }
}

const getProfile = (req,res) => {
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
        userModule.getProfile(req,res,user)
    }catch(error){

    }
}

// const updateProfile = (req, res) => {
//     try {
//         const authHeader = req.headers["authorization"];
//         const user = helper.validateHeaderToken(authHeader);

//         if (!user) {
//             return helper.sendApiResponse(
//                 req,
//                 res,
//                 statusCode.UNAUTHORIZED,
//                 { keyword: "TOKEN_INVALID", components: [] }
//             );
//         }

//         // Call the module function with req, res, and authenticated user info
//         userModule.updateProfile(req, res, user);

//     } catch (error) {
//         console.error("Update profile controller error:", error.message);
//         return helper.sendApiResponse(
//             req,
//             res,
//             statusCode.INTERNAL_SERVER_ERROR,
//             { keyword: "SERVER_ERROR", components: [] }
//         );
//     }
// };


const profileUpdate = (req,res)=>{
    const authHeader = req.headers["authorization"];
    const user = helper.validateHeaderToken(authHeader);
    if (!user) {
        return helper.sendApiResponse(
            req,
            res,
            statusCode.UNAUTHORIZED,
            { keyword: "rest_keywords_token_not_found", components: [] }
        );
    }

    const data = req.body;

    
    helper.decryption(data,(req)=>{
        
        const validate = helper.checkValidationRules(req,validaterules.profileUpdateValidation);
        if (validate) {
            userModule.profileUpdate(req,res,user)
        } else {
            helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "VALIDATION_ERROR", components: [] });
        }
    })
}


const forgotPassword = (req, res) => {
    try {
        helper.decryption(req.body,(req)=>{
        
            const validate = helper.checkValidationRules(req,validaterules.profileUpdateValidation);
            if (validate) {
                userModule.forgotPassword(req, res);
            } else {
                helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "VALIDATION_ERROR", components: [] });
            }
        })
    } catch (error) {
        console.error('Forgot password controller error:', error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
    }
};

//resetPassword
const resetPassword = (req, res) => {
    try {
        helper.decryption(req.body, (req) => {

            // Validate input (token & newPassword)
            const validate = helper.checkValidationRules(req, validaterules.resetPasswordValidation);
            if (validate) {
                userModule.resetPassword(req, res);
            } else {
                helper.sendApiResponse(req, res, statusCode.VALIDATION_ERROR, { keyword: "VALIDATION_ERROR", components: [] });
            }

        });
    } catch (error) {
        console.error('Reset password controller error:', error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });
    }
};

//setUserCity
export const setUserCity = (req, res) => {
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
        const validate = helper.checkValidationRules(
            req,
            validaterules.setUserCityValidation
        );

        if (validate) {
            userModule.setUserCity(req, res, user);
        } else {
            helper.sendApiResponse(
                req,
                res,
                statusCode.VALIDATION_ERROR,
                { keyword: "VALIDATION_ERROR", components: [] }
            );
        }
    });
}; 


export const getCities = (req, res) => {
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

        let stateIds = null;
        if (req.query.state) {
            const decryptedStates = helper.decString(req.query.state);
            if (decryptedStates) {
                stateIds = decryptedStates.split(",");
            }
        }

        let cityIds = null;
        if (req.query.city) {
            const decryptedCities = helper.decString(req.query.city);
            if (decryptedCities) {
                cityIds = decryptedCities.split(",");
            }
        }

        userModule.getCities(req, res, user, stateIds, cityIds);

    } catch (error) {
        console.error("Get cities middleware error:", error);
        helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
};

//getCategories
const getCategories = (req,res) => {
    try{
        // const authHeader = req.headers["authorization"];
        // const user = helper.validateHeaderToken(authHeader); 
        // if (!user) {
        //     return helper.sendApiResponse(
        //         req,
        //         res,
        //         statusCode.UNAUTHORIZED,
        //         { keyword: "TOKEN_INVALID", components: [] }
        //     );
        // }
        userModule.getCategories(req,res)
    }catch(error){
        console.error('getCategories error:', error.message);
        return helper.sendApiResponse(req, res, statusCode.INTERNAL_SERVER_ERROR, { keyword: "SERVER_ERROR", components: [] });

    }
}






export default{
    signup,
    login,
    logout,
    getProfile,
    profileUpdate,
    forgotPassword,
    resetPassword,
    setUserCity,
    getCities,
    getCategories
}