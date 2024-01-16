"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const connectDb_1 = require("../db/connectDb");
const sequelize_1 = require("sequelize");
const xlsx = __importStar(require("xlsx"));
const translationService_1 = __importDefault(require("../services/translationService"));
class TranslationController {
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ItemCode = req.body.itemcode;
                const translations = req.body.translations;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    importExcelData1(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // handling the file upload
                // while testing in the postman go body>form-data>
                // in key-value pair, select type 'file';
                let uploadFile = req.query.fileName;
                const data = [];
                const file = xlsx.readFile('public/' + uploadFile + ".xlsx");
                const sheetNames = file.SheetNames;
                for (let i = 0; i < sheetNames.length; i++) {
                    const arr = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
                    arr.forEach((res) => {
                        data.push(res);
                    });
                }
                //  transform the data in a specific format
                let result = transformData(data);
                console.log(result);
                const importData = yield connectDb_1.connectDb.query(`select public.insert_translations_from_data(:data)`, {
                    replacements: {
                        data: result,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (!importData) {
                    res.status(400).json("could not import the file");
                }
                // res.status(200).json("Succesfully uploaded the excel file");
                res.status(200).json({
                    result: "data succesfully pushed ",
                    data: result
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    exportDataToDb(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = null;
                const getData = yield connectDb_1.connectDb.query(`select public.get_all_items(:data)`, {
                    replacements: {
                        data: language,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                const result = getData.map((item) => item.get_all_items[0]);
                const excelSheet = yield translationService_1.default.generateExcel(result, 'public/translationData.xlsx');
                res.status(200).json({
                    result: "Excel file generated succesfully"
                });
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
function transformData(originalData) {
    return originalData.map(item => {
        return {
            itemcode: item.ItemCode,
            translations: [
                {
                    text: item.EN,
                    language: 'EN'
                },
                {
                    text: item.NP,
                    language: 'NP'
                }
            ]
        };
    });
}
exports.default = new TranslationController();
//# sourceMappingURL=translationController.js.map