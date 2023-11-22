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
const subjectService_1 = __importDefault(require("../services/subjectService"));
class SubjectController {
    //  get all subjects;
    getAllSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = yield subjectService_1.default.getAllSubjects();
                res.status(200).json({
                    success: true,
                    data: subject
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
    //  create subject
    createSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subject_name } = req.body;
            try {
                const subject = yield subjectService_1.default.createSubject(subject_name);
                res.status(201).json({
                    success: true,
                    data: subject
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
    //  delete subject
    deleteSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const subjectId = req.params.id;
            try {
                const success = yield subjectService_1.default.deleteSubject(subjectId);
                if (success) {
                    res.status(201).json({
                        success: true,
                        message: "Subject deleted succesfully"
                    });
                }
                else {
                    res.status(404).json({
                        error: "Subject not found"
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
    //  update subject
    updateSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject_id = req.params.id;
            const { subject_name } = req.body;
            //  these names should be exact name of the column in database;
            try {
                const success = yield subjectService_1.default.updateSubject(subject_id, subject_name);
                if (success) {
                    res.status(201).json({
                        success: true,
                        message: "Subject updated succesfully"
                    });
                }
                else {
                    res.status(404).json({
                        error: "Subject not found"
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
}
exports.default = new SubjectController();
