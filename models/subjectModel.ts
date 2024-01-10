import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';

export interface Subject{
    subject_id: number;
    subject_name:string;
    guid:string;
    datedeleted: Date;
    datecreated: Date;
}


export const SubjectModel = connectDb.define("subjects",{
    subject_id:{
                        type:DataTypes.INTEGER,
                        autoIncrement:true,
                        allowNull:false,
                        primaryKey:true
                    },
                    guid:{
                        type:DataTypes.UUID,
                        defaultValue:UUIDV4,
                        unique:true // must define this for upsert
                        
                    },
                    subject_name:{
                        type:DataTypes.STRING,
                        unique:true
                
                    },
                    datedeleted:{
                        type: DataTypes.DATE,
                        
                
                    },
                    datecreated:{
                        type: DataTypes.DATE,
                        defaultValue: Date.now()
                        
                    },
                    //tottal marks create field
                    totalmarks:{
                        type:DataTypes.INTEGER,
                        defaultValue:100
                    }
},{freezeTableName:true,timestamps:false});


// class SubjectModel extends Model<Subject> {
    
// }

// SubjectModel.init(
//     {
//             subject_id:{
//                 type:DataTypes.INTEGER,
//                 autoIncrement:true,
//                 allowNull:false,
//                 primaryKey:true
//             },
//             guid:{
//                 type:DataTypes.UUID,
//                 defaultValue:UUIDV4
                
//             },
//             subject_name:{
//                 type:DataTypes.STRING,
        
//             },
//             datedeleted:{
//                 type: DataTypes.DATE,
                
        
//             },
//             datecreated:{
//                 type: DataTypes.DATE,
//                 defaultValue: Date.now()
                
//             },
//         },{ sequelize: connectDb, modelName: 'subjects',freezeTableName:true,timestamps:false}
// );

// SubjectModel.sync({alter:true});

export default SubjectModel;


