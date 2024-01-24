import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';
import  SubjectModel  from './subjectModel';
import { BridgeModel } from './bridgeModel';

export interface Student{
    student_id: number;
    student_name:string;
    age:number;
    guid:string;
    datedeleted: Date;
    datecreated: Date;
}


// class StudentModel extends Model<Student> {

    
// }

// StudentModel.init(
//   {
//     student_id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },
//     student_name: {
//       type: DataTypes.STRING,
//     },
//     age: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     guid: {
//       type: DataTypes.UUID,
//       defaultValue:UUIDV4,
//     },
//     datedeleted:{
//         type: DataTypes.DATE,
        

//     },
//     datecreated:{
//         type: DataTypes.DATE,
//         defaultValue:Date.now(),
        
//     }
//   },
//   { sequelize: connectDb, modelName: 'students',freezeTableName:true,timestamps:false}
// );


export const StudentModel = connectDb.define("students",{
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  student_name: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  guid: {
    type: DataTypes.UUID,
    defaultValue:UUIDV4,
    unique:true
  },
  datedeleted:{
      type: DataTypes.DATE,
      
      

  },
  datecreated:{
      type: DataTypes.DATE,
      defaultValue:Date.now(),
      
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false,

  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  }
},
{ modelName: 'students',freezeTableName:true,timestamps:false});







// StudentModel.sync({alter:true});

// to establish one-to-many relations between tables;


// to establish many-to-many relations between the tables I must use belongsToMany();



StudentModel.belongsToMany(SubjectModel,{through:BridgeModel,foreignKey:'student_id'});

SubjectModel.belongsToMany(StudentModel,{through:BridgeModel,foreignKey:'subject_id'});

// StudentModel.hasMany(BridgeModel,{foreignKey:'student_id'});


export default StudentModel;





