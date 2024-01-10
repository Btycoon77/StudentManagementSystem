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
const BridgeService_1 = __importDefault(require("../services/BridgeService"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const bridgeModel_1 = require("../models/bridgeModel");
const subjectModel_1 = __importDefault(require("../models/subjectModel"));
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
const pdfHelper_1 = __importDefault(require("../utils/pdfHelper"));
class BridgeController {
    getStudentSubjectPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = {
                pageSize: req.query.pageSize,
                page: req.query.page,
                search: req.query.search,
                orderBy: req.query.orderBy,
                orderDir: req.query.orderDir
            };
            try {
                const result = yield BridgeService_1.default.studentSubjectPagination(queryParams);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    getStudentsWithSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield BridgeService_1.default.getStudentsWithSubjects();
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    // get student by id
    getStudentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const guid = req.params.guid;
                const result = yield BridgeService_1.default.getStudentByID(guid);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    getStudentByIdFromDB(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const StudentId = req.params.guid;
                const StudentInfo = yield connectDb_1.connectDb.query(`select public.getstudentbyid(:StudentId)`, {
                    replacements: {
                        StudentId // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                console.log(StudentInfo);
                // const totalMarks = await connectDb.query(`select sum(marksobtained) as totalmarks 
                // from studentsubjects 
                // where student_id =${StdId}
                // group by student_id`,{
                //   type:QueryTypes.SELECT
                // });
                // console.log(totalMarks)
                // let [percentage] = totalMarks.map((data:any)=> data.totalmarks);
                // console.log(percentage);
                // StudentInfo??next((Error("student doesnt exist")))
                // if(StudentInfo.filter((data:any)=>data.getstudentbyid === null))
                // {
                //   next( Error("Student does not exist"));
                // }
                // else{
                let student = StudentInfo.map((std) => {
                    return {
                        StudentId: StudentId,
                        StudentName: std.getstudentbyid.StudentName,
                        Age: std.getstudentbyid.age,
                        MarkObtained: std.getstudentbyid.total,
                        TotalMarks: std.getstudentbyid.totalMarks,
                        Percentage: `${parseInt(std.getstudentbyid.total) / (std.getstudentbyid.totalMarks) * 100}%`,
                        Subjects: std.getstudentbyid.Subjects,
                    };
                });
                res.status(200).json(student[0]);
                //  generate the pdf
                (0, pdfHelper_1.default)({
                    title: "Student Info",
                    tableData: student,
                    filename: `studentInfo.pdf`
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    marksObtained(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const StudentId = req.params.StudentId;
                const StudentName = req.body.StudentName;
                const age = req.body.age;
                const subjects = JSON.stringify(req.body.Subjects);
                // const MarksObtained = req.body.MarksObtained;
                const result = yield connectDb_1.connectDb.query(`select public.checkbox_new2(:StudentId,:StudentName,:age,:subjects)`, {
                    replacements: {
                        StudentId, StudentName, age, subjects // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                res.status(200).json({
                    result: "Subject assinged succesfully"
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    assignSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const StudentId = req.params.StudentId;
                const StudentName = req.body.StudentName;
                const age = req.body.age;
                const subjects = JSON.stringify(req.body.Subjects); //while calling the sql function from api we need to jsonify object if that is array 
                //        this sql function is for the upsert case;
                // const result = await connectDb.query(`select public.upsert_student_and_subject(:StudentName,:age,:subjects,:StudentId)`,{
                //   replacements:{
                //     StudentName,age,subjects,StudentId   // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
                //   },
                //   type:QueryTypes.SELECT
                // });
                // this sql function is for  checkbox insert/delete update)
                const result = yield connectDb_1.connectDb.query(`select public.checkbox_new1(:StudentId,:StudentName,:age,:subjects)`, {
                    replacements: {
                        StudentId, StudentName, age, subjects // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                res.status(200).json({
                    result: "Subject assinged succesfully"
                });
            }
            catch (error) {
                console.log("from assign subject" + error);
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    //  choose/assign  subject by students
    // async assignSubject(req:Request,res:Response):Promise<any>{
    //         try {
    //             const { StudentId, StudentName, age, Subjects } = req.body;
    //             await BridgeService.assignSubject(StudentId, StudentName, age, Subjects);
    //             res.status(200).json({ message: 'Subjects assigned successfully' }); 
    //         } catch (error) {
    //             res.status(500).json({
    //                 error:"Internal server error"
    //             })
    //         }
    // }
    assignSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { student_id, Subjects, student_name, age } = req.body;
            // choosenSubject is an array;
            try {
                // Step 1: Check if the student with the provided guid exists
                const existingStudent = yield studentModel_1.default.findOne({
                    where: {
                        guid: student_id,
                        datedeleted: {
                            [sequelize_1.Op.is]: (0, sequelize_1.literal)('null')
                        }
                    },
                });
                let studentId;
                let student;
                if (existingStudent) {
                    // Student exists, update the ex0isting student
                    student = yield studentModel_1.default.update(
                    // Update student attributes if needed
                    {
                        student_name: student_name,
                        age: age
                    }, {
                        where: {
                            guid: student_id,
                        },
                    });
                }
                else {
                    // Student doesn't exist, create a new student
                    student = yield studentModel_1.default.create({
                        student_name, age
                    });
                    studentId = student.student_id;
                }
                const chosenSubjectIds = [];
                // Step 2: Loop through chosen subjects
                for (const subjectName of Subjects) {
                    // Step 3: Check if the subject with the provided name exists
                    const existingSubject = yield subjectModel_1.default.findOne({
                        where: {
                            subject_name: subjectName,
                        },
                    });
                    let subjectId;
                    let subjectNames;
                    if (existingSubject) {
                        // Subject exists, update the existing subject if needed
                        let subject = yield subjectModel_1.default.update({
                            subject_name: subjectName
                        }, {
                            where: {
                            //  subject_id: subjectId 
                            },
                        });
                        subjectId = existingSubject.dataValues.subject_id;
                    }
                    else {
                        // Subject doesn't exist, create a new subject
                        const newSubject = yield subjectModel_1.default.create({
                            subject_name: subjectName
                        });
                        subjectNames = newSubject.dataValues.subject_name;
                        // Step 4: Push subjectId to chosenSubjectIds array
                        chosenSubjectIds.push(subjectNames);
                    }
                    // Step 5: Check if the student has already chosen this subject
                    const existingBridgeRecord = yield bridgeModel_1.BridgeModel.findOne({
                        where: {
                            student_id: student_id,
                            // subject_id: subjectId,
                        },
                    });
                    if (!existingBridgeRecord) {
                        // Student hasn't chosen this subject, insert a new record in BridgeModel
                        yield bridgeModel_1.BridgeModel.create({
                            student_id: student_id,
                            // subject_id: subjectId,
                            // Add other attributes as needed
                        });
                    }
                }
                res.status(200).json({
                    message: 'Subjects chosen and updated successfully',
                });
            }
            catch (error) {
                console.error('Error in chooseSubjects:', error);
                res.status(500).json('Internal server error');
            }
        });
    }
}
exports.default = new BridgeController();
//# sourceMappingURL=bridgeController.js.map