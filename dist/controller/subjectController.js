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
const connectDb_1 = require("../db/connectDb");
const sequelize_1 = require("sequelize");
class SubjectController {
    //  get all subjects;
    getListOfSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryParams = {
                    pageSize: req.query.pageSize,
                    page: req.query.page,
                    search: req.query.search,
                    orderBy: req.query.orderBy,
                    orderDir: req.query.orderDir
                };
                const subject = yield subjectService_1.default.getListOfSubjects(queryParams);
                res.status(200).json(subject.subjects.map((data) => {
                    return {
                        guid: data.guid,
                        SubjectName: data.subject_name,
                    };
                }));
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
    createSubject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const subjects = req.body;
            try {
                const subject = yield subjectService_1.default.createSubject(subjects, next);
                res.status(201).json({
                    SubjectId: subject.guid,
                    DateCreated: subject.datecreated,
                    SubjectName: subject.subject_name,
                    DateDeleted: subject.datedeleted
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
            const guid = req.params.guid;
            try {
                const success = yield subjectService_1.default.deleteSubject(guid);
                if (success) {
                    res.status(204).json({
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
    // recursive subject;
    getChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const SubjectId = req.params.guid;
            try {
                const ChapterInfo = yield connectDb_1.connectDb.query(`select public.get_chapters_all(:SubjectId)`, {
                    replacements: {
                        SubjectId // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                // console.log(ChapterInfo);
                if (!ChapterInfo || ChapterInfo.length === 0) {
                    res.status(404).json({
                        error: "Subject chapter not found"
                    });
                }
                const hierarchialChapters = buildHierarchy1(ChapterInfo);
                res.status(200).json(hierarchialChapters);
            }
            catch (error) {
                console.log(error.message);
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    // hard delete subject
    hardDelete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const guid = req.params.guid;
            try {
                const success = yield subjectService_1.default.hardDeleteSubject(guid);
                if (!success) {
                    res.status(404).json({
                        error: "subject not found"
                    });
                }
                res.status(204).json({
                    result: "succesfully deleted subject",
                });
            }
            catch (error) {
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    //  update subject
    updateSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const guid = req.params.guid;
            const { subject_name } = req.body;
            //  these names should be exact name of the column in database;
            try {
                const success = yield subjectService_1.default.updateSubject(guid, subject_name);
                if (success) {
                    res.status(201).json({
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
    // get student by id
    getSubjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const guid = req.params.guid;
            try {
                const subject = yield subjectService_1.default.getSubjectById(guid);
                res.status(200).json({
                    SubjectId: guid,
                    SubjectName: subject.subject_name
                });
            }
            catch (error) {
                res.status(500).json({
                    error: "Internal server error"
                });
            }
        });
    }
    // inserting the chapters recursively;
    insertSubjectChaptersRecurisively(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapterData = JSON.stringify(req.body); // wehenver we are inserting data into sql function (jsonb) then we need to stringify the data;
                const result = yield connectDb_1.connectDb.query(`SELECT public.insert_hierarchical_chapters1(:chapterData)
            `, {
                    replacements: {
                        chapterData
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                res.status(200).json({
                    result: "Chapter inserted succesfully"
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error
                });
                console.log(error);
            }
        });
    }
    //  using bulk insert and bulk update;
    insertSubjectChaptersBulk(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapterData = JSON.stringify(req.body); // wehenver we are inserting data into sql function (jsonb) then we need to stringify the data;
                const data = req.body.chapter_data;
                const subjectName = req.body.SubjectName;
                let jsonData = JSON.stringify(flattenHierarchy(data));
                console.log("bulk insert data", jsonData);
                const result = yield connectDb_1.connectDb.query(`SELECT public.bulk_insert_hierarchial_chapters1(:chapterData,:subjectName)
            `, {
                    replacements: {
                        chapterData: jsonData,
                        subjectName: subjectName
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                res.status(200).json({
                    result: "Chapter inserted succesfully"
                });
            }
            catch (error) {
                res.status(500).json({
                    error: error
                });
                console.log(error);
            }
        });
    }
}
function flattenHierarchy(chapter) {
    let result = [];
    //  add the current chapter to the result array;
    result.push({
        ChapterName: chapter.ChapterName,
        Description: chapter.Description,
        // SubjectName: chapter.SubjectName,
        ParentChapter: chapter.ParentChapter
    });
    //  recursively add children to the result array
    if (chapter.Children && Array.isArray(chapter.Children))
        for (const child of chapter.Children) {
            result = result.concat(flattenHierarchy(child));
        }
    return result;
}
// function flattenHierarchy1(chapter: ChapterHierarchy): any[] {
//     return [
//         {
//             ChapterName: chapter.ChapterName,
//             Description: chapter.Description,
//             SubjectName: chapter.SubjectName,
//             ParentChapter: chapter.ParentChapter
//         },
//         ...(chapter.children??[]).reduce((acc, child) => acc.concat(flattenHierarchy(child)), [])
//     ];
// }
function buildHierarchy(flatChapters) {
    const chapterMap = {};
    flatChapters.forEach((chapterInfo) => {
        const chapterId = chapterInfo.get_chapters_all.id;
        chapterMap[chapterId] = {
            chapter_name: chapterInfo.get_chapters_all.name,
            chapter_id: chapterInfo.get_chapters_all.id,
            desc: chapterInfo.get_chapters_all.description,
            parent_id: chapterInfo.get_chapters_all.parent_id === 'null' ? null : parseInt(chapterInfo.get_chapters_all.parent_id, 10),
            subject_id: chapterInfo.get_chapters_all.subject_id,
            children: [],
        };
    });
    console.log("chapter map", chapterMap);
    Object.values(chapterMap).forEach((chapter) => {
        const parentId = chapter.parent_id;
        console.log("Parent ID:", parentId);
        if (parentId !== null && chapterMap[parentId]) {
            const parentChapter = chapterMap[parentId];
            // Ensuring if the parent chapter has a 'children' property
            if (!parentChapter.children) {
                parentChapter.children = [];
            }
            parentChapter.children.push(chapter);
        }
    });
    const rootChapters = Object.values(chapterMap).filter((chapter) => chapter.parent_id === null);
    console.log("Root chapters:", rootChapters);
    let hierarchyFormat = rootChapters.map((ch) => {
        return {
            ChapterName: ch.chapter_name,
            Description: ch.desc,
            Children: ch.children.map((ch) => {
                return {
                    ChapterName: ch.chapter_name,
                    Description: ch.desc,
                    Children: ch.children.map((ch) => {
                        return {
                            ChapterName: ch.chapter_name,
                            Description: ch.desc,
                            Children: ch.children.map((ch) => {
                                return {
                                    ChapterName: ch.chapter_name,
                                    Description: ch.desc,
                                    Children: ch.children
                                };
                            })
                        };
                    })
                };
            })
        };
    });
    return hierarchyFormat;
}
//  same function but in optimized way:
function buildHierarchy1(flatChapters) {
    const chapterMap = {};
    flatChapters.forEach((chapterInfo) => {
        const chapterId = chapterInfo.get_chapters_all.id;
        chapterMap[chapterId] = {
            ChapterName: chapterInfo.get_chapters_all.name,
            Description: chapterInfo.get_chapters_all.description,
            ParentId: chapterInfo.get_chapters_all.parent_id === 'null' ? null : parseInt(chapterInfo.get_chapters_all.parent_id, 10),
            SubjectId: chapterInfo.get_chapters_all.subject_id,
            Children: [],
        };
    });
    console.log("chapter map", chapterMap);
    Object.values(chapterMap).forEach((chapter) => {
        const parentId = chapter.ParentId;
        console.log("Parent ID:", parentId);
        if (parentId !== null && chapterMap[parentId]) {
            const parentChapter = chapterMap[parentId];
            if (!parentChapter.Children) {
                parentChapter.Children = [];
            }
            parentChapter.Children.push(chapter);
        }
    });
    const hierarchyFormat = Object.values(chapterMap)
        .filter((chapter) => chapter.ParentId === null)
        .map(formatChapter);
    return hierarchyFormat;
}
function formatChapter(chapter) {
    return {
        ChapterName: chapter.ChapterName,
        Description: chapter.Description,
        Children: (chapter.Children || []).map(formatChapter),
    };
}
//   here parent_id should have chapter name;
function buildChapterHierarchy(flatChapters) {
    const chapterMap = {};
    flatChapters.forEach((chapterInfo) => {
        const chapterId = chapterInfo.get_chapters_all.id;
        chapterMap[chapterId] = {
            chapter_name: chapterInfo.get_chapters_all.name,
            chapter_id: chapterInfo.get_chapters_all.id,
            desc: chapterInfo.get_chapters_all.description,
            parent_id: chapterInfo.get_chapters_all.parent_id === 'null' ? null : parseInt(chapterInfo.get_chapters_all.parent_id, 10),
            subject_id: chapterInfo.get_chapters_all.subject_id,
            // parentChapter: chapterInfo.get_chapters_all.parent_id === 'null'?null:
            children: [],
        };
    });
    console.log("chapter map", chapterMap);
    // const serializeChapterMap = (chapter: any) => {
    //   const serializedChapter = { ...chapter };
    //   delete serializedChapter.children; // Exclude children property during serialization
    //   serializedChapter.children = chapter.children.map(serializeChapterMap); // Recursively serialize children
    //   return serializedChapter;
    // };
    Object.values(chapterMap).forEach((chapter) => {
        const parentId = chapter.parent_id;
        console.log("Parent ID:", parentId);
        if (parentId !== null && chapterMap[parentId]) {
            const parentChapter = chapterMap[parentId];
            // Ensuring if the parent chapter has a 'children' property
            if (!parentChapter.children) {
                parentChapter.children = [];
            }
            parentChapter.children.push(chapter);
        }
    });
    // console.log("chapterMap after building hierarchy:", JSON.stringify(Object.values(chapterMap).map(serializeChapterMap)));
    const rootChapters = Object.values(chapterMap).filter((chapter) => chapter.parent_id === null);
    console.log("Root chapters:", rootChapters);
    return rootChapters;
}
exports.default = new SubjectController();
//# sourceMappingURL=subjectController.js.map