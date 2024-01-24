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
const translationRoute_1 = __importDefault(require("./routes/translationRoute"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const api_json_1 = __importDefault(require("./config/api.json"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// load the yaml file for swagger
//  connect to the database;
(0, configDb_1.db)();
// middlewares
app.use('/public', express_1.default.static(__dirname + '/public'));
app.use(body_parser_1.default.json({
    limit: '10mb'
}));
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true,
}));
// use express-fielupload middleware for handling file uploads;
// app.use(fileUpload({
//   useTempFiles:true,
//   tempFileDir:'./public',
// }));
// swagger route
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(api_json_1.default));
// app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));
app.use('/api/v1', studentRoutes_1.default);
app.use('/api/v1', subjectRoutes_1.default);
app.use('/api/v1', chapterRoutes_1.default);
app.use('/api/v1', translationRoute_1.default);
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