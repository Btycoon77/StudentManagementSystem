import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';

export const StudentModel = connectDb.define("students",{
    student_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    guid:{
        type:DataTypes.UUID,
        allowNull:false,
        defaultValue:UUIDV4,
        
    },
    student_name:{
        type:DataTypes.STRING,
        allowNull:false

    },
    age:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
},{timestamps:true,freezeTableName:true,
});

// StudentModel.sync({alter:true});




