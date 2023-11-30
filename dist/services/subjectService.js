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
class SubjectService {
    //  to get all students
    getAllSubjects() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subjectModel_1.default.findAll({
                where: {
                    datedeleted: {
                        [sequelize_1.Op.is]: (0, sequelize_1.literal)('null')
                    }
                }
            });
        });
    }
    //  to create subject
    createSubject(subject) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subjectModel_1.default.create(subject);
            // whatever the name of the column in database it should be the same 
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
                // alterntively I can do this too.
                // const result = await SubjectModel.destroy({
                //     where:{
                //         subject_id:subjectId
                //     }
                // });
                if (!subject) {
                    return false;
                }
                yield subject.update({ datedeleted: (0, sequelize_1.literal)('NULL') });
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
}
exports.default = new SubjectService();
