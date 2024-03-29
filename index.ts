import {  NextFunction, Request,Response } from "express";
import express from 'express';
import dotenv from 'dotenv';
import { db } from "./config/configDb";
import studentRouter from "./routes/studentRoutes";
import bodyParser from 'body-parser';
import subjectRouter from "./routes/subjectRoutes";
import error_exception from "./exception/error_exception";
import chapterRouter from "./routes/chapterRoutes";
import translationRouter from "./routes/translationRoute";
import swaggerui from 'swagger-ui-express';
import swaggerJSDocs from './config/api.json';



dotenv.config();

const app = express();
const port = process.env.PORT;

// load the yaml file for swagger



//  connect to the database;
db();

// middlewares
app.use('/public',express.static(__dirname+'/public'));

app.use(bodyParser.json({
  limit:'10mb'
}));

app.use(bodyParser.urlencoded({
  limit:'50mb',
  extended:true,

}))
// use express-fielupload middleware for handling file uploads;
// app.use(fileUpload({
//   useTempFiles:true,
//   tempFileDir:'./public',
  
// }));

// swagger route

app.use('/api-docs',swaggerui.serve,swaggerui.setup(swaggerJSDocs));
// app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));

app.use('/api/v1',studentRouter);
app.use('/api/v1',subjectRouter);
app.use('/api/v1',chapterRouter);
app.use('/api/v1',translationRouter);


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