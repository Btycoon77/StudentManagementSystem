"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const studentService_1 = __importDefault(require("../services/studentService"));
class StudentController {
    //  get all students;
    getAllStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield studentService_1.default.getAllStudents();
                res.status(200).json({
                    success: true,
                    data: students
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    success: false,
                    error: "Internal server error"
                });
            }
        });
    }
    //  create student
    createStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentData = req.body;
            try {
                const student = yield studentService_1.default.createStudent(studentData);
                res.status(201).json({
                    success: true,
                    data: student
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    success: false,
                    error: "Internal server error"
                });
            }
        });
    }
    //  delete student
    deleteStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const guid = req.params.guid;
            try {
                const success = yield studentService_1.default.deleteStudent(guid);
                if (success) {
                    res.status(201).json({
                        success: true,
                        message: "Student deleted succesfully"
                    });
                }
                else {
                    res.status(404).json({
                        error: "Student not found"
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    success: false,
                    error: "Internal server error"
                });
            }
        });
    }
    //  update student
    updateStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const guid = req.params.guid;
            const { student_name, age } = req.body;
            //  these names should be exact name of the column in database;
            try {
                const success = yield studentService_1.default.updateStudent(guid, student_name, age);
                if (success) {
                    res.status(201).json({
                        success: true,
                        message: "Student updated succesfully"
                    });
                }
                else {
                    res.status(404).json({
                        error: "Student not found"
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    success: false,
                    error: "Internal server error"
                });
            }
        });
    }
    // pagination controller;
    getPaginatedStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = {
                pageSize: req.query.pageSize,
                page: req.query.page,
                search: req.query.search,
                orderBy: req.query.orderBy,
                orderDir: req.query.orderDir
            };
            try {
                const result = yield studentService_1.default.getPaginatedStudents(queryParams);
                res.status(201).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    getDBfunctionPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = {
                pageSize: parseInt(req.query.pageSize),
                page: parseInt(req.query.page),
                search: req.query.search,
                orderBy: req.query.orderBy,
                orderDir: req.query.orderDir
            };
            try {
                const result = yield studentService_1.default.dbFunctionPagination(queryParams);
                console.log("from controller", result);
                res.status(201).send(result);
            }
            catch (error) {
                res.status(501).json({ error: "Internal server error" });
            }
        });
    }
}
exports.default = new StudentController();
