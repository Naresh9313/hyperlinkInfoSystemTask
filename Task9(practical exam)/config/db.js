import mongoose from "mongoose";
import english from "../languages/en.js";
import Globals from "./constant.js";
import statusCode from "./statusCode.js";

const connectDB = async() => {
    try{
        mongoose.connect(Globals.MONGODB_CONN)
        console.log(english.SUCCESS);
    }catch(error){
        console.log(english.ERROR,statusCode.INTERNAL_SERVER_ERROR);
    }
}

export default connectDB;