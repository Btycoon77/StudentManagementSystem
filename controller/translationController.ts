import { Request,Response } from "express";
import { connectDb } from "../db/connectDb";
import { QueryError, QueryTypes } from "sequelize";
import fileUpload from "express-fileupload";
import *  as xlsx from 'xlsx';
import { OriginalData, Payload, TransformedData } from "../utils/utill";
import translationService from "../services/translationService";
import path from "path";

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
              console.log(result);


            const importData = await connectDb.query(`select public.insert_translations_from_data(:data)`,{
                replacements:{
                    data:result,
                    
                },
                type:QueryTypes.SELECT
            });

            if(!importData){
                res.status(400).json("could not import the file");
            }
            // res.status(200).json("Succesfully uploaded the excel file");
            res.status(200).json({
                result:"data succesfully pushed ",
                data: result
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
        

        const excelSheet = await translationService.generateExcel(result,'public/translationData.xlsx');
        
        res.status(200).json({
          
            result: "Excel file generated succesfully"
        })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:error
            })
        }
    }

    
    // async importExcelData(req:Request,res:Response):Promise<any>{
    //     try {
    //         // handling the file upload
    //         // while testing in the postman go body>form-data>
    //         // in key-value pair, select type 'file';

    //         const uploadFile  = req.files?.fileName as fileUpload.UploadedFile;

    //         if(!uploadFile){
    //             return res.status(400).json({
    //                 error: "No file uploaded"
    //             });
    //         }else{
    //             console.log("file uploaded succesfully");
    //         }
            
    //         console.log("file data length",uploadFile.size);
    //         // parse excel file
            
    //        const workbook =  xlsx.read(uploadFile.data,{
    //         type:'buffer'
    //        });

    //        console.log("workbook",workbook);
    //        let data:unknown[]=[];

    //        const sheetNames = workbook.SheetNames;
    //        console.log("length",sheetNames.length);
    //        console.log("Sheet names",sheetNames);

    //        for (let i = 0; i < sheetNames.length; i++) {
    //         const sheetName = sheetNames[i];
    //         const sheet = workbook.Sheets[sheetName];
    //         const sheetData = xlsx.utils.sheet_to_json(sheet);
          
    //         console.log(`Sheet ${sheetName} data:`, sheetData);
          
    //         sheetData.forEach((row) => {
    //           data.push(row);
    //         });

    //       }
    //       console.log("data",data);
    //         res.status(200).json({
    //             result:"data succesfully pushed ",
    //             data: data
    //         })
           
    //     //    access sheets and rows
    //     // workbook.SheetNames.forEach(sheetName=>{
    //     //     console.log("Sheet Name",sheetName);
    //     //     const sheet = workbook.Sheets[sheetName];
    //     //     console.log("sheet",sheet);
    //     //     const sheetData = xlsx.utils.sheet_to_json(sheet);
    //     //     sheetData.forEach((res)=>{
    //     //             data.push(res);
    //     //     });
    //     //     console.log("sheet data",data);
    //     //     console.log(`Sheet ${sheetName} data:`,sheetData);
    //     // })
            

    //         // const importData = await connectDb.query(`select public.import_excel_data(:filePath)`,{
    //         //     replacements:{
    //         //         uploadFile:uploadFile,
                    
    //         //     },
    //         //     type:QueryTypes.SELECT
    //         // });

    //         // if(!importData){
    //         //     res.status(400).json("could not import the file");
    //         // }
    //         // res.status(200).json("Succesfully uploaded the excel file");
            
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({
    //             error:error
    //         })
    //     }
    // }

    // async importExcelData2(req:Request,res:Response):Promise<any>{

    //     try {
    //         // Check if a file is uploaded
    //         const uploadedFile = req.files?.fileName as fileUpload.UploadedFile;
    //         if (!uploadedFile) {
    //           return res.status(400).json({
    //             error: 'No file uploaded',
    //           });
    //         }
        
    //         // Parse the Excel file
    //         const workbook = xlsx.read(uploadedFile.data, { type: 'buffer' });
        
    //         const data: OriginalData[] = [];
    //         const sheetNames = workbook.SheetNames;
        
    //         // Process each sheet
    //         for (let i = 0; i < sheetNames.length; i++) {
    //           const arr = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[i]]);
    //           arr.forEach((row:any) => {
    //             data.push(row);
    //           });
    //         }
            
    //         //  transform the data in a specific format
    //         let result = transformData(data);
    //         console.log(result);

    //         // Send response with processed data
    //         res.status(200).json({
    //           result: 'Data successfully processed',
    //           data: result,
    //         });
    //       } catch (error) {
    //         console.error('Error:', error);
    //         res.status(500).json({
    //           error: 'Internal Server Error',
    //         });
    //       }



    // }
    

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