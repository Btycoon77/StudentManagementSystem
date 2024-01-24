import { Request,Response } from "express";
import { connectDb } from "../db/connectDb";
import { QueryTypes } from "sequelize";
import fileUpload from "express-fileupload";
import *  as xlsx from 'xlsx';
import { OriginalData, TransformedData } from "../utils/utill";
import translationService from "../services/translationService";
import path from "path";
import fs from 'fs';

class TranslationController{

    async createItem(req:Request,res:Response):Promise<any>{
        try {
            const ItemCode = req.body.itemcode;
            const translations = req.body.translations;

            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:error
            })
        }
    }

// using static path (Taking file from the local storage )

    async importExcelData1(req:Request,res:Response):Promise<any>{
        try {
            // handling the file upload
            // while testing in the postman go body>form-data>
            // in key-value pair, select type 'file';

            let uploadFile  = req.query.fileName;
            const  data: OriginalData[] = [];

            const file = xlsx.readFile('public/'+uploadFile+".xlsx");
            const sheetNames = file.SheetNames;

            for(let i = 0;i<sheetNames.length;i++){
                const arr = xlsx.utils.sheet_to_json(
                    file.Sheets[sheetNames[i]]
                    
                );
                arr.forEach((res:any)=>{
                    data.push(res);
                })
            }

              //  transform the data in a specific format
              let result = transformData(data);
            //   console.log(result);
           
            
            let  transformedObject = {
                data: result
            }

            let finalObject = JSON.stringify(transformedObject);



            const importData = await connectDb.query(`select public.insert_translations_from_data(:data)`,{
                replacements:{
                    data:finalObject,
                    
                },
                type:QueryTypes.SELECT
            });

            if(!importData){
                res.status(400).json("could not import the file");
            }
            // res.status(200).json("Succesfully uploaded the excel file");
            res.status(200).json({
                result:"data succesfully pushed ",
                data: finalObject
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:error
            })
        }
    }

    async exportDataToDb(req:Request,res:Response):Promise<any>{
        try {
         const language = null;
         
        const getData = await connectDb.query(`select public.get_all_items(:data)`,{
            replacements:{  
                data:language,
                
            },
            type:QueryTypes.SELECT
        });
        const result = getData.map((item:any)=>item.get_all_items[0]);
        


        const excelSheet = await translationService.generateExcel(result,'public/export/translationData.xlsx');
        
        res.download('public/export/translationData.xlsx',function(err){
          if(err){

            console.log(err);
          }
        })
        //  delete the file 
        // fs.unlinkSync("public/export/translationData.xlsx");        
        
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:error
            })
        }
    }

    // using multer 

    async  importExcelData(req: Request, res: Response): Promise<any> {
        try {
            // Access the uploaded file from req.file
            const uploadFile = req.file;
            console.log("file properties",req.file);
            if (!uploadFile ) {
                return res.status(400).json({
                    error: 'No file uploaded or invalid file format',
                });
            }
    
            console.log('File uploaded successfully');
            console.log('File data length', uploadFile.size);
    
            // Parse excel file using xlsx
           

            console.log("path is ",`public/${uploadFile.originalname}`);
            // console.log("workbook is",workbook);

            console.log("data is ",uploadFile.buffer);
            
            const data: OriginalData[] = [];

            // const sheettNames = workbook.SheetNames;
            // console.log("sheet names",sheettNames);

            const readData = fs.readFileSync(uploadFile.path);

            const writeData = fs.writeFileSync('public/ram/Translation.xlsx',readData);

           
            
            const workbook = xlsx.readFile('public/ram/Translation.xlsx')
            
            const excelData =xlsx.utils.sheet_to_json(
                workbook.Sheets[workbook.SheetNames[0]],// get the entire row of the sheet.(only first row)
                // {
                // //   "header": 1,
                // //   "blankrows": false,
                // }
              ) as OriginalData[];

              

              data.push(...excelData);

    
            // workbook.SheetNames.forEach((sheetName) => {

            //     const sheet = workbook.Sheets[workbook.SheetName[0]]; 
                
            //     const sheetData = xlsx.utils.sheet_to_json(sheet) as OriginalData[];
            //     data.push(...sheetData);
            // });
    
            // Transform the data in a specific format
            const result = transformData(data);
            console.log(result);
    
            let  transformedObject = {
                data: result
            }

            let finalObject = JSON.stringify(transformedObject);



            const importData = await connectDb.query(`select public.insert_translations_from_data(:data)`,{
                replacements:{
                    data:finalObject,
                    
                },
                type:QueryTypes.SELECT
            });

        
            if(!importData){
                res.status(400).json("could not import the file");
            }
            // res.status(200).json("Succesfully uploaded the excel file");


            res.status(200).json({
                result:"data succesfully pushed ",
                data: finalObject
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: error,
            });
        }
    }
    
//  using multer + parsing excel file + handling concurrent request

    async  importExcelData3(req: Request, res: Response): Promise<any> {
        try {
            // Access the uploaded file from req.file
            const uploadFile = req.file;
            console.log("file props",uploadFile);

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
            const filePath = path.join('public', uniqueFilename);

            console.log("upload file path",uploadFile.path);

            // const readData = fs.readFileSync(uploadFile.buffer);
            // const readData = fs.readFileSync(uploadFile.path);


            // Write the uploaded file to the local storage
            // fs.writeFileSync(filePath, readData);

            // Parse excel file using xlsx
            // const workbook = xlsx.readFile(filePath);
            // read() function is used to read buffer
            // but readFile() is  used to read path;
            const workbook = xlsx.read(uploadFile.buffer);

            const data: OriginalData[] = [];

            workbook.SheetNames.forEach((sheetName) => {
                const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]) as OriginalData[];
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

            const importData = await connectDb.query(`select public.insert_translations_from_data(:data)`, {
                replacements: {
                    data: finalObject,
                },
                type: QueryTypes.SELECT,
            });

            if (!importData) {
                res.status(400).json('Could not import the file');
            }``

            res.status(200).json({
                result: 'Data successfully pushed ',
                data: finalObject,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: error,
            });
        }
    }





// using express-file upload;

    async importExcelData2(req:Request,res:Response):Promise<any>{

        try {
            // Check if a file is uploaded
            const uploadedFile = req.files?.fileName as fileUpload.UploadedFile;
            if (!uploadedFile) {
              return res.status(400).json({
                error: 'No file uploaded',
              });
            }
       
            // Parse the Excel file
            const workbook = xlsx.read(uploadedFile.data);
           
            console.log("workbook is",workbook);

            
            const data: OriginalData[] = [];

            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
    
                if (!sheet) {
                    console.error(`Sheet '${sheetName}' not found in the workbook.`);
                    return;
                }
    
                const sheetData = xlsx.utils.sheet_to_json(sheet) as OriginalData[];
                data.push(...sheetData);
            });
    


            //  transform the data in a specific format
            let result = transformData(data);
            console.log("the transformed data is ",result);
            
            let  transformedObject = {
                data: result
            }

            let finalObject = JSON.stringify(transformedObject);



            const importData = await connectDb.query(`select public.insert_translations_from_data(:data)`,{
                replacements:{
                    data:finalObject,
                    
                },
                type:QueryTypes.SELECT
            });

            if(!importData){
                res.status(400).json("could not import the file");
            }
            // res.status(200).json("Succesfully uploaded the excel file");
            res.status(200).json({
                result:"data succesfully pushed ",
                data: finalObject
            });
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
              error: 'Internal Server Error',
            });
          }



    }
    

}


function transformData(originalData: OriginalData[]): TransformedData[] {
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



export default new TranslationController();