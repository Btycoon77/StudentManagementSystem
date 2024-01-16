"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const translationController_1 = __importDefault(require("../controller/translationController"));
const translationRouter = (0, express_1.Router)();
translationRouter.post('/items/imports', translationController_1.default.importExcelData1);
translationRouter.get('/items/export', translationController_1.default.exportDataToDb);
exports.default = translationRouter;
//# sourceMappingURL=translationRoute.js.map