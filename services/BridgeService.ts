import { Request,Response } from "express";
import  {BridgeModel} from "../models/bridgeModel";
import StudentModel, { Student } from "../models/studentModel";
import  SubjectModel  from "../models/subjectModel";
import { connectDb } from "../db/connectDb";
import { Model, Op, QueryTypes, literal } from "sequelize";

class BridgeService{
  
    async chooseSubjects(req:Request,res:Response):Promise<void>{
        const student_id = req.params.student_id;
        const chooseSubjects = req.body.choosenSubjects as number[]  // Assuming an array of subjectids;

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
            const sql = `Select std.student_id ,std.student_name,sub.subject_id, sub.subject_name FROM Students std JOIN studentsubjects  studsub
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
                  student_id: row.student_id,
                  student_name: row.student_name,
                  subjects: [
                    {
                      subject_id: row.subject_id,
                      subject_name: row.subject_name,
                    },
                  ],
                };
              });
          
              res.status(200).json(formattedResult);
        
        } catch (error) {
            console.log(error);
            
        }

    }

    // get one student and subjects

    async getOneStudentsWithSubjects(req:Request,res:Response):Promise<any>{
      try {
          const sql = `Select std.student_id ,std.student_name,sub.subject_id, sub.subject_name FROM Students std JOIN studentsubjects  studsub
          ON  std.student_id = studsub.student_id 
          JOIN subjects sub  ON  studsub.subject_id = sub.subject_id where student_id=${req.params.student_id}
          `;
          const studentSubject = await connectDb.query(sql,{
              type:QueryTypes.SELECT,
              raw:true
          });
           
        
          console.log("from bridge service",studentSubject);
          const formattedResult = studentSubject.map((row: any) => {
              return {
                student_id: row.student_id,
                student_name: row.student_name,
                subjects: [
                  {
                    subject_id: row.subject_id,
                    subject_name: row.subject_name,
                  },
                ],
              };
            });
        
            res.status(200).json(formattedResult);
      
      } catch (error) {
          console.log(error);
          
      }
      
  }

    
}

export default new BridgeService();