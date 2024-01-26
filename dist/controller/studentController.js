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
const generatePdf_1 = __importDefault(require("../services/generatePdf"));
const fs_1 = __importDefault(require("fs"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class StudentController {
    //  create student
    createStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentData = {
                student_name: req.body.student_name,
                age: req.body.age,
                email: req.body.email,
                password: req.body.password
            };
            try {
                const existingStudent = yield studentModel_1.default.findOne({
                    where: {
                        email: studentData.email
                    }
                });
                if (existingStudent) {
                    //  if you dont put a return here then code will execute to the next line else code stops at this point
                    return res.status(409).json({
                        message: "User already exists"
                    });
                }
                const password = req.body.password;
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                console.log(hashedPassword);
                const student = yield studentService_1.default.createStudent({
                    student_name: studentData.student_name,
                    age: studentData.age,
                    password: hashedPassword,
                    email: studentData.email
                });
                res.status(201).json({
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
    // login handler
    loginController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield studentModel_1.default.findOne({
                    where: {
                        email: req.body.email
                    }
                });
                if (!student) {
                    res.status(400).json({
                        message: 'User not found'
                    });
                }
                // console.log(student)
                // res.status(200).json(student);
                console.log("password", student === null || student === void 0 ? void 0 : student.dataValues.password);
                const isMatched = yield bcryptjs_1.default.compare(req.body.password, student === null || student === void 0 ? void 0 : student.dataValues.password);
                if (!isMatched) {
                    res.status(409).json({
                        message: "Invalid email or password"
                    });
                }
                const guid = student === null || student === void 0 ? void 0 : student.dataValues.guid;
                const token = jsonwebtoken_1.default.sign(guid, process.env.JWT_SECRET);
                console.log(token);
                res.status(200).json({
                    message: "Login success",
                    token: token
                });
            }
            catch (error) {
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    //  delete student
    deleteStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const guid = req.params.guid;
            try {
                const success = yield studentService_1.default.deleteStudent(guid);
                if (success) {
                    res.status(204).json({
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
                // res.status(500).json({
                //     success:false,
                //     error:"Internal server error"
                // })
                next(error);
            }
        });
    }
    //  hard deleting the student;
    hardDeleteStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const guid = req.params.guid;
            try {
                const success = yield studentService_1.default.hardDelete(guid);
                if (success) {
                    res.status(204).json({
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
    getListOfStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = {
                pageSize: req.query.pageSize,
                page: req.query.page,
                search: req.query.search,
                orderBy: req.query.orderBy,
                orderDir: req.query.orderDir
            };
            try {
                const result = yield studentService_1.default.getListOfStudents(queryParams);
                // res.status(200).json(result.students);
                let data = result.students.map((el) => {
                    return {
                        StudentId: el.guid,
                        StudentName: el.student_name,
                        Age: el.age
                    };
                });
                res.status(200).json(data);
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
    getDBfunctionJoinPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = {
                pageSize: parseInt(req.query.pageSize),
                page: parseInt(req.query.page),
                search: req.query.search,
                orderBy: req.query.orderBy,
                orderDir: req.query.orderDir
            };
            try {
                const result = yield studentService_1.default.dbFunctionJoinPagination(queryParams);
                // console.log("from join pagination controller",result);
                // res.status(200).json(result[0]);
                // const totalMarks = await connectDb.query(`select sum(marksobtained) as totalmarks 
                // from studentsubjects 
                // where student_id =${StudentId}
                // group by student_id`,{
                //   type:QueryTypes.SELECT
                // });
                // console.log(totalMarks)
                // let [percentage] = totalMarks.map((data:any)=> data.totalmarks);
                // let totalMarks;
                // for(const total of result.Subjects){
                //     totalMarks += subject.MarksObtained;
                // }
                res.status(200).json({
                    StudentId: result[0].student_id,
                    StudentName: result[0].student_name,
                    // Percentage: ,
                    // Percentage:`${parseInt(percentage)/300*100}%`,
                    Subjects: result[0].subjects.map((sub) => {
                        return {
                            SubjectId: sub.subject_id,
                            SubjectName: sub.subject_name,
                            SubjectMarks: sub.subject_marks
                        };
                    })
                });
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    // join
    getJoinData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield studentService_1.default.dbJoin();
                console.log('db join ', result);
                res.status(201).json({
                    result: result
                });
            }
            catch (error) {
                console.log(error);
                res.status(501).json({
                    error: "INternal server error"
                });
            }
        });
    }
    generatePDFController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { StudentId } = req.params;
                // Generate a unique filename
                const filename = `studentInfo.pdf`;
                const filePath = `./pdfs/${filename}`; // Specify the desired directory
                // Create a writable stream to write the PDF content to a file
                const stream = fs_1.default.createWriteStream(filePath);
                // Generate and write the PDF content to the stream
                yield (0, generatePdf_1.default)(StudentId, stream);
                res.status(200).json({
                    message: 'PDF generated successfully',
                    filePath,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'Internal server error',
                });
            }
        });
    }
}
exports.default = new StudentController();
//# sourceMappingURL=studentController.js.map