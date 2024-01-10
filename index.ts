import {  NextFunction, Request,Response } from "express";

import express from 'express';
import dotenv from 'dotenv';
import { db } from "./config/configDb";
import studentRouter from "./routes/studentRoutes";
import bodyParser from 'body-parser';
import subjectRouter from "./routes/subjectRoutes";
import error_exception from "./exception/error_exception";
import chapterRouter from "./routes/chapterRoutes";



dotenv.config();

const app = express();
const port = process.env.PORT;

//  connect to the database;
db();

// middlewares
app.use(bodyParser.json());



app.use('/api/v1',studentRouter);
app.use('/api/v1',subjectRouter);
app.use('/api/v1',chapterRouter);


// error middleware
app.use(error_exception);



// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      error: err.message,
      statusCode: 500,
      message: 'Internal Server Error'
    });
  });

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});