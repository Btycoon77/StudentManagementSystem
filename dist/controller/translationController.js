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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
    // using static path (Taking file from the local storage )
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
                //   console.log(result);
                let transformedObject = {
                    data: result
                };
                let finalObject = JSON.stringify(transformedObject);
                const importData = yield connectDb_1.connectDb.query(`select public.insert_translations_from_data(:data)`, {
                    replacements: {
                        data: finalObject,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (!importData) {
                    res.status(400).json("could not import the file");
                }
                // res.status(200).json("Succesfully uploaded the excel file");
                res.status(200).json({
                    result: "data succesfully pushed ",
                    data: finalObject
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
                const excelSheet = yield translationService_1.default.generateExcel(result, 'public/export/translationData.xlsx');
                res.download('public/export/translationData.xlsx', function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                //  delete the file 
                // fs.unlinkSync("public/export/translationData.xlsx");        
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    // using multer 
    importExcelData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Access the uploaded file from req.file
                const uploadFile = req.file;
                console.log("file properties", req.file);
                if (!uploadFile) {
                    return res.status(400).json({
                        error: 'No file uploaded or invalid file format',
                    });
                }
                console.log('File uploaded successfully');
                console.log('File data length', uploadFile.size);
                // Parse excel file using xlsx
                console.log("path is ", `public/${uploadFile.originalname}`);
                // console.log("workbook is",workbook);
                console.log("data is ", uploadFile.buffer);
                const data = [];
                // const sheettNames = workbook.SheetNames;
                // console.log("sheet names",sheettNames);
                const readData = fs_1.default.readFileSync(uploadFile.path);
                const writeData = fs_1.default.writeFileSync('public/ram/Translation.xlsx', readData);
                const workbook = xlsx.readFile('public/ram/Translation.xlsx');
                const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                data.push(...excelData);
                // workbook.SheetNames.forEach((sheetName) => {
                //     const sheet = workbook.Sheets[workbook.SheetName[0]]; 
                //     const sheetData = xlsx.utils.sheet_to_json(sheet) as OriginalData[];
                //     data.push(...sheetData);
                // });
                // Transform the data in a specific format
                const result = transformData(data);
                console.log(result);
                let transformedObject = {
                    data: result
                };
                let finalObject = JSON.stringify(transformedObject);
                const importData = yield connectDb_1.connectDb.query(`select public.insert_translations_from_data(:data)`, {
                    replacements: {
                        data: finalObject,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (!importData) {
                    res.status(400).json("could not import the file");
                }
                // res.status(200).json("Succesfully uploaded the excel file");
                res.status(200).json({
                    result: "data succesfully pushed ",
                    data: finalObject
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error,
                });
            }
        });
    }
    //  using multer + parsing excel file + handling concurrent request
    importExcelData3(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Access the uploaded file from req.file
                const uploadFile = req.file;
                console.log("file props", uploadFile);
                if (!uploadFile) {
                    return res.status(400).json({
                        error: 'No file uploaded or invalid file format',
                    });
                }
                console.log('File uploaded successfully');
                console.log('File data length', uploadFile.size);
                // Generate a unique filename
                const uniqueFilename = `${Date.now()}_${uploadFile.originalname}`;
                // Create the file path
                const filePath = path_1.default.join('public', uniqueFilename);
                console.log("upload file path", uploadFile.path);
                // const readData = fs.readFileSync(uploadFile.buffer);
                // const readData = fs.readFileSync(uploadFile.path);
                // Write the uploaded file to the local storage
                // fs.writeFileSync(filePath, readData);
                // Parse excel file using xlsx
                // const workbook = xlsx.readFile(filePath);
                // read() function is used to read buffer
                // but readFile() is  used to read path;
                const workbook = xlsx.read(uploadFile.buffer);
                const data = [];
                workbook.SheetNames.forEach((sheetName) => {
                    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    data.push(...sheetData);
                });
                // Transform the data in a specific format
                const result = transformData(data);
                console.log(result);
                const transformedObject = {
                    data: result,
                };
                const finalObject = JSON.stringify(transformedObject);
                // Delete the uploaded file
                // fs.unlinkSync(filePath);
                // unlink the file in the public dir
                // fs.unlinkSync(`public/${req.file?.originalname}`)
                const importData = yield connectDb_1.connectDb.query(`select public.insert_translations_from_data(:data)`, {
                    replacements: {
                        data: finalObject,
                    },
                    type: sequelize_1.QueryTypes.SELECT,
                });
                if (!importData) {
                    res.status(400).json('Could not import the file');
                }
                ``;
                res.status(200).json({
                    result: 'Data successfully pushed ',
                    data: finalObject,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error,
                });
            }
        });
    }
    // using express-file upload;
    importExcelData2(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if a file is uploaded
                const uploadedFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.fileName;
                if (!uploadedFile) {
                    return res.status(400).json({
                        error: 'No file uploaded',
                    });
                }
                // Parse the Excel file
                const workbook = xlsx.read(uploadedFile.data);
                console.log("workbook is", workbook);
                const data = [];
                workbook.SheetNames.forEach((sheetName) => {
                    const sheet = workbook.Sheets[sheetName];
                    if (!sheet) {
                        console.error(`Sheet '${sheetName}' not found in the workbook.`);
                        return;
                    }
                    const sheetData = xlsx.utils.sheet_to_json(sheet);
                    data.push(...sheetData);
                });
                //  transform the data in a specific format
                let result = transformData(data);
                console.log("the transformed data is ", result);
                let transformedObject = {
                    data: result
                };
                let finalObject = JSON.stringify(transformedObject);
                const importData = yield connectDb_1.connectDb.query(`select public.insert_translations_from_data(:data)`, {
                    replacements: {
                        data: finalObject,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (!importData) {
                    res.status(400).json("could not import the file");
                }
                // res.status(200).json("Succesfully uploaded the excel file");
                res.status(200).json({
                    result: "data succesfully pushed ",
                    data: finalObject
                });
            }
            catch (error) {
                console.error('Error:', error);
                res.status(500).json({
                    error: 'Internal Server Error',
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