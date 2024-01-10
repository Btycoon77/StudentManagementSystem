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
const bridgeModel_1 = require("../models/bridgeModel");
const studentModel_1 = __importDefault(require("../models/studentModel"));
const subjectModel_1 = __importDefault(require("../models/subjectModel"));
const connectDb_1 = require("../db/connectDb");
const sequelize_1 = require("sequelize");
class BridgeService {
    // POST : /students/::studentuuid
    // Payload/Body : {StudentId:"",StudentName:"",Subjects:[{"SubjectId":"",SubjectName:""}]}
    chooseSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const student_id = req.params.student_id;
            const chooseSubjects = req.body.choosenSubjects; // Assuming an array of subjectids;
            // if student guid exist then update 
            // that student and save the student_id in  a varaible.
            // since subjects comes in array , loop the subject
            // if subject exist then update subject table otherwise insert that record in subject table.
            // then subject_id of that particular insertion should be pushed into a seperate array.
            // then insert this array into bridge table.
            // eg: if ram has chosen gk subject then he cannot choose the same subject again.(dont insert that data) otherwise  insert data;
            try {
                // here are two ids that are important namely student_id and subject_id
                // Remove existing associations for the student(dupilcate data hatauna lai)
                yield bridgeModel_1.BridgeModel.destroy({ where: { student_id: student_id } });
                //add new associations based on the chosen subjects
                //  here in BridgeModel (junction table) there are two main attributes namely studnet_id and subject_id and they are inserted respectively;so to speicfy which student has taken what subject we need student_id and subject_id
                yield bridgeModel_1.BridgeModel.bulkCreate(chooseSubjects.map(subjectId => ({
                    student_id: student_id,
                    subject_id: subjectId
                })));
                res.status(200).json({
                    message: 'Subjects choosen and updated succesufully'
                });
            }
            catch (error) {
                res.status(500).json("Internal server error");
                console.log(error);
            }
        });
    }
    assignSubject(StudentId, StudentName, age, Subjects) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //  
                // we need to use make indexes here to uniquely identfy the student from the table.
                //  first upserting the student 
                const [student] = yield studentModel_1.default.upsert({
                    student_name: StudentName,
                    age: age
                });
                console.log('assign subject', student);
                // secondly upserting the subject;
                const subjectPromises = Subjects.map((subject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const [subjectRecord] = yield subjectModel_1.default.upsert({ subject_name: subject.SubjectName });
                        let data = yield bridgeModel_1.BridgeModel.upsert({ subject_id: subjectRecord.dataValues.subject_id, student_id: student.dataValues.student_id });
                        console.log("from bridgemodel service", data);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }));
                yield Promise.all(subjectPromises);
            }
            catch (error) {
                console.log("Error in assigning subject", error);
            }
        });
    }
    getStudentsWithSubjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSubject = yield studentModel_1.default.findAll({
                    // include: [
                    //   {
                    //     model: BridgeModel,
                    //     attributes: [],// from bridgeModel you dont want to retrieve any columns;
                    include: [
                        {
                            model: subjectModel_1.default,
                            attributes: ['subject_id', 'subject_name'], // but from subjectModel you want to retrieve.these 2 columns;
                            required: false,
                            where: {
                                datedeleted: {
                                    [sequelize_1.Op.is]: (0, sequelize_1.literal)('null')
                                }
                            }
                        },
                    ],
                    // },
                    // ],
                });
                console.log("from bridge service", studentSubject);
                const formattedResult = studentSubject.map((row) => {
                    return {
                        student_id: row.student_id,
                        student_name: row.student_name,
                        subjects: row.subjects.map((sub) => {
                            return ({
                                subject_id: sub.subject_id,
                                subject_name: sub.subject_name
                            });
                        })
                    };
                });
                return formattedResult;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    studentSubjectPagination(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, page, search, orderBy, orderDir } = queryParams;
            try {
                //  use the pagination api
                const offset = (page - 1) * pageSize;
                const students = yield studentModel_1.default.findAndCountAll({
                    limit: pageSize,
                    offset: offset,
                    where: {
                        student_name: {
                            [sequelize_1.Op.iLike]: `%${search}`
                        },
                    },
                    include: [
                        {
                            model: subjectModel_1.default,
                            attributes: ['subject_id', 'subject_name'], // but from subjectModel you want to retrieve.these 2 columns;
                            required: false,
                            where: {
                                datedeleted: {
                                    [sequelize_1.Op.is]: (0, sequelize_1.literal)('null')
                                }
                            }
                        },
                    ],
                    order: [[orderBy, orderDir]]
                });
                const totalPages = Math.ceil(students.count / pageSize);
                const result = {
                    pageSize,
                    page,
                    totalPages,
                    student: students.rows
                };
                return result;
                // return formattedResult;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getStudentsWithSubjectss(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `Select std.student_name ,std.student_name,sub.subject_id, sub.subject_name FROM Students std JOIN studentsubjects  studsub
            ON  std.student_id = studsub.student_id 
            JOIN subjects sub  ON  studsub.subject_id = sub.subject_id
            `;
                const studentSubject = yield connectDb_1.connectDb.query(sql, {
                    type: sequelize_1.QueryTypes.SELECT,
                    raw: true
                });
                console.log("from bridge service", studentSubject);
                const formattedResult = studentSubject.map((row) => {
                    return {
                        StudentId: row.guid,
                        StudentName: row.student_name,
                        Subjects: [
                            {
                                SubjectId: row.guid,
                                SubjectName: row.subject_name,
                            },
                        ],
                    };
                });
                res.status(200).json(formattedResult);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //  getting student by id with their chosen subjects
    getStudentByID(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield studentModel_1.default.findOne({
                    where: {
                        guid: guid,
                    },
                    include: [
                        {
                            model: subjectModel_1.default,
                            attributes: ['subject_id', 'subject_name', 'guid']
                        },
                        // {
                        //   model:BridgeModel,
                        //   attributes:['marksobtained']
                        // }
                    ]
                });
                if (!student) {
                    throw Error('student not found');
                }
                let result = [];
                result.push(student);
                const formattedResult = result.map((row) => {
                    console.log(row.marksobtained);
                    return {
                        StudentId: row.guid,
                        StudentName: row.student_name,
                        age: row.age,
                        // Percentage: parseInt(row.marksobtained)/3*100,
                        Subjects: row.subjects.map((sub) => {
                            return {
                                SubjectId: sub.guid,
                                SubjectName: sub.subject_name
                            };
                        })
                    };
                });
                console.log(formattedResult);
                return formattedResult[0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new BridgeService();
//# sourceMappingURL=BridgeService.js.map