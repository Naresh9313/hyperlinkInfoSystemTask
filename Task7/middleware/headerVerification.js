import CryptLib from "cryptlib"
import localizify from "localizify"
import CryptoJS from "crypto-js"
import jwt from 'jsonwebtoken'
import GLOBALS from "../config/constant.js";
import english from "../languages/en.js";
import Validator from 'validatorjs';


const { default: local } = localizify;
const { t } = localizify;

var shaKey = CryptLib.getHashSha256(GLOBALS.KEY, 32);
var bypassMethod = ['signup', 'login', 'forgot-pin'];
const bypassHeaderKey = [];


// const checkValidationRules = (request, rules) => {
//     try {
//         const v = Validator.make(request, rules);
//         const validator = {
//             status: true,
//         };
//         if (v.fails()) {
//             const ValidatorErrors = v.getErrors();
//             validator.status = false;
//             for (const key in ValidatorErrors) {
//                 validator.error = ValidatorErrors[key][0];
//                 break;
//             }
//         }
//         return validator;
//     } catch (error) {
//         console.error(error.message);
//     }
//     return false;
// }

const checkValidationRules = (request, rules) => {
    try {
        const v = new Validator(request, rules);  // Use "new" instead of "Validator.make"
        const validator = { status: true };

        if (v.fails()) {
            const ValidatorErrors = v.errors.all();  // getErrors() is not part of Validatorjs API
            validator.status = false;

            for (const key in ValidatorErrors) {
                validator.error = ValidatorErrors[key][0];  // Capture first error message
                break;
            }
        }

        return validator;
    } catch (error) {
        console.error(error.message);
    }

    return false;
};



const getMessage = (requestLanguage, keywords, components, callback) => {
    try {
        local.add("english", english).setLocale("english");
        var returnMessage = t(keywords, components)
        callback(returnMessage)
    } catch (error) {
        console.log(error.message);
    }
}

const sendResponse = (req, res, statusCode, responseMessage, responseData = null) => {
    try {
        let formedMsg
        getMessage(req.lang, responseMessage.keyword, responseMessage.components, (msg) => {
            formedMsg = msg
        });
        let responsePayload = {
            message: formedMsg
        };

        if (responseData !== null) {
            responsePayload.data = responseData;
        }

        return res.status(statusCode).json(responsePayload);
    }
    catch (error) {
        console.log(error.message)
    }
}


const sendApiResponse = (req, res, statusCode, responseMessage, responseData = null) => {
    try {
        let formedMsg
        getMessage(req.lang, responseMessage.keyword, responseMessage.components, (msg) => {
            formedMsg = msg
        });
        let responsePayload = {
            message: formedMsg
        };

        if (responseData !== null) {
            responsePayload.data = responseData;
        }

        encryption(responsePayload, (response) => {
            return res.status(statusCode).send(response);
        })

    } catch (error) {
        console.error(error);

    }
}



const encryption = (req, callback) => {
    try {
        var response;
        shaKey = CryptLib.getHashSha256(GLOBALS.KEY, 32);
        response = CryptLib.encrypt(
            JSON.stringify(req, (_, v) => (typeof v === 'bigint' ? parseInt(v) : v)),
            shaKey,
            GLOBALS.IV
        )
        callback(response.toString());

    } catch (error) {
        console.log('Encryption Error', error.message);
        callback({});
    }
}

const decryption = (req, callback) => {
    try {
        let request;
        if (req != undefined && Object.keys(req).length != 0) {
            request = JSON.parse(CryptLib.decrypt(req, shaKey, GLOBALS.IV));
            callback(request);
        } else {
            callback({});
        }
    } catch (error) {
        console.log('Decryption error:- ', error.message);
        callback({});
    }
};

const extrectHeaderlang = (req, res, callback) => {
    var language =
        req.headers['accept-language'] != undefined && req.headers['accept-language'] != ''
            ? req.headers['accept-language']
            : 'en';
    req.lang = language;
    if (language == 'en') {
        req.language = en;
        local.add(language, en).setLocale('en');
    }
    callback();
}

export const validateHeaderToken = (authHeader) => {
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        // Extract encrypted token
        const encryptedToken = authHeader.split(" ")[1];

        // Decrypt token
        // const decryptedToken = CryptLib.decrypt(encryptedToken, shaKey, GLOBALS.IV).replace(/\s/g, '');

        // Verify token
        const verifiedToken = jwt.verify(encryptedToken, GLOBALS.JWT_SECRET);

        return verifiedToken; // { userId, email, ... }
    } catch (error) {
        console.error("Token validation error:", error.message);
        return null;
    }
};


const encString = data => {
    try {
        const encryptedData = CryptLib.encrypt(JSON.stringify(data), shaKey, process.env.IV);
        return encryptedData;
    } catch (error) {
        console.log('Enc string error--', error.message);
        return {};
    }
};

const decString = (data) => {
    try {
        if (!data) return null;
        return CryptLib.decrypt(data, shaKey, GLOBALS.IV);
    } catch (err1) {
        try {
            let normalized = String(data).trim();
            try { normalized = decodeURIComponent(normalized); } catch (_) { }
            normalized = normalized.replace(/ /g, '+').replace(/-/g, '+').replace(/_/g, '/');
            const pad = normalized.length % 4;
            if (pad) normalized += '='.repeat(4 - pad);
            return CryptLib.decrypt(normalized, shaKey, GLOBALS.IV);
        } catch (err2) {
            console.log("dec string error--", err2.message);
            return null;
        }
    }
};


export default {
    checkValidationRules, sendResponse, sendApiResponse, getMessage, encryption, decryption, validateHeaderToken, encString, decString
}








