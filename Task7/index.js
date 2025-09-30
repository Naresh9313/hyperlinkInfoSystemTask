import express from 'express'
import mongoose  from 'mongoose'
import GLOBALS from './config/constant.js';
import bodyParser from 'body-parser';
import authRoutes from "./modules/v1/auth/routes/authRoutes.js"
import dishRoutes from "./modules/v1/dish/routes/dishRoutes.js"
import cartRoutes from "./modules/v1/cart/routes/cartRoutes.js"
import orderRoutes from "./modules/v1/order/routes/orderRoutes.js"


// import orderRoutes from "./modules/v1/order/routes/orderRoutes.js"
import dotenv from 'dotenv';

dotenv.config();

const app=express();

app.use(express.json())
app.use(express.text())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extends:true}))



app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/dish",dishRoutes);
app.use("/api/v1/cart",cartRoutes);
app.use("/api/v1/order",orderRoutes);






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
