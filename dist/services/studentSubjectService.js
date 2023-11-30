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
const studentModel_1 = __importDefault(require("../models/studentModel"));
class StudentSubjectService {
    constructor() { }
    //  
    addSubjectToStudent(guid, subject, student_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getStudent = yield studentModel_1.default.findByPk(guid);
                if (!getStudent) {
                    //  await StudentModel.create({student_name:student_name,age:})
                }
                //     search for student  (if already xa vaney update grne else add grne)
                //     search for subject   if already xa vaney update grne else add grne.   ()// do this in a loop
                //  studnet_id , sub_id (push into new array)
                // save line 3 in bridge table;
                const student = yield studentModel_1.default.findByPk(guid);
                // return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new StudentSubjectService();
