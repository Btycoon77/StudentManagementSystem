"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const connectDb_1 = require("../db/connectDb");
const db = () => {
    try {
        connectDb_1.connectDb.authenticate();
        console.log("database connected successfully");
    }
    catch (error) {
        console.log(error);
    }
};
exports.db = db;
