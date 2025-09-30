import express from 'express'
import mongoose  from 'mongoose'
import GLOBALS from './config/constant.js';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import userRoute from "./modules/v1/auth/routes/userRoutes.js"
import newsRoute from "./modules/v1/news/routes/newRoutes.js"
import commentRoute from "./modules/v1/comment/routes/commentRoutes.js"
import dotenv from 'dotenv';
import authenticateDocument from "./middleware/passwordAuth.js"
import fs from "fs";
import swaggerUI from 'swagger-ui-express'; 

dotenv.config();

const app=express();

app.use(express.json())
app.use(express.text())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extends:true}))




//swagger documentation
let swaggerDocument;
try {
    const fileData = fs.readFileSync('./document/v1/swagger_doc.json', 'utf-8');
    swaggerDocument = JSON.parse(fileData);
} catch (err) {
    console.error('Error reading or parsing swagger_doc.json:', err);
    process.exit(1);
}

app.use(
    '/api-docs-v1',
    authenticateDocument.authenticateDoc,
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument)
);


//api routes
app.use("/api/v1/user",userRoute)
app.use("/api/v1/news",newsRoute)
app.use("/api/v1/news",commentRoute)


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
