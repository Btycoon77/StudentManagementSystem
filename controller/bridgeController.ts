import { Request,Response } from "express";
import BridgeService from "../services/BridgeService";


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
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(501).json({
                error:"Internal server error"
            })
        }
    }

    async getStudentsWithSubjects(req:Request,res:Response):Promise<any>{
        try {
            const result = await BridgeService.getStudentsWithSubjects();
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(501).json({
                error:"Internal server error"
            })
        }
    }
    
    async chooseSubjects(req:Request,res:Response):Promise<void>{
        try {
            // const result = await BridgeService.chooseSubjects();

        } catch (error) {
            res.status(501).json({
                error:"Internal server error"
            })
        }
    }
        
}

export default  new BridgeController();

