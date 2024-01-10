"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
class SubjectHistoryModel extends sequelize_1.Model {
}
SubjectHistoryModel.init({
    subjectHistory_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    subject_name: {
        type: sequelize_1.DataTypes.STRING,
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
    operation: {
        type: sequelize_1.DataTypes.STRING
    },
    subject_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "subjects",
            key: "subject_id"
        }
    },
}, { sequelize: connectDb_1.connectDb, modelName: 'subjectHistory', freezeTableName: true, timestamps: false });
// SubjectHistoryModel.sync({alter:true});
exports.default = SubjectHistoryModel;
//# sourceMappingURL=subjectHistoryModel.js.map