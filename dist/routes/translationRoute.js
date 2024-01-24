"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const translationController_1 = __importDefault(require("../controller/translationController"));
const fileUpload_1 = __importDefault(require("../utils/fileUpload"));
const itemController_1 = __importDefault(require("../controller/itemController"));
const translationRouter = (0, express_1.Router)();
// makiing the use of static path.
// translationRouter.post('/items/imports',translationController.importExcelData1);
//  making the use of multer to import the item
translationRouter.post('/items/import', fileUpload_1.default.single("fileName"), translationController_1.default.importExcelData3);
// making the use of express-fileupload;
// translationRouter.post('/items/import',translationController.importExcelData2);
// exporting the item.
translationRouter.get('/items/export', translationController_1.default.exportDataToDb);
//  creating an item with their respecitve translations;
translationRouter.post('/items', itemController_1.default.createItem);
// updating the item
translationRouter.put('/items/:itemcode', itemController_1.default.updateItem);
// deleting the item
translationRouter.delete('/items/:ItemId', itemController_1.default.deleteItem);
// getting item list(query params: Language)
translationRouter.get('/items', itemController_1.default.getAllItems);
// getting the specific item
translationRouter.get('/items/:ItemId', itemController_1.default.getSpecificItem);
exports.default = translationRouter;
//# sourceMappingURL=translationRoute.js.map