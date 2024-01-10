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
const chapterService_1 = __importDefault(require("../services/chapterService"));
const connectDb_1 = require("../db/connectDb");
const sequelize_1 = require("sequelize");
class ChapterController {
    // get all chapters;
    getListOfChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryParams = {
                    pageSize: req.query.pageSize,
                    page: req.query.page,
                    search: req.query.search,
                    orderBy: req.query.orderBy,
                    orderDir: req.query.orderDir
                };
                const chapter = yield chapterService_1.default.getListOfChapters(queryParams);
                res.status(200).json(chapter.chapters.map((data) => {
                    return {
                        guid: data.guid,
                        ChapterName: data.chapter_name,
                        // Children: []
                    };
                }));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    // get chapter pagination (making the use of dynamic query)
    getChapterList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageSize = req.query.pageSize;
                const page = req.query.page;
                const search = req.query.search;
                const orderBy = req.query.orderBy;
                const orderDir = req.query.orderDir;
                const chapter = yield connectDb_1.connectDb.query(`select public.getchapterpagination(:pageSize,:page,:search,:orderBy,:orderDir)`, {
                    replacements: {
                        pageSize: pageSize,
                        page: page,
                        search: search,
                        orderBy: orderBy,
                        orderDir: orderDir
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                // res.status(200).json(chapter);
                res.status(200).json(chapter.map((data) => {
                    return {
                        ChapterId: data.getchapterpagination.ChapterId,
                        ChapterName: data.getchapterpagination.ChapterName
                    };
                }));
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
}
exports.default = new ChapterController();
//# sourceMappingURL=chapterController.js.map