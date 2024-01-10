import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';

export interface StudentHistory{
    studentHistory_id: number;
    student_name:string;
    age:number;
    guid:string;
    datedeleted: Date;
    datecreated: Date;
    student_id:number;
    operation:string;
}


class StudentHistoryModel extends Model<StudentHistory> {
    
}

StudentHistoryModel.init(
  {
    studentHistory_id: {
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
    },
    datedeleted:{
        type: DataTypes.DATE,
        

    },
    datecreated:{
        type: DataTypes.DATE,
        defaultValue:Date.now(),
  
    },
    student_id:{
        type:DataTypes.INTEGER,
        references:{
            model:"students",
            key:"student_id"
        }
    },
    operation:{
      type: DataTypes.STRING
    },
  },
  { sequelize: connectDb, modelName: 'studentHistory',freezeTableName:true,timestamps:false}
);

// StudentHistoryModel.sync({alter:true});

export default StudentHistoryModel;





