import { NextFunction, Request,Response, query } from "express";
import studentService from "../services/studentService";
import generatePdf from "../services/generatePdf";
import fs from 'fs';
import { connectDb } from "../db/connectDb";
import { QueryTypes, where } from "sequelize";
import StudentModel from "../models/studentModel";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

class StudentController{
    
    
    //  create student
    async createStudent(req:Request,res:Response,next:NextFunction):Promise<any>{
        
        const studentData = {
            student_name: req.body.student_name,
            age: req.body.age,
            email: req.body.email,
            password:req.body.password

        };
        
        try {

            const existingStudent = await StudentModel.findOne({
                where:{
                    email: studentData.email
                }
            });

            if(existingStudent){
                //  if you dont put a return here then code will execute to the next line else code stops at this point
               return res.status(409).json({
                    message:"User already exists"
                });
                
            }
            const password  = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            console.log(hashedPassword);
            // req.body.password = hashedPassword;
            const student = await studentService.createStudent({
                student_name:studentData.student_name,
                age: studentData.age,
                password: hashedPassword,
                email:studentData.email
            });
            res.status(201).json({
                data:student
            }            );
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }

    // login handler
    async loginController(req:Request,res:Response):Promise<any>{
        try {
            const student = await StudentModel.findOne({
                where:{
                    email: req.body.email
                }
            });

            if(!student){
                res.status(400).json({
                    message:'User not found'
                })
            }
            // console.log(student)
            // res.status(200).json(student);
            console.log("password",student?.dataValues.password);
            const isMatched = await bcrypt.compare(req.body.password,student?.dataValues.password);


            if(!isMatched){
                res.status(409).json({
                    message:"Invalid email or password"
                });
            }
            const guid = student?.dataValues.guid ;
            // const JWT_SECRET ='bc6e5b4d-fc7c-425b-b580-afcb08d1e88a';
          
            const token =  jwt.sign(guid,process.env.JWT_SECRET as string);
            console.log(token);

            res.status(200).json({
                message:"Login success",
                token:token
            })
        } catch (error) {
            res.status(500).json({
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