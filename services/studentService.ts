import { Op, where } from "sequelize";
import  StudentModel, { Student }  from "../models/studentModel";
import { literal } from "sequelize";
import { PaginationParams } from "../utils/utill";
import { connectDb } from "../db/connectDb";

class StudentService{
   
    //  to get all students
    async getAllStudents():Promise<any[]>{
        return await StudentModel.findAll({
            where:{
                datedeleted:{
                    [Op.is]:literal('null')
                }
            }
        });
    }
    
    //  to create student
    async createStudent(studentData:Student):Promise<any>{
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
            // alterntively I can do this too.
            // const result = await StudentModel.destroy({
            //     where:{
            //         student_id:studentId
            //     }
            // });
            if(!student){
                return false;
            }
            await student.update({datedeleted: literal('NULL')});
            return true;
        } catch (error) {
            console.log(error);
            return false;
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

     async getPaginatedStudents(queryParams:any):Promise<any>{
        const {pageSize,page,search,orderBy,orderDir} = queryParams;
  
        const offset = (page -1) *pageSize;

        // const sql= " SELECT * FROM students  WHERE student_name LIKE '%Ram' ORDER BY student_id ASC LIMIT '10' OFFSET 0;";
        
        // whenver you want to inject sequelize property then make the use of {}
        const students= await StudentModel.findAndCountAll({
          limit:pageSize,
          offset:offset,
          where:{
            student_name:{
              [Op.iLike]:`%${search}`
            },
            
          },
          order:[[orderBy,orderDir]]
        });
  
        const totalPages = Math.ceil(students.count/pageSize);
  
        const result = {
          pageSize,
          page,
          totalPages,
          students: students.rows
          
        };
        return result;
  
      }

      async dbFunctionPagination(params:PaginationParams):Promise<any>{
        try {
            const {pageSize,page,search,orderBy,orderDir} = params;
            const result = await connectDb.query(`SELECT * FROM get_paginated_studentss(:pageSize, :page, :search, :orderBy, :orderDir)`,
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

}

export default new StudentService();