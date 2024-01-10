"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectController_1 = __importDefault(require("../controller/subjectController"));
const subjectRouter = (0, express_1.Router)();
subjectRouter.put('/subjects/:guid', subjectController_1.default.updateSubject);
// get subject by id
subjectRouter.get('/subjects/:guid', subjectController_1.default.getSubjectById);
subjectRouter.get('/subjects', subjectController_1.default.getListOfSubjects);
subjectRouter.post('/subjects', subjectController_1.default.createSubject);
// to insert chapters recursively;
subjectRouter.post('/subjects/chapters/bulk', subjectController_1.default.insertSubjectChaptersBulk);
//  to insert chapter in bulk
subjectRouter.post('/subjects/chapters', subjectController_1.default.insertSubjectChaptersRecurisively);
// soft delete subject
subjectRouter.delete('/subjects/:guid', subjectController_1.default.deleteSubject);
// hard delete subject
subjectRouter.delete('/hardDeleteSubject/:guid', subjectController_1.default.hardDelete);
subjectRouter.get('/subjects/:guid/chapters', subjectController_1.default.getChapters);
exports.default = subjectRouter;
//# sourceMappingURL=subjectRoutes.js.map