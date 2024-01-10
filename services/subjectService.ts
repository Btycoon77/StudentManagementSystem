import { Op, literal } from "sequelize";
import  SubjectModel, { Subject }  from "../models/subjectModel";
import { NextFunction } from "express";
import ChapterModel from "../models/ChapterModel";
import { ChapterInfo } from "../utils/utill";

class SubjectService{
   
    //  to get all subjects
    
    async getListOfSubjects(queryParams:any):Promise<any>{
        const {pageSize,page,search,orderBy,orderDir} = queryParams;
  
        const offset = (page -1) *pageSize;

        // const sql= " SELECT * FROM students  WHERE student_name LIKE '%Ram%' ORDER BY student_id ASC LIMIT '10' OFFSET 0;";
        
        // whenver you want to inject sequelize property then make the use of {}
        const subjects = await SubjectModel.findAndCountAll({
          limit:pageSize,
          offset:offset,
        attributes:['guid','subject_name'],
          where:{
            subject_name:{
              [Op.iLike]:`%${search}%`
            },
            datedeleted: {
                [Op.is]: literal('null')
            }
            
          },
          order:[[orderBy,orderDir]]
        });
  
        const totalPages = Math.ceil(subjects.count/pageSize);
  
        const result = {
        //   pageSize,
        //   page,
        //   totalPages,
          subjects: subjects.rows
          
        };
        return result;
  
      }
   
    
    //  to create subject
    async createSubject(subject: any,next:NextFunction):Promise<any>{
        const checkSubject = await SubjectModel.count({
          
            where:{
                subject_name:subject.subject_name,
            
            }
        });
            if(checkSubject >0){
                 next(Error("subject with that name already exists"));
            }
            return await SubjectModel.create(subject);
    }

    //  to create chapters;

        async createChapter(chapter: any):Promise<any>{
        // const checkSubject = await SubjectModel.count({
        
        //     where:{
        //         subject_name:subject.subject_name,
            
        //     }
        // });
        //     if(checkSubject >0){
        //         next(Error("subject with that name already exists"));
        //     }
            return await ChapterModel.create(chapter
                
            );
    }



    //  to delete subjects
    async deleteSubject(guid:any):Promise<boolean>{
        try {
            const subject = await SubjectModel.findOne({
                where:{
                    guid:guid
                }
            });
            
            if(!subject){
                return false;
            }
            await subject.update({datedeleted: new Date()})
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // to hard delete subjects;

    async hardDeleteSubject(guid:any):Promise<boolean>{
        try {
            const subject  = await SubjectModel.findOne({
                where:{
                    guid:guid
                }
            });
            if(!subject){
                return false;
            }
            await subject.destroy();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    //  to update the subject

    async updateSubject(guid:any,subject_name:string):Promise<boolean>{
        try {
            const subject:any = await SubjectModel.findOne({
                where:{
                    guid:guid
                }
            });
            if(!subject){
                return false
            }
            subject.subject_name = subject_name;
            await subject.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // get subject by id
    async getSubjectById(guid:any):Promise<any>{
        try {
            const subject:any = await SubjectModel.findOne({
                attributes:['subject_id','subject_name'],
                where:{
                    guid:guid
                }
            });
            if(!subject){
                throw Error('Subject not found');
            }
            
            return subject;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}

export default new SubjectService();