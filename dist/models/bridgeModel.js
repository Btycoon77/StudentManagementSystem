"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeModel = void 0;
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
exports.BridgeModel = connectDb_1.connectDb.define("studentsubjects", {
    studsub_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    guid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4
    },
    //  foreign key
    subject_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "subjects",
            key: "subject_id"
        }
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE,
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE,
    },
    // foreign key
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "students",
            key: "student_id"
        },
    }
}, { freezeTableName: true, timestamps: false });
// BridgeModel.sync({alter:true});
// BridgeModel.belongsTo(StudentModel)
