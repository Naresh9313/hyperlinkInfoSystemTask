import express from 'express'
import mongoose  from 'mongoose'
import GLOBALS from './config/constant.js';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import authRoutes from "./modules/v1/auth/routes/authRoutes.js"
import categoryRoutes from "./modules/v1/category/routes/categoryRoutes.js"
import cartRoutes from "./modules/v1/cart/cartRoutes.js"
import orderRoutes from "./modules/v1/order/orderRoutes.js"
import favouriteRoutes from "./modules/v1/favourite/favouriteRoutes.js"
import dotenv from 'dotenv';

dotenv.config();

const app=express();

app.use(express.json())
app.use(express.text())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extends:true}))



app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/cart",cartRoutes);
app.use("/api/v1/order",orderRoutes);
app.use("/api/v1/favourite",favouriteRoutes);







//database connection & server connection
mongoose.connect(GLOBALS.MONGO_DB)
    .then(() => {
        console.log("Database is connected");

        const server = app.listen(GLOBALS.PORT, () => {
            console.log("Server is running on port", GLOBALS.PORT);
        });

    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
