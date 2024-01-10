import { Request,Response } from "express";
import  {BridgeModel} from "../models/bridgeModel";
import StudentModel, { Student } from "../models/studentModel";
import  SubjectModel  from "../models/subjectModel";
import { connectDb } from "../db/connectDb";
import { Model, Op, QueryTypes, literal } from "sequelize";

class BridgeService{
  
  // POST : /students/::studentuuid
// Payload/Body : {StudentId:"",StudentName:"",Subjects:[{"SubjectId":"",SubjectName:""}]}

    async chooseSubjects(req:Request,res:Response):Promise<void>{
        const student_id = req.params.student_id;
        const chooseSubjects = req.body.choosenSubjects as number[]  // Assuming an array of subjectids;

        // if student guid exist then update 
        // that student and save the student_id in  a varaible.
        // since subjects comes in array , loop the subject
        // if subject exist then update subject table otherwise insert that record in subject table.
        // then subject_id of that particular insertion should be pushed into a seperate array.
        // then insert this array into bridge table.
        // eg: if ram has chosen gk subject then he cannot choose the same subject again.(dont insert that data) otherwise  insert data;

        try {
          // here are two ids that are important namely student_id and subject_id
             // Remove existing associations for the student(dupilcate data hatauna lai)
            await BridgeModel.destroy({ where: { student_id: student_id } });
            //add new associations based on the chosen subjects

            //  here in BridgeModel (junction table) there are two main attributes namely studnet_id and subject_id and they are inserted respectively;so to speicfy which student has taken what subject we need student_id and subject_id

            await BridgeModel.bulkCreate(chooseSubjects.map(subjectId=>({
                student_id:student_id,
                subject_id:subjectId
            })));

            res.status(200).json({
                message:'Subjects choosen and updated succesufully'
            });
        } catch (error) {
            res.status(500).json("Internal server error");
            console.log(error);
        }
    }

    async  assignSubject(StudentId:string,StudentName:string,age:number,Subjects:any[]):Promise<any>{
      try {
        //  
        // we need to use make indexes here to uniquely identfy the student from the table.
        //  first upserting the student 
        const [student] = await StudentModel.upsert({
          
          student_name: StudentName,
          age:age
        });
        console.log('assign subject',student);

        // secondly upserting the subject;
        const subjectPromises = Subjects.map(async (subject: any) => {
          
          try {
            const [subjectRecord] = await SubjectModel.upsert({  subject_name: subject.SubjectName });

        
          let data = await BridgeModel.upsert({  subject_id: subjectRecord.dataValues.subject_id, student_id: student.dataValues.student_id });
          console.log("from bridgemodel service",data);

      } catch (error) {
        console.log(error);  
      }
      
      });

        await Promise.all(subjectPromises);


        
      } catch (error) {
        console.log("Error in assigning subject",error);
      }
    }

    async getStudentsWithSubjects():Promise<any>{
        try {
           
            const studentSubject = await StudentModel.findAll({
                        // include: [
                        //   {
                        //     model: BridgeModel,
                        //     attributes: [],// from bridgeModel you dont want to retrieve any columns;
                            
                            include: [ // using join
                              {
                                model: SubjectModel,
                                attributes: ['subject_id', 'subject_name'],// but from subjectModel you want to retrieve.these 2 columns;
                                required:false,
                                where:{
                                  datedeleted:{
                                    [Op.is]: literal('null')
                                  }
                                  
                                }
                                
                              },
                            ],
                          // },
                        // ],
                      });
            console.log("from bridge service",studentSubject);
            const formattedResult = studentSubject.map((row: any) => {
                return {
                  student_id: row.student_id,
                  student_name: row.student_name,
                  subjects:row.subjects.map((sub:any)=>{
                    return(
                      {
                        subject_id:sub.subject_id,
                        subject_name: sub.subject_name
                      }
                    )
                  })
                };
              });
          
              return formattedResult;
        
        } catch (error) {
            console.log(error);
            
        }
    }

    async studentSubjectPagination(queryParams:any):Promise<any>{
       
      const {pageSize,page,search,orderBy,orderDir} = queryParams;
      
      try {

          //  use the pagination api

          const offset = (page -1) *pageSize;
    
          const students= await StudentModel.findAndCountAll({
            limit:pageSize,
            offset:offset,
            where:{
              student_name:{
                [Op.iLike]:`%${search}`
              },
              
            },
            include: [ // using join
            {
              model: SubjectModel,
              attributes: ['subject_id', 'subject_name'],// but from subjectModel you want to retrieve.these 2 columns;
              required:false,
              where:{
                datedeleted:{
                  [Op.is]: literal('null')
                }
                
              }  
            },
          ],
            order:[[orderBy,orderDir]]
          });
    
          const totalPages = Math.ceil(students.count/pageSize);
    
          const result = {
            pageSize,
            page,
            totalPages,
            student: students.rows
            
          };
          return result;

          // return formattedResult;
    
    } catch (error) {
        console.log(error);
    }
  }
    async getStudentsWithSubjectss(req:Request,res:Response):Promise<any>{
        try {
            const sql = `Select std.student_name ,std.student_name,sub.subject_id, sub.subject_name FROM Students std JOIN studentsubjects  studsub
            ON  std.student_id = studsub.student_id 
            JOIN subjects sub  ON  studsub.subject_id = sub.subject_id
            `;
            const studentSubject = await connectDb.query(sql,{
                type:QueryTypes.SELECT,
                raw:true
            });
             
          
            console.log("from bridge service",studentSubject);
            const formattedResult = studentSubject.map((row: any) => {
                return {
                  StudentId: row.guid,
                  StudentName: row.student_name,
                  Subjects: [
                    {
                      SubjectId: row.guid,
                      SubjectName: row.subject_name,
                    },
                  ],
                };
              });
          
              res.status(200).json(formattedResult);
        
        } catch (error) {
            console.log(error);
            
        }

    }

    

     //  getting student by id with their chosen subjects

     async getStudentByID(guid:any):Promise<any>{
            
      try {
            const student = await StudentModel.findOne({
              where:{
                  guid:guid,
              },
              include:[
                {
                  model:SubjectModel,
                  attributes:['subject_id','subject_name','guid']
                },
                // {
                //   model:BridgeModel,
                //   attributes:['marksobtained']
                // }
              ]
            });
            if(!student){
              throw Error('student not found');
            }
            
            
            let result = [];
            result.push(student);
          
            const formattedResult = result.map((row:any)=>{
              console.log(row.marksobtained);
              return {
                StudentId: row.guid,
                StudentName: row.student_name,
                age: row.age,
                // Percentage: parseInt(row.marksobtained)/3*100,
                Subjects: row.subjects.map((sub:any)=>{
                  return {

                    SubjectId: sub.guid,
                    SubjectName: sub.subject_name
                  }
                })
              }
            });
            console.log(formattedResult);
            return formattedResult[0];
          } catch (error) {
              console.log(error);   
              
          }
  }

  

    
}

export default new BridgeService();