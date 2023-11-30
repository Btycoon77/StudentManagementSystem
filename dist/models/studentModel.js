"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
const subjectModel_1 = __importDefault(require("./subjectModel"));
const bridgeModel_1 = require("./bridgeModel");
class StudentModel extends sequelize_1.Model {
}
StudentModel.init({
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    student_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    guid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4,
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE,
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: Date.now(),
    }
}, { sequelize: connectDb_1.connectDb, modelName: 'students', freezeTableName: true, timestamps: false });
// StudentModel.sync({alter:true});
// to establish one-to-many relations between tables;
// StudentModel.hasMany(BridgeModel,{foreignKey:'student_id'});
// to establish many-to-many relations between the tables I must use belongsToMany();
StudentModel.belongsToMany(subjectModel_1.default, { through: bridgeModel_1.BridgeModel, foreignKey: 'student_id' });
subjectModel_1.default.belongsToMany(StudentModel, { through: bridgeModel_1.BridgeModel, foreignKey: 'subject_id' });
exports.default = StudentModel;
