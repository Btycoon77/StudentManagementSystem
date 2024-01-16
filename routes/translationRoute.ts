import { Router } from "express";
import translationController from "../controller/translationController";

const translationRouter = Router();

translationRouter.post('/items/imports',translationController.importExcelData1);

translationRouter.get('/items/export',translationController.exportDataToDb);


export default translationRouter;
