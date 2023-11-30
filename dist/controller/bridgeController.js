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
                res.status(201).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(501).json({
                    error: "Internal server error"
                });
            }
        });
    }
    getStudentsWithSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield BridgeService_1.default.getStudentsWithSubjects();
                res.status(201).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(501).json({
                    error: "Internal server error"
                });
            }
        });
    }
    chooseSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const result = await BridgeService.chooseSubjects();
            }
            catch (error) {
                res.status(501).json({
                    error: "Internal server error"
                });
            }
        });
    }
}
exports.default = new BridgeController();
