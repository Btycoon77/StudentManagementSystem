import {DataTypes, UUIDV4} from 'sequelize';
import { connectDb } from '../db/connectDb';


export const BridgeModel = connectDb.define("studentsubjects",{
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
    datedeleted:{
        type: DataTypes.DATE,

    },
    datecreated:{
        type: DataTypes.DATE,
        
    },
    // foreign key
    student_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"students",
            key:"student_id"
        },
    
    }
},{freezeTableName:true,timestamps:false});

// BridgeModel.sync({alter:true});
// BridgeModel.belongsTo(StudentModel)
