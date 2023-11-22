import {DataTypes, Model, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';

export const BridgeModel = connectDb.define("studentSubject",{
    studsub_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    guid:{
        type:DataTypes.UUID,
        defaultValue:UUIDV4
        
    },
    //  foreign key
    subject_id:{
        type:DataTypes.INTEGER,
        references:{
            model:"subjects",
            key:"subject_id"
        }

    },
    // foreign key
    student_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"students",
            key:"student_id"
        }
    }
},{freezeTableName:true});

// BridgeModel.sync({alter:true});
