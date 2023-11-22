"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const configDb_1 = require("./config/configDb");
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
//  connect to the database;
(0, configDb_1.db)();
// middlewares
app.use(body_parser_1.default.json());
app.use('/api/v1', studentRoutes_1.default);
app.use('/api/v1', subjectRoutes_1.default);
app.get('/', (req, res) => {
    res.send("hello world ");
});
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
