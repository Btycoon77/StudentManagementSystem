import { Router } from "express";
import translationController from "../controller/translationController";
import uploadMiddleware from "../utils/fileUpload";
import itemController from "../controller/itemController";

const translationRouter = Router();

// makiing the use of static path.
// translationRouter.post('/items/imports',translationController.importExcelData1);

//  making the use of multer to import the item
translationRouter.post('/items/import',uploadMiddleware.single("fileName"),translationController.importExcelData3);

// making the use of express-fileupload;
// translationRouter.post('/items/import',translationController.importExcelData2);

// exporting the item.
translationRouter.get('/items/export',translationController.exportDataToDb);

//  creating an item with their respecitve translations;
translationRouter.post('/items',itemController.createItem);

// updating the item
translationRouter.put('/items/:itemcode',itemController.updateItem);

// deleting the item
translationRouter.delete('/items/:ItemId',itemController.deleteItem);

// getting item list(query params: Language)
translationRouter.get('/items',itemController.getAllItems);

// getting the specific item
translationRouter.get('/items/:ItemId',itemController.getSpecificItem);





export default translationRouter;
