"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
class SubjectModel extends sequelize_1.Model {
}
SubjectModel.init({
    subject_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    guid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4
    },
    subject_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE,
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: Date.now()
    },
}, { sequelize: connectDb_1.connectDb, modelName: 'subjects', freezeTableName: true, timestamps: false });
// SubjectModel.sync({alter:true});
exports.default = SubjectModel;
