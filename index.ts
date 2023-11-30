import {  Request,Response } from "express";

import express from 'express';
import dotenv from 'dotenv';
import { db } from "./config/configDb";
import studentRouter from "./routes/studentRoutes";
import bodyParser from 'body-parser';
import subjectRouter from "./routes/subjectRoutes";


dotenv.config();

const app = express();
const port = process.env.PORT;

//  connect to the database;
db();

// middlewares
app.use(bodyParser.json());


app.use('/api/v1',studentRouter);
app.use('/api/v1',subjectRouter);

app.get('/',(req:Request,res:Response)=>{
        res.send("hello world ");
})


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});