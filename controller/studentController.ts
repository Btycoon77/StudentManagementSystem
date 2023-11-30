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
        const studentData = req.body;
        
        try {
            const student = await studentService.createStudent(studentData);
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
            const guid = req.params.guid;

            try {
                const success = await studentService.deleteStudent(guid);
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

     async getPaginatedStudents(req:Request,res:Response){
        const queryParams = {
            pageSize: req.query.pageSize,
            page:req.query.page,
            search:req.query.search,
            orderBy: req.query.orderBy,
            orderDir: req.query.orderDir
        };
        try {

            const result = await studentService.getPaginatedStudents(queryParams);
            res.status(201).json(result);
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
}

export default new StudentController();