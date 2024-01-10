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
const subjectModel_1 = __importDefault(require("../models/subjectModel"));
const ChapterModel_1 = __importDefault(require("../models/ChapterModel"));
class SubjectService {
    //  to get all subjects
    getListOfSubjects(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageSize, page, search, orderBy, orderDir } = queryParams;
            const offset = (page - 1) * pageSize;
            // const sql= " SELECT * FROM students  WHERE student_name LIKE '%Ram%' ORDER BY student_id ASC LIMIT '10' OFFSET 0;";
            // whenver you want to inject sequelize property then make the use of {}
            const subjects = yield subjectModel_1.default.findAndCountAll({
                limit: pageSize,
                offset: offset,
                attributes: ['guid', 'subject_name'],
                where: {
                    subject_name: {
                        [sequelize_1.Op.iLike]: `%${search}%`
                    },
                    datedeleted: {
                        [sequelize_1.Op.is]: (0, sequelize_1.literal)('null')
                    }
                },
                order: [[orderBy, orderDir]]
            });
            const totalPages = Math.ceil(subjects.count / pageSize);
            const result = {
                //   pageSize,
                //   page,
                //   totalPages,
                subjects: subjects.rows
            };
            return result;
        });
    }
    //  to create subject
    createSubject(subject, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkSubject = yield subjectModel_1.default.count({
                where: {
                    subject_name: subject.subject_name,
                }
            });
            if (checkSubject > 0) {
                next(Error("subject with that name already exists"));
            }
            return yield subjectModel_1.default.create(subject);
        });
    }
    //  to create chapters;
    createChapter(chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            // const checkSubject = await SubjectModel.count({
            //     where:{
            //         subject_name:subject.subject_name,
            //     }
            // });
            //     if(checkSubject >0){
            //         next(Error("subject with that name already exists"));
            //     }
            return yield ChapterModel_1.default.create(chapter);
        });
    }
    //  to delete subjects
    deleteSubject(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = yield subjectModel_1.default.findOne({
                    where: {
                        guid: guid
                    }
                });
                if (!subject) {
                    return false;
                }
                yield subject.update({ datedeleted: new Date() });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    // to hard delete subjects;
    hardDeleteSubject(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = yield subjectModel_1.default.findOne({
                    where: {
                        guid: guid
                    }
                });
                if (!subject) {
                    return false;
                }
                yield subject.destroy();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    //  to update the subject
    updateSubject(guid, subject_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = yield subjectModel_1.default.findOne({
                    where: {
                        guid: guid
                    }
                });
                if (!subject) {
                    return false;
                }
                subject.subject_name = subject_name;
                yield subject.save();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    // get subject by id
    getSubjectById(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = yield subjectModel_1.default.findOne({
                    attributes: ['subject_id', 'subject_name'],
                    where: {
                        guid: guid
                    }
                });
                if (!subject) {
                    throw Error('Subject not found');
                }
                return subject;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.default = new SubjectService();
//# sourceMappingURL=subjectService.js.map