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
const error_exception_1 = __importDefault(require("./exception/error_exception"));
const chapterRoutes_1 = __importDefault(require("./routes/chapterRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
//  connect to the database;
(0, configDb_1.db)();
// middlewares
app.use(body_parser_1.default.json());
app.use('/api/v1', studentRoutes_1.default);
app.use('/api/v1', subjectRoutes_1.default);
app.use('/api/v1', chapterRoutes_1.default);
// error middleware
app.use(error_exception_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: err.message,
        statusCode: 500,
        message: 'Internal Server Error'
    });
});
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map