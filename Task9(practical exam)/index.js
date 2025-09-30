import express from 'express';
import Gloabals from './config/constant.js';
import english from './languages/en.js';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
import authRoutes from "./modules/v1/auth/routes/authRoutes.js"
import categoryRoutes from "./modules/v1/category/routes/categoryRoutes.js"
import userRoutes from "./modules/v1/user/routes/userRoutes.js"

connectDB()
const app= express();

app.use(express.json())
app.use(express.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extends:true}))

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/user",userRoutes)


app.listen(Gloabals.PORT,() => {
    console.log(english.PORT,`${Gloabals.PORT}`)
})
