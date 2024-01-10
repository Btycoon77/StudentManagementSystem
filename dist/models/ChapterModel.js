"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterModel = void 0;
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
exports.ChapterModel = connectDb_1.connectDb.define("chapter", {
    chapter_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    chapter_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    guid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4,
        unique: true
    },
    parent_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "chapters",
            key: "chapter_id"
        }
    },
    subject_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "subjects",
            key: "subject_id"
        }
    },
    datedeleted: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null
    },
    datecreated: {
        type: sequelize_1.DataTypes.DATE,
        // defaultValue: new Date()
    }
}, { modelName: 'chapter', freezeTableName: true, timestamps: false });
exports.default = exports.ChapterModel;
//# sourceMappingURL=ChapterModel.js.map