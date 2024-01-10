"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
class StudentHistoryModel extends sequelize_1.Model {
}
StudentHistoryModel.init({
    studentHistory_id: {
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
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "students",
            key: "student_id"
        }
    },
    operation: {
        type: sequelize_1.DataTypes.STRING
    },
}, { sequelize: connectDb_1.connectDb, modelName: 'studentHistory', freezeTableName: true, timestamps: false });
// StudentHistoryModel.sync({alter:true});
exports.default = StudentHistoryModel;
//# sourceMappingURL=studentHistoryModel.js.map