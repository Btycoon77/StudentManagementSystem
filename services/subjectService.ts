import { Op, literal } from "sequelize";
import  SubjectModel, { Subject }  from "../models/subjectModel";

class SubjectService{
   
    //  to get all students
    async getAllSubjects():Promise<any[]>{
        return await SubjectModel.findAll({
            where:{
                datedeleted:{
                    [Op.is]:literal('null')
                }
            }
        });
    }
    
    //  to create subject
    async createSubject(subject: Subject):Promise<any>{
            return await SubjectModel.create(subject);
            // whatever the name of the column in database it should be the same 
    }

    //  to delete subjects
    async deleteSubject(guid:any):Promise<boolean>{
        try {
            const subject = await SubjectModel.findOne({
                where:{
                    guid:guid
                }
            });
            // alterntively I can do this too.
            // const result = await SubjectModel.destroy({
            //     where:{
            //         subject_id:subjectId
            //     }
            // });
            if(!subject){
                return false;
            }
            await subject.update({datedeleted: literal('NULL')})
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

}

export default new SubjectService();