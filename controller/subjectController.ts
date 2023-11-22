import { Request,Response } from "express";
import subjectService from "../services/subjectService";

class SubjectController{
    
    //  get all subjects;
    async  getAllSubjects(req:Request,res:Response):Promise<void>{
        try {
            const subject = await subjectService.getAllSubjects();
            res.status(200).json({
                success: true,
                data: subject
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }
    //  create subject
    async createSubject(req:Request,res:Response):Promise<void>{
        const {subject_name} = req.body;
        
        try {
            const subject = await subjectService.createSubject(subject_name);
            res.status(201).json({
                success:true,
                data:subject
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:"Internal server error"
            })
        }
    }

        //  delete subject
        async deleteSubject(req:Request,res:Response):Promise<void>{
            const subjectId = req.params.id;

            try {
                const success = await subjectService.deleteSubject(subjectId);
                if(success){
                    res.status(201).json({
                        success:true,
                        message:"Subject deleted succesfully"
                    });
                }else{
                    res.status(404).json({
                        error:"Subject not found"
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
    //  update subject
    async updateSubject(req:Request,res:Response):Promise<void>{
        const subject_id = req.params.id;
        const{subject_name} = req.body;
        //  these names should be exact name of the column in database;

        try {
            const success = await subjectService.updateSubject(subject_id,subject_name);

            if(success){
                res.status(201).json({
                    success:true,
                    message:"Subject updated succesfully"
                });
            }else{
                res.status(404).json({
                    error:"Subject not found"
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

export default new SubjectController();