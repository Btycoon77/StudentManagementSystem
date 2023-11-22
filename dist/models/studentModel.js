"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
exports.StudentModel = connectDb_1.connectDb.define("students", {
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    guid: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize_1.UUIDV4,
    },
    student_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, { timestamps: true, freezeTableName: true,
});
// StudentModel.sync({alter:true});
