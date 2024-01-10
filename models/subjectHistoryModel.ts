import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';

export interface SubjectHistory{
    subjectHistory_id: number;
    subject_name:string;
    guid:string;
    datedeleted: Date;
    datecreated: Date;
    subject_id:number;
    operation: string;
}


class SubjectHistoryModel extends Model<SubjectHistory> {
    
}

SubjectHistoryModel.init(
  {
    subjectHistory_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    subject_name: {
      type: DataTypes.STRING,
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
    operation:{
      type: DataTypes.STRING
    },
    subject_id:{
        type:DataTypes.INTEGER,
        references:{
            model:"subjects",
            key:"subject_id"
        }

    },
  },
  { sequelize: connectDb, modelName: 'subjectHistory',freezeTableName:true,timestamps:false}
);

// SubjectHistoryModel.sync({alter:true});

export default SubjectHistoryModel;





