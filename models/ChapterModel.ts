import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';


export const ChapterModel = connectDb.define("chapter",{
  chapter_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  chapter_name: {
    type: DataTypes.STRING,
    allowNull:false
  },
  description: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  guid: {
    type: DataTypes.UUID,
    defaultValue:UUIDV4,
    unique:true
  },
  parent_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"chapters",
        key:"chapter_id"
      }
      

  },
  subject_id:{
      type: DataTypes.INTEGER,
      references:{
        model:"subjects",
        key:"subject_id"
      }
      
      
  },
  datedeleted:{
    type:DataTypes.DATE,
    defaultValue:null
  },
  datecreated:{
    type:DataTypes.DATE,
    // defaultValue: new Date()
  }
},
{ modelName: 'chapter',freezeTableName:true,timestamps:false});


export default ChapterModel;





