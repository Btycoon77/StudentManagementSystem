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
    chooseSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const student_id = req.params.student_id;
            const chooseSubjects = req.body.choosenSubjects; // Assuming an array of subjectids;
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
                const sql = `Select std.student_id ,std.student_name,sub.subject_id, sub.subject_name FROM Students std JOIN studentsubjects  studsub
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
                        student_id: row.student_id,
                        student_name: row.student_name,
                        subjects: [
                            {
                                subject_id: row.subject_id,
                                subject_name: row.subject_name,
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
    // get one student and subjects
    getOneStudentsWithSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `Select std.student_id ,std.student_name,sub.subject_id, sub.subject_name FROM Students std JOIN studentsubjects  studsub
          ON  std.student_id = studsub.student_id 
          JOIN subjects sub  ON  studsub.subject_id = sub.subject_id where student_id=${req.params.student_id}
          `;
                const studentSubject = yield connectDb_1.connectDb.query(sql, {
                    type: sequelize_1.QueryTypes.SELECT,
                    raw: true
                });
                console.log("from bridge service", studentSubject);
                const formattedResult = studentSubject.map((row) => {
                    return {
                        student_id: row.student_id,
                        student_name: row.student_name,
                        subjects: [
                            {
                                subject_id: row.subject_id,
                                subject_name: row.subject_name,
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
}
exports.default = new BridgeService();
