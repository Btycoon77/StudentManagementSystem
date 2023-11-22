"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = __importDefault(require("../controller/studentController"));
const studentRouter = (0, express_1.Router)();
studentRouter.put('/updateStudent/:id', studentController_1.default.updateStudent);
studentRouter.get('/getAllStudents', studentController_1.default.getAllStudents);
studentRouter.post('/createStudent', studentController_1.default.createStudent);
studentRouter.delete('/deleteStudent/:id', studentController_1.default.deleteStudent);
exports.default = studentRouter;
