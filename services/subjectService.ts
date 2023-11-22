import { SubjectModel } from "../models/subjectModel";

class SubjectService{
   
    //  to get all students
    async getAllSubjects():Promise<any[]>{
        return await SubjectModel.findAll();
    }
    
    //  to create subject
    async createSubject(subject_name:string):Promise<any>{
            return await SubjectModel.create({subject_name});
            // whatever the name of the column in database it should be the same 
    }

    //  to delete subjects
    async deleteSubject(subject_id:any):Promise<boolean>{
        try {
            const subject = await SubjectModel.findByPk(subject_id);
            // alterntively I can do this too.
            // const result = await SubjectModel.destroy({
            //     where:{
            //         subject_id:subjectId
            //     }
            // });
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

    async updateSubject(subjectId:any,subject_name:string):Promise<boolean>{
        try {
            const subject:any = await SubjectModel.findByPk(subjectId);
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