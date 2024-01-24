import { Op, where } from "sequelize";
import  StudentModel, { Student }  from "../models/studentModel";
import { literal } from "sequelize";
import { PaginationParams } from "../utils/utill";
import { connectDb } from "../db/connectDb";
import { NextFunction } from "express";

class StudentService{
   
    
    //  to create student
    async createStudent(studentData:any,):Promise<any>{
        //  check if student exist;

      
            // if(checkStudent >0){
            //     next(Error("student with that name already exists"));
            //     // throw Error("student with that name already exists");
            // }
            return await StudentModel.create(studentData);
            // whatever the name of the column in database it should be the same 
    }

    //  to delete students
    async deleteStudent(guid:any):Promise<boolean>{
        try {
            const student = await StudentModel.findOne({
                where:{
                    guid:guid
                }
            });
            
            if(!student){
                return false;
            }
            console.log("delete student",student);
            await StudentModel.update({datedeleted:new Date()},{where:{
                guid:guid
            }});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    //  hard deleting the student;
    async hardDelete(guid:any):Promise<any>{
        try {
            const student = await StudentModel.findOne({
                where:{
                    guid:guid
                }
            });
            if(!student){
                return false;
            }
            await student.destroy();
            return true;
        } catch (error) {
            console.log(error);
        }
    }


    //  to update the student

    async updateStudent(guid:any,student_name:string,age:number):Promise<boolean>{
        try {
            const student:any = await StudentModel.findOne({
                where:{
                    guid:guid
                }
            });
            if(!student){
                return false
            }
            student.student_name = student_name;
            student.age = age;

            await student.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


     async getListOfStudents(queryParams:any):Promise<any>{
        const {pageSize,page,search,orderBy,orderDir} = queryParams;
  
        const offset = (page -1) *pageSize;

        // const sql= " SELECT * FROM students  WHERE student_name LIKE '%Ram%' ORDER BY student_id ASC LIMIT '10' OFFSET 0;";
        
        // whenver you want to inject sequelize property then make the use of {}
        const students= await StudentModel.findAndCountAll({
          limit:pageSize,
          offset:offset,
        attributes:['guid','student_name','age'],
          where:{
            student_name:{
              [Op.iLike]:`%${search}%`
            },
            datedeleted: {
                [Op.is]: literal('null')
            }
            
          },
          order:[[orderBy,orderDir]]
        });
  
        const totalPages = Math.ceil(students.count/pageSize);
  
        const result = {
        //   pageSize,
        //   page,
        //   totalPages,
          students: students.rows
          
        };
        return result;
  
      }
//  GETTING STUDENT DETAILS ONLY , NO SUBJECT!
      async dbFunctionPagination(params:PaginationParams):Promise<any>{
        try {
            const {pageSize,page,search,orderBy,orderDir} = params;
            const result = await connectDb.query(`SELECT * FROM get_paginated_students(:pageSize, :page, :search, :orderBy, :orderDir)`,
            {
                replacements:{
                    pageSize,page,search,orderBy,orderDir
                }
            });
            // console.log(result);
            return result[0][0];
        } catch (error) {
            console.log(error);
        }
      }
//  getting student and subject join
     async dbFunctionJoinPagination(params:PaginationParams):Promise<any>{
        try {
            const {page,pageSize,search,orderBy,orderDir} = params;
            const result = await connectDb.query(`Select * from getpaginationjoin1(:page,:pageSize,:search,:orderBy,:orderDir)`,{
                replacements:{
                    page,pageSize,search,orderBy,orderDir
                }
            });
            return result[0];
        } catch (error) {
            console.log(error);
        }
     }

     async dbJoin():Promise<any>{
        try {
            
            const result = await connectDb.query(`Select * from get_student_subject_info()`,
            );
            return result[0]
        } catch (error) {
            console.log(error);
        }
     }

    //  get student details by uuid;
}

export default new StudentService();

// {
//     // dont write info
//         "StudentId": "<uuid>",
//         "StudentName":"",
//         "subjects":[
//             {
//                 "SubjectId":"",
//                 "SubjectName":""
//             },{}
//         ]
//     }

    // post ma pagination chahidaian
    // get ma pagination chahinxa;
//  check if student exist

// delete ma json hunuvayena
//  delete grda 204 status code huna pryo
//  update grda , create grda 201.
//  retrieve grda 200 
// authorizatoin error 401.
// bad request 400
// resource not found 404
// internal server error 500
//  validation error(conflict error) 409 (duplicate data error)
// 