"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Management System API',
            version: '1.0.0',
            description: 'Handling all the functions related to student',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1'
            }
        ]
    },
    apis: ["../routes/*.ts"],
    // Path to the API docs
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
// module.exports = (app:any) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// };
//# sourceMappingURL=swagger.js.map