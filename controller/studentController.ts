import { Request,Response } from "express";
import studentService from "../services/studentService";

class StudentController{
    
    //  get all students;
    async  getAllStudents(req:Request,res:Response):Promise<void>{
        try {
            const students = await studentService.getAllStudents();
            res.status(200).json({
                success: true,
                data: students
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }
    //  create student
    async createStudent(req:Request,res:Response):Promise<void>{
        const {student_name,age} = req.body;
        
        try {
            const student = await studentService.createStudent(student_name,age);
            res.status(201).json({
                success:true,
                data:student
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }

        //  delete student
        async deleteStudent(req:Request,res:Response):Promise<void>{
            const studentId = req.params.id;

            try {
                const success = await studentService.deleteStudent(studentId);
                if(success){
                    res.status(201).json({
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
        const studentId = req.params.id;
        const{student_name,age} = req.body;
        //  these names should be exact name of the column in database;

        try {
            const success = await studentService.updateStudent(studentId,student_name,age);

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
}

export default new StudentController();