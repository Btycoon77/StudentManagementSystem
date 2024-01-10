import { Request,Response } from "express";
import chapterService from "../services/chapterService";
import { connectDb } from "../db/connectDb";
import { QueryTypes } from "sequelize";

class ChapterController{

// get all chapters;

async getListOfChapters(req:Request,res:Response):Promise<any>{
    try {
        const queryParams = {
            pageSize: req.query.pageSize,
            page: req.query.page,
            search: req.query.search,
            orderBy:req.query.orderBy,
            orderDir: req.query.orderDir
        };
        const chapter = await chapterService.getListOfChapters(queryParams);
        res.status(200).json(chapter.chapters.map((data:any)=>{
            return {
                guid: data.guid,
                ChapterName: data.chapter_name,
                // Children: []
            }
        }));
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error
        })
    }
}

// get chapter pagination (making the use of dynamic query)

async getChapterList(req:Request,res:Response):Promise<any>{
    try {
        
        const    pageSize= req.query.pageSize;
        const   page=req.query.page;
        const    search= req.query.search;
        const   orderBy=req.query.orderBy;
        const   orderDir= req.query.orderDir;
        
       
        const chapter = await connectDb.query(`select public.getchapterpagination(:pageSize,:page,:search,:orderBy,:orderDir)`,{
            replacements:{
                pageSize:pageSize,
                page:page,
                search:search,
                orderBy:orderBy,
                orderDir:orderDir
            },
            type:QueryTypes.SELECT
        });
        // res.status(200).json(chapter);
        res.status(200).json(chapter.map((data:any)=>{
                    return {

                        ChapterId:data.getchapterpagination.ChapterId,
                        ChapterName: data.getchapterpagination.ChapterName
                    }


                
        }));
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:error
        })
    }
}

}

export default  new ChapterController();