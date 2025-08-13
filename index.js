import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"

import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cors from "cors"


dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization")
        if(value != null){ // null nove nm
            const token = value.replace("Bearer ","")
            jwt.verify(
                token,
                process.env.JWT_SECRET,
                (err,decoded)=>{
                    if(decoded == null){
                        res.status(403).json({
                            message : "unauthorized"
                        })
                    }else{
                        req.user = decoded 
                        next()
                    }
                    
                }
            )
        }else{
            next()
        }
        

        
    }
)

const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database Connected")
    }
).catch( 
    ()=>{
        console.log("failed to connect to the database")
    }
)

// suggestions = ctrl + space button
// github repositary create
app.use("/api/users", userRouter)



app.listen(3000,
    ()=>{
        console.log("server started")
    }
)