import { StudentModel } from "../models/studentModel";

class StudentService{
   
    //  to get all students
    async getAllStudents():Promise<any[]>{
        return await StudentModel.findAll();
    }
    
    //  to create student
    async createStudent(student_name:string,age:number):Promise<any>{
            return await StudentModel.create({student_name,age});
            // whatever the name of the column in database it should be the same 
    }

    //  to delete students
    async deleteStudent(studentId:any):Promise<boolean>{
        try {
            const student = await StudentModel.findByPk(studentId);
            // alterntively I can do this too.
            // const result = await StudentModel.destroy({
            //     where:{
            //         student_id:studentId
            //     }
            // });
            if(!student){
                return false;
            }
            await student.destroy();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    //  to update the student

    async updateStudent(studentId:any,student_name:string,age:number):Promise<boolean>{
        try {
            const student:any = await StudentModel.findByPk(studentId);
            if(!student){
                return false
            }
            student.student_name = student_name;
            student.age = age;

            await student.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}

export default new StudentService();