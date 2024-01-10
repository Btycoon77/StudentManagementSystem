"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapterController_1 = __importDefault(require("../controller/chapterController"));
const chapterRouter = (0, express_1.Router)();
chapterRouter.get('/subject/chapters', chapterController_1.default.getChapterList);
exports.default = chapterRouter;
//# sourceMappingURL=chapterRoutes.js.map