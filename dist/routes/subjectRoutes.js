"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectController_1 = __importDefault(require("../controller/subjectController"));
const subjectRouter = (0, express_1.Router)();
subjectRouter.put('/updateSubject/:id', subjectController_1.default.updateSubject);
subjectRouter.get('/getAllSubjects', subjectController_1.default.getAllSubjects);
subjectRouter.post('/createSubject', subjectController_1.default.createSubject);
subjectRouter.delete('/deleteSubject/:id', subjectController_1.default.deleteSubject);
exports.default = subjectRouter;
