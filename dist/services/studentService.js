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
const sequelize_1 = require("sequelize");
const studentModel_1 = __importDefault(require("../models/studentModel"));
const sequelize_2 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
class StudentService {
    //  to get all students
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield studentModel_1.default.findAll({
                where: {
                    datedeleted: {
                        [sequelize_1.Op.is]: (0, sequelize_2.literal)('null')
                    }
                }
            });
        });
    }
    //  to create student
    createStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield studentModel_1.default.create(studentData);
            // whatever the name of the column in database it should be the same 
        });
    }
    //  to delete students
    deleteStudent(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield studentModel_1.default.findOne({
                    where: {
                        guid: guid
                    }
                });
                // alterntively I can do this too.
                // const result = await StudentModel.destroy({
                //     where:{
                //         student_id:studentId
                //     }
                // });
                if (!student) {
                    return false;
                }
                yield student.update({ datedeleted: (0, sequelize_2.literal)('NULL') });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    //  to update the student
    updateStudent(guid, student_name, age) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield studentModel_1.default.findOne({
                    where: {
                        guid: guid
                    }
                });
                if (!student) {
                    return false;
                }
                student.student_name = student_name;
                student.age = age;
                yield student.save();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getPaginatedStudents(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, page, search, orderBy, orderDir } = queryParams;
            const offset = (page - 1) * pageSize;
            // const sql= " SELECT * FROM students  WHERE student_name LIKE '%Ram' ORDER BY student_id ASC LIMIT '10' OFFSET 0;";
            // whenver you want to inject sequelize property then make the use of {}
            const students = yield studentModel_1.default.findAndCountAll({
                limit: pageSize,
                offset: offset,
                where: {
                    student_name: {
                        [sequelize_1.Op.iLike]: `%${search}`
                    },
                },
                order: [[orderBy, orderDir]]
            });
            const totalPages = Math.ceil(students.count / pageSize);
            const result = {
                pageSize,
                page,
                totalPages,
                students: students.rows
            };
            return result;
        });
    }
    dbFunctionPagination(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageSize, page, search, orderBy, orderDir } = params;
                const result = yield connectDb_1.connectDb.query(`SELECT * FROM get_paginated_studentss(:pageSize, :page, :search, :orderBy, :orderDir)`, {
                    replacements: {
                        pageSize, page, search, orderBy, orderDir
                    }
                });
                // console.log(result);
                return result[0][0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new StudentService();
