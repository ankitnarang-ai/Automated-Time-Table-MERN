import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()
const app = express()

app.use(cors())

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
import userRouter from './src/router/index'

app.use("/api/v1/users",userRouter)

connectDB().then(()=>{
    app.listen(process.env.PORT || 3000,()=>console.log(`Server Started at port : ${process.env.PORT}`))
})
.catch((err: any)=>{
    console.log("Sevre is not connected")
})

