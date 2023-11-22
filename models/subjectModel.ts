import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';


export const SubjectModel = connectDb.define("subjects",{
    subject_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    guid:{
        type:DataTypes.UUID,
        defaultValue:UUIDV4
        
    },
    subject_name:{
        type:DataTypes.STRING,

    },
    
},{timestamps:true,freezeTableName:true});

// SubjectModel.sync({alter:true});