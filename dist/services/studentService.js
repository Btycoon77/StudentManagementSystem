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
    //  to create student
    createStudent(studentData, next) {
        return __awaiter(this, void 0, void 0, function* () {
            //  check if student exist;
            const checkStudent = yield studentModel_1.default.count({
                where: {
                    student_name: studentData.student_name,
                }
            });
            if (checkStudent > 0) {
                next(Error("student with that name already exists"));
                // throw Error("student with that name already exists");
            }
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
                if (!student) {
                    return false;
                }
                console.log("delete student", student);
                yield studentModel_1.default.update({ datedeleted: new Date() }, { where: {
                        guid: guid
                    } });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    //  hard deleting the student;
    hardDelete(guid) {
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
                yield student.destroy();
                return true;
            }
            catch (error) {
                console.log(error);
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
    getListOfStudents(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, page, search, orderBy, orderDir } = queryParams;
            const offset = (page - 1) * pageSize;
            // const sql= " SELECT * FROM students  WHERE student_name LIKE '%Ram%' ORDER BY student_id ASC LIMIT '10' OFFSET 0;";
            // whenver you want to inject sequelize property then make the use of {}
            const students = yield studentModel_1.default.findAndCountAll({
                limit: pageSize,
                offset: offset,
                attributes: ['guid', 'student_name', 'age'],
                where: {
                    student_name: {
                        [sequelize_1.Op.iLike]: `%${search}%`
                    },
                    datedeleted: {
                        [sequelize_1.Op.is]: (0, sequelize_2.literal)('null')
                    }
                },
                order: [[orderBy, orderDir]]
            });
            const totalPages = Math.ceil(students.count / pageSize);
            const result = {
                //   pageSize,
                //   page,
                //   totalPages,
                students: students.rows
            };
            return result;
        });
    }
    //  GETTING STUDENT DETAILS ONLY , NO SUBJECT!
    dbFunctionPagination(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageSize, page, search, orderBy, orderDir } = params;
                const result = yield connectDb_1.connectDb.query(`SELECT * FROM get_paginated_students(:pageSize, :page, :search, :orderBy, :orderDir)`, {
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
    //  getting student and subject join
    dbFunctionJoinPagination(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, pageSize, search, orderBy, orderDir } = params;
                const result = yield connectDb_1.connectDb.query(`Select * from getpaginationjoin1(:page,:pageSize,:search,:orderBy,:orderDir)`, {
                    replacements: {
                        page, pageSize, search, orderBy, orderDir
                    }
                });
                return result[0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    dbJoin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectDb_1.connectDb.query(`Select * from get_student_subject_info()`);
                return result[0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new StudentService();
// {
//     // dont write info
//         "StudentId": "<uuid>",
//         "StudentName":"",
//         "subjects":[
//             {
//                 "SubjectId":"",
//                 "SubjectName":""
//             },{}
//         ]
//     }
// post ma pagination chahidaian
// get ma pagination chahinxa;
//  check if student exist
// delete ma json hunuvayena
//  delete grda 204 status code huna pryo
//  update grda , create grda 201.
//  retrieve grda 200 
// authorizatoin error 401.
// bad request 400
// resource not found 404
// internal server error 500
//  validation error(conflict error) 409 (duplicate data error)
// 
//# sourceMappingURL=studentService.js.map