
import { Request,Response } from "express";
import { connectDb } from "../db/connectDb";
import { QueryTypes } from "sequelize";


class DBfunctions{
    async registerStudent(req:Request,res:Response):Promise<any>{
        const {student_name,age} = req.body;
        
        try {
            const result = connectDb.query(
                `select * from register_student(:student_name,age)`,{
                    replacements:{
                        student_name,age
                    },
                    type:QueryTypes.SELECT,
                }
            );
            res.status(201).json({
                student: result
            });
        } catch (error) {
            res.status(501).json({
                error:"Internal server error"
            })
        }
    }
}

export default new DBfunctions();