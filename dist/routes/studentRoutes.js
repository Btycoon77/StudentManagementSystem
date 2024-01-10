"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = __importDefault(require("../controller/studentController"));
const bridgeController_1 = __importDefault(require("../controller/bridgeController"));
const studentRouter = (0, express_1.Router)();
studentRouter.put('/students/:guid', studentController_1.default.updateStudent);
// creating student
studentRouter.post('/students', studentController_1.default.createStudent);
// route for getting list of students;
studentRouter.get('/students', studentController_1.default.getListOfStudents);
studentRouter.delete('/deleteStudent/:guid', studentController_1.default.deleteStudent);
//  route for getting student by id;
studentRouter.get('/students/:guid', bridgeController_1.default.getStudentByIdFromDB);
// soft deleting the student 
studentRouter.delete('/students/:guid', studentController_1.default.deleteStudent);
// hard deleting the student;
studentRouter.delete('/hardDeleteStudent/:guid', studentController_1.default.hardDeleteStudent);
//  route for choosing the subject;
studentRouter.post('/students/:StudentId', bridgeController_1.default.marksObtained);
// studentRouter.post('/choose/:guid',bridgeController.assignSubjects);
//  route for getting all student with subjects
studentRouter.get('/getStudentWithSubjects', bridgeController_1.default.getStudentsWithSubjects);
// route for db function pagination; only student data || no subject
studentRouter.get('/studentPaginationDb', studentController_1.default.getDBfunctionPagination);
// route for db paginationJoin SQL function
studentRouter.get('/studentPaginationSQLDb', studentController_1.default.getDBfunctionJoinPagination);
studentRouter.get('/joinDbFunction', studentController_1.default.getJoinData);
//  route for studentSubject sql function;
studentRouter.get('/studentSubjectPagination', bridgeController_1.default.getStudentSubjectPagination);
//  route for generating pdf;
studentRouter.get('/generatePdf/:StudentId', studentController_1.default.generatePDFController);
exports.default = studentRouter;
//# sourceMappingURL=studentRoutes.js.map