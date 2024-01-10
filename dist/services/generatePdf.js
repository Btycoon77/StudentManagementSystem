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
const fs_1 = __importDefault(require("fs"));
const connectDb_1 = require("../db/connectDb");
const sequelize_1 = require("sequelize");
const pdfkit_1 = __importDefault(require("pdfkit"));
function generatePdf(StudentId, stream) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const studentInfo = yield connectDb_1.connectDb.query(`SELECT public.getstudentbyid(:StudentId)`, {
                replacements: { StudentId },
                type: sequelize_1.QueryTypes.SELECT
            });
            if (studentInfo.length === 0) {
                throw new Error('Student not found');
            }
            const student = studentInfo.map((std) => {
                return {
                    StudentId,
                    StudentName: std.getstudentbyid.StudentName,
                    Age: std.getstudentbyid.age,
                    Percentage: `${(std.getstudentbyid.percentage) / 300 * 100}%`,
                    Subjects: std.getstudentbyid.Subjects,
                };
            });
            //   create a new PDF document
            const doc = new pdfkit_1.default();
            const filename = `studentInfo.pdf`;
            const filePath = `./pdfs/${filename}`;
            //  pipe the pdf content to writable stream
            const stream = fs_1.default.createWriteStream(filePath);
            doc.pipe(stream);
            // adding content to pdf;
            doc.fontSize(16).text('Student Information', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Student ID: ${student[0].StudentId}`);
            doc.fontSize(14).text(`Student Name: ${student[0].StudentName}`);
            doc.fontSize(14).text(`Age: ${student[0].Age}`);
            doc.fontSize(14).text(`Percentage: ${student[0].Percentage}`);
            doc.moveDown();
            doc.fontSize(14).text('Subjects:');
            student[0].Subjects.forEach((subject) => {
                doc.fontSize(12).text(`- ${subject.SubjectName} (ID: ${subject.SubjectId})`);
            });
            doc.end();
            return filePath;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.default = generatePdf;
//# sourceMappingURL=generatePdf.js.map