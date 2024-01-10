"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const sequelize_1 = require("sequelize");
exports.connectDb = new sequelize_1.Sequelize({
    database: process.env.DB_DATABASE || 'sms',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '9192631770abcde',
    host: process.env.DB_HOST || 'localhost',
    dialect: "postgres",
});
//# sourceMappingURL=connectDb.js.map