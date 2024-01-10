import fs from 'fs';
import { connectDb } from '../db/connectDb';
import { QueryTypes } from 'sequelize';
import PDFDocument, { file } from 'pdfkit';

async function generatePdf(StudentId: string,stream:NodeJS.WritableStream):Promise<any>{
    try {
        const studentInfo = await  connectDb.query(`SELECT public.getstudentbyid(:StudentId)`, {
            replacements: { StudentId },
            type: QueryTypes.SELECT
          });
      
          if (studentInfo.length === 0) {
            throw new Error('Student not found');
          }
      
          const student = studentInfo.map((std: any) => {
            return {
              StudentId,
              StudentName: std.getstudentbyid.StudentName,
              Age: std.getstudentbyid.age,
              Percentage: `${(std.getstudentbyid.percentage) / 300 * 100}%`,
              Subjects: std.getstudentbyid.Subjects,
            };
          });

        //   create a new PDF document

        const doc =  new PDFDocument();

        const filename = `studentInfo.pdf`;
        const filePath =  `./pdfs/${filename}`;

        //  pipe the pdf content to writable stream

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // adding content to pdf;

        doc.fontSize(16).text('Student Information',{align:'center'});
        doc.moveDown();

        doc.fontSize(14).text(`Student ID: ${student[0].StudentId}`);
        doc.fontSize(14).text(`Student Name: ${student[0].StudentName}`);
        doc.fontSize(14).text(`Age: ${student[0].Age}`);
        doc.fontSize(14).text(`Percentage: ${student[0].Percentage}`);
        doc.moveDown();

        doc.fontSize(14).text('Subjects:');

        student[0].Subjects.forEach((subject:any) => {
            doc.fontSize(12).text(`- ${subject.SubjectName} (ID: ${subject.SubjectId})`);
        });

        doc.end();
        return filePath;
      
    } catch (error) {
        console.log(error);
    }
}

export default generatePdf;