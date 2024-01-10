import { NextFunction, Request,Response, query } from "express";
import studentService from "../services/studentService";
import generatePdf from "../services/generatePdf";
import fs from 'fs';
import { connectDb } from "../db/connectDb";
import { QueryTypes } from "sequelize";

class StudentController{
    
    
    //  create student
    async createStudent(req:Request,res:Response,next:NextFunction):Promise<void>{
        const studData = req.body;
        const studentData = {
            student_name: req.body.student_name,
            age: req.body.age,
            datedeleted: null

        };
        
        try {
            const student = await studentService.createStudent(studData,next);
            res.status(201).json({
              
                StudentId:student.guid,
                StudentName: student.student_name,
                Age: student.age
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }

        //  delete student
        async deleteStudent(req:Request,res:Response,next:NextFunction):Promise<void>{
            const guid = req.params.guid;

            try {
                const success = await studentService.deleteStudent(guid);
                if(success){
                    res.status(204).json({
                        success:true,
                        message:"Student deleted succesfully"
                    });
                }else{
                    res.status(404).json({
                        error:"Student not found"
                    })
                }
                
            } catch (error) {
                console.log(error);
                // res.status(500).json({
                //     success:false,
                //     error:"Internal server error"
                // })
                next(error);
            }
        }

//  hard deleting the student;

    async hardDeleteStudent(req:Request,res:Response):Promise<void>{
        const guid = req.params.guid;

        try {
            const success = await studentService.hardDelete(guid);
            if(success){
                res.status(204).json({
                    success:true,
                    message:"Student deleted succesfully"
                });
            }else{
                res.status(404).json({
                    error:"Student not found"
                })
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }


    //  update student
    async updateStudent(req:Request,res:Response):Promise<void>{
        const guid = req.params.guid;
        const{student_name,age} = req.body;
        //  these names should be exact name of the column in database;

        try {
            const success = await studentService.updateStudent(guid,student_name,age);

            if(success){
                res.status(201).json({
                    success:true,
                    message:"Student updated succesfully"
                });
            }else{
                res.status(404).json({
                    error:"Student not found"
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }

    // pagination controller;

     async getListOfStudents(req:Request,res:Response){
        const queryParams = {
            pageSize: req.query.pageSize,
            page:req.query.page,
            search:req.query.search,
            orderBy: req.query.orderBy,
            orderDir: req.query.orderDir
        };
        try {

            const result = await studentService.getListOfStudents(queryParams);
            // res.status(200).json(result.students);
             let data = result.students.map((el:any) =>
                 {
                  return {
                    StudentId:el.guid,
                    StudentName: el.student_name,
                    Age: el.age
                  }  
                
            });
            res.status(200).json(data);
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:"Internal server error"
            })
        }
    }

    async getDBfunctionPagination(req:Request,res:Response):Promise<void>{
        const queryParams = {
            pageSize: parseInt(req.query.pageSize as string),
            page:parseInt(req.query.page as string),
            search:req.query.search as string,
            orderBy: req.query.orderBy as string,
            orderDir: req.query.orderDir as string
        };
        try {
            const result  = await studentService.dbFunctionPagination(queryParams);
            console.log("from controller",result);
            res.status(201).send(result);
            
        } catch (error) {
            res.status(501).json({error:"Internal server error"});
        }
    }


    async getDBfunctionJoinPagination(req:Request,res:Response):Promise<void>{
        const queryParams = {
            pageSize: parseInt(req.query.pageSize as string),
            page:parseInt(req.query.page as string),
            search:req.query.search as string,
            orderBy: req.query.orderBy as string,
            orderDir: req.query.orderDir as string
        };
        
        try {
            const result  = await studentService.dbFunctionJoinPagination(queryParams);
            // console.log("from join pagination controller",result);
            // res.status(200).json(result[0]);

            // const totalMarks = await connectDb.query(`select sum(marksobtained) as totalmarks 
            // from studentsubjects 
            // where student_id =${StudentId}
            // group by student_id`,{
            //   type:QueryTypes.SELECT
            // });
    
            // console.log(totalMarks)
            // let [percentage] = totalMarks.map((data:any)=> data.totalmarks);
            // let totalMarks;
            // for(const total of result.Subjects){
            //     totalMarks += subject.MarksObtained;
            // }

            res.status(200).json({
                StudentId: result[0].student_id,
                StudentName: result[0].student_name,
                // Percentage: ,
                // Percentage:`${parseInt(percentage)/300*100}%`,
                Subjects: result[0].subjects.map((sub:any)=>{
                    return {
                        SubjectId: sub.subject_id,
                        SubjectName: sub.subject_name,
                        SubjectMarks: sub.subject_marks
                    }
                })
            });
            
        } catch (error) {
            res.status(500).json({error:"Internal server error"});
        }
    }

    // join
    async getJoinData(req:Request,res:Response):Promise<any>{
        try {
            const result = await studentService.dbJoin();
            console.log('db join ',result);
            res.status(201).json({
                result:result
            });
        } catch (error) {
            console.log(error);
            res.status(501).json({
                error:"INternal server error"
            })
        }
    }

    async  generatePDFController(req: Request, res: Response): Promise<void> {
        
        try {
            const { StudentId } = req.params;
        
            // Generate a unique filename
            const filename = `studentInfo.pdf`;
            const filePath = `./pdfs/${filename}`; // Specify the desired directory
        
            // Create a writable stream to write the PDF content to a file
            const stream = fs.createWriteStream(filePath);
        
            // Generate and write the PDF content to the stream
            await generatePdf(StudentId, stream);
        
            res.status(200).json({
              message: 'PDF generated successfully',
              filePath,
            });
        
          } catch (error) {
            console.error(error);
            res.status(500).json({
              error: 'Internal server error',
            });
          }
        }
}

export default new StudentController();