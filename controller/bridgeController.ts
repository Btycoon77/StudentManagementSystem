import { NextFunction, Request,Response } from "express";
import BridgeService from "../services/BridgeService";
import StudentModel from "../models/studentModel";
import { BridgeModel } from "../models/bridgeModel";
import SubjectModel from "../models/subjectModel";
import { Op, QueryTypes, literal } from "sequelize";
import { connectDb } from "../db/connectDb";
import pdfGenerate from "../utils/pdfHelper";


class BridgeController{

    
    async  getStudentSubjectPagination(req:Request,res:Response):Promise<any>{
        const queryParams = {
            pageSize: req.query.pageSize,
            page:req.query.page,
            search:req.query.search,
            orderBy: req.query.orderBy,
            orderDir: req.query.orderDir
        };
        try {
            const result = await BridgeService.studentSubjectPagination(queryParams);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:"Internal server error"
            })
        }
    }

    async getStudentsWithSubjects(req:Request,res:Response):Promise<any>{
        try {
            const result = await BridgeService.getStudentsWithSubjects();
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:"Internal server error"
            })
        }
    }
    
    
    // get student by id

    async getStudentById(req:Request,res:Response):Promise<void>{
        try {
            const guid = req.params.guid;
            const result = await BridgeService.getStudentByID(guid);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                error:"Internal server error"
            })
        }
    }

    async getStudentByIdFromDB(req:Request,res:Response,next:NextFunction):Promise<any>{
      try {
        const StudentId = req.params.guid;
        
        

        const StudentInfo = await connectDb.query(`select public.getstudentbyid(:StudentId)`,{
          replacements:{
            StudentId   // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
          },
          type:QueryTypes.SELECT
        });

        console.log(StudentInfo);

        // const totalMarks = await connectDb.query(`select sum(marksobtained) as totalmarks 
        // from studentsubjects 
        // where student_id =${StdId}
        // group by student_id`,{
        //   type:QueryTypes.SELECT
        // });

        // console.log(totalMarks)
        // let [percentage] = totalMarks.map((data:any)=> data.totalmarks);
      


        // console.log(percentage);
        // StudentInfo??next((Error("student doesnt exist")))
        // if(StudentInfo.filter((data:any)=>data.getstudentbyid === null))
        // {
        //   next( Error("Student does not exist"));
        // }
        // else{
        let student = StudentInfo.map((std:any)=>{
            return {
            StudentId: StudentId,
            StudentName: std.getstudentbyid.StudentName,
            Age: std.getstudentbyid.age,
            MarkObtained:std.getstudentbyid.total ,
            TotalMarks: std.getstudentbyid.totalMarks,
            Percentage: `${parseInt(std.getstudentbyid.total)/(std.getstudentbyid.totalMarks)*100}%`,
            Subjects: std.getstudentbyid.Subjects,
            }
        })
        res.status(200).json(student[0]);

         //  generate the pdf
         pdfGenerate({
          title:"Student Info",
          tableData: student,
          filename:`studentInfo.pdf`
        });
      
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error:"Internal server error"
        })
      }
    }

    async marksObtained(req:Request,res:Response):Promise<any>{
      try {
        const StudentId = req.params.StudentId;
        const StudentName = req.body.StudentName;
        const age = req.body.age;
        const subjects = JSON.stringify(req.body.Subjects); 
        // const MarksObtained = req.body.MarksObtained;

        const result = await connectDb.query(`select public.checkbox_new2(:StudentId,:StudentName,:age,:subjects)`,{
          replacements:{
            StudentId,StudentName,age,subjects   // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
          },
          type:QueryTypes.SELECT
        });
       
        res.status(200).json({
          
          result:"Subject assinged succesfully"
        })

      } catch (error) {
        console.log(error);
        res.status(500).json({
          error:"Internal server error"
        })
      }
    }



    async assignSubject(req:Request,res:Response):Promise<any>{
      try {
        const StudentId = req.params.StudentId;
        const StudentName = req.body.StudentName;
        const age = req.body.age;
        const subjects = JSON.stringify(req.body.Subjects);  //while calling the sql function from api we need to jsonify object if that is array 

//        this sql function is for the upsert case;

        // const result = await connectDb.query(`select public.upsert_student_and_subject(:StudentName,:age,:subjects,:StudentId)`,{
        //   replacements:{
        //     StudentName,age,subjects,StudentId   // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
        //   },
        //   type:QueryTypes.SELECT
        // });

        // this sql function is for  checkbox insert/delete update)

        const result = await connectDb.query(`select public.checkbox_new1(:StudentId,:StudentName,:age,:subjects)`,{
          replacements:{
            StudentId,StudentName,age,subjects   // here replacement should be exact variable name in the above function parameters and req.body variables and replacement variables;
          },
          type:QueryTypes.SELECT
        });

        res.status(200).json({
          
          result:"Subject assinged succesfully"
        })
      } catch (error) {
        console.log("from assign subject"+error);
        res.status(500).json({
          
          error:"Internal server error"
        })
      }
    }


    //  choose/assign  subject by students

    // async assignSubject(req:Request,res:Response):Promise<any>{
    //         try {
    //             const { StudentId, StudentName, age, Subjects } = req.body;
    //             await BridgeService.assignSubject(StudentId, StudentName, age, Subjects);
    //             res.status(200).json({ message: 'Subjects assigned successfully' }); 
    //         } catch (error) {
    //             res.status(500).json({
    //                 error:"Internal server error"
    //             })
    //         }
    // }


    async  assignSubjects(req: Request, res: Response): Promise<void> {
        const { student_id, Subjects ,student_name,age} = req.body;
        // choosenSubject is an array;
      
        try {
          // Step 1: Check if the student with the provided guid exists
          const existingStudent = await StudentModel.findOne({
            where: {
              guid: student_id,
              datedeleted:{
                [Op.is]:literal('null')
              }
            },
          });
      
          let studentId: number;
          let student: any;
      
          if (existingStudent) {
            // Student exists, update the ex0isting student
           student =   await StudentModel.update(
              // Update student attributes if needed
              {
               student_name:student_name ,
               age:age
              },
              {
                where: {
                  guid: student_id,
                },
              }
            );
      
          } else {
            // Student doesn't exist, create a new student
              student = await StudentModel.create({
              student_name,age
              
              
            });
      
            studentId = student.student_id;
          }
      
          const chosenSubjectIds = [];
      
          // Step 2: Loop through chosen subjects
          for (const subjectName of Subjects) {
            // Step 3: Check if the subject with the provided name exists
            const existingSubject = await SubjectModel.findOne({
              where: {
                subject_name: subjectName,
              },
            });
      
            let subjectId: number;
            let subjectNames: string;
      
            if (existingSubject) {
              // Subject exists, update the existing subject if needed
              let subject = await SubjectModel.update(
              {
                subject_name:subjectName 
               },
               {
                 where: {
                  //  subject_id: subjectId 
                 },
               });
      
              subjectId = existingSubject.dataValues.subject_id
            } else {
              // Subject doesn't exist, create a new subject
              const newSubject = await SubjectModel.create({
                subject_name: subjectName
              });
      
              subjectNames = newSubject.dataValues.subject_name;
              
              // Step 4: Push subjectId to chosenSubjectIds array
              chosenSubjectIds.push(subjectNames);
            
            
            
            }
      
      
            // Step 5: Check if the student has already chosen this subject
            const existingBridgeRecord = await BridgeModel.findOne({
              where: {
                student_id: student_id,
                // subject_id: subjectId,
              },
            });
      
            if (!existingBridgeRecord) {
              // Student hasn't chosen this subject, insert a new record in BridgeModel
              await BridgeModel.create({
                student_id: student_id,
                // subject_id: subjectId,
                // Add other attributes as needed
              });
            }
          }
      
          res.status(200).json({
            message: 'Subjects chosen and updated successfully',
          });
        } catch (error) {
          console.error('Error in chooseSubjects:', error);
          res.status(500).json('Internal server error');
        }
      }
      
}

export default  new BridgeController();

