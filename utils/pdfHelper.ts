import fs from 'fs';
import puppeteer from 'puppeteer';


async function pdfGenerate(options:any):Promise<any>{

    const { title, tableData, filename } = options;

    const browser = await puppeteer.launch({headless:'new'});
    const page = await browser.newPage();

    await page.setViewport({width:1080,height:1024});

  
    await page.setContent(`
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


            
              ${tableData.map((row:any)=>`
             
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
          ${tableData.map((row:any)=>`
        
          <td>${row.Subjects.map((data:any)=>`
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
  
    await page.pdf({ path: filename, format: 'A4' });
  
    await browser.close();
  
    console.log(`PDF created successfully: ${filename}`);
  }


export default pdfGenerate;