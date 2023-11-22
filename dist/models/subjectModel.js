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
        defaultValue: sequelize_1.UUIDV4
    },
    subject_name: {
        type: sequelize_1.DataTypes.STRING,
    },
}, { timestamps: true, freezeTableName: true });
// SubjectModel.sync({alter:true});
