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
const puppeteer_1 = __importDefault(require("puppeteer"));
function pdfGenerate(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, tableData, filename } = options;
        const browser = yield puppeteer_1.default.launch({ headless: 'new' });
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1080, height: 1024 });
        yield page.setContent(`
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
  
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">${title}</h1>


            
              ${tableData.map((row) => `
             
              <h3>Student Name: ${row.StudentName}</h3>
              <h3>Age: ${row.Age}</h3>
              <h3>Percentage: ${row.Percentage}</h3>
               
              
              `)}
            </tbody>
          </table>

          <hr/>
        

        <table>
        <thead>
          <tr>
            
            <th>Subject Name</th>
            <th>Subject Marks</th>
          </tr>
        </thead>
        <tbody>
          ${tableData.map((row) => `
        
          <td>${row.Subjects.map((data) => `
          <tr>
          
          <td>${data.SubjectName}</td>
          <td>${data.MarksObtained}</td>
          
          
          `)}</td>
          
          </tr>`)}
        </tbody>
      </table>


        </body>
      </html>
    `);
        yield page.pdf({ path: filename, format: 'A4' });
        yield browser.close();
        console.log(`PDF created successfully: ${filename}`);
    });
}
exports.default = pdfGenerate;
//# sourceMappingURL=pdfHelper.js.map