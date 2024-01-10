import { Op, literal } from "sequelize";
import ChapterModel from "../models/ChapterModel";

class ChapterService{

//  get all chapters

async getListOfChapters(queryParams:any):Promise<any>{
    const{pageSize,page,search,orderBy,orderDir}=  queryParams;

    
    const chapter = await ChapterModel.findAndCountAll({
        limit:pageSize,
        attributes:['guid','chapter_name'],
        where:{
            chapter_name:{
                [Op.iLike]:`%${search}%`
            },
            datedeleted:{
                [Op.is]:literal('null')
            }
        },
        order:[[orderBy,orderDir]]
    });
    const result = {
        chapters:chapter.rows
    };
    return result;
}



}

export default new  ChapterService();