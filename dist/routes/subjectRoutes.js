"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectController_1 = __importDefault(require("../controller/subjectController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const subjectRouter = (0, express_1.Router)();
subjectRouter.put('/subjects/:guid', subjectController_1.default.updateSubject);
// get subject by id
subjectRouter.get('/subjects/:guid', subjectController_1.default.getSubjectById);
// subject pagination
subjectRouter.get('/subjects', auth_1.default, subjectController_1.default.getListOfSubjects);
subjectRouter.post('/subjects', subjectController_1.default.createSubject);
// to insert chapters recursively;(using CTE)
subjectRouter.post('/subjects/chapters/bulk', subjectController_1.default.insertSubjectChaptersBulk);
//  to insert chapter in bulk(bulk insert)
subjectRouter.post('/subjects/chapters', subjectController_1.default.insertSubjectChaptersRecurisively);
// soft delete subject
subjectRouter.delete('/subjects/:guid', subjectController_1.default.deleteSubject);
// hard delete subject
subjectRouter.delete('/hardDeleteSubject/:guid', subjectController_1.default.hardDelete);
// getting all the chapter of the specific subject(guid)
subjectRouter.get('/subjects/:guid/chapters', subjectController_1.default.getChapters);
exports.default = subjectRouter;
//# sourceMappingURL=subjectRoutes.js.map