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
Object.defineProperty(exports, "__esModule", { value: true });
const studentModel_1 = require("../models/studentModel");
class StudentService {
    //  to get all students
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield studentModel_1.StudentModel.findAll();
        });
    }
    //  to create student
    createStudent(student_name, age) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield studentModel_1.StudentModel.create({ student_name, age });
            // whatever the name of the column in database it should be the same 
        });
    }
    //  to delete students
    deleteStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield studentModel_1.StudentModel.findByPk(studentId);
                // alterntively I can do this too.
                // const result = await StudentModel.destroy({
                //     where:{
                //         student_id:studentId
                //     }
                // });
                if (!student) {
                    return false;
                }
                yield student.destroy();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    //  to update the student
    updateStudent(studentId, student_name, age) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield studentModel_1.StudentModel.findByPk(studentId);
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
}
exports.default = new StudentService();
