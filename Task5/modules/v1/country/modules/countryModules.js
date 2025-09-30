import statusCode from "../../../../config/statusCode.js";
import countryModel from "../../../../database/models/countryModel.js";
import helper from "../../../../middleware/headerVerification.js";

const getCountries = async (req, res) => {
    try {
        const countries = await countryModel.find({}, { name: 1, code: 1 }).sort({ name: 1 }).lean();


        return helper.sendApiResponse(
            req,
            res,
            statusCode.SUCCESS,
            { keyword: "COUNTRIES_FETCHED", components: [] },
            countries
        );
    } catch (error) {
        console.error("Get countries error:", error);
        return helper.sendApiResponse(
            req,
            res,
            statusCode.INTERNAL_SERVER_ERROR,
            { keyword: "SERVER_ERROR", components: [] }
        );
    }
};

export default {getCountries}