"use strict";
// import { Request,Response } from "express";
// import studentSubjectService from "../services/studentSubjectService";
// interface StudentSubjectAttributes{
//     student_id:number;
//     subject_id: number;
//   }
// class StudentSubjectController{
//     //  get all students;
//     //  create student
//     async addSubjecctsToStudent(req:Request,res:Response):Promise<void>{
//         const student_id = req.body.student_id;
//         const subjectToAdd = req.body.subjects as any;
//         try {
//             const student =await  studentSubjectService.addSubjectToStudent(student_id,subjectToAdd);
//             res.status(200).json({})
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({
//                 success:false,
//                 error:"Internal server error"
//             })
//         }
//     }
// }
