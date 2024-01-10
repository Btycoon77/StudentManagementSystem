"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectModel = void 0;
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
exports.SubjectModel = connectDb_1.connectDb.define("subjects", {
    subject_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    guid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4,
        unique: true // must define this for upsert
    },
    subject_name: {
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE,
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: Date.now()
    },
    //tottal marks create field
    totalmarks: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 100
    }
}, { freezeTableName: true, timestamps: false });
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
exports.default = exports.SubjectModel;
//# sourceMappingURL=subjectModel.js.map