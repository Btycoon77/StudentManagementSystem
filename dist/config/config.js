"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerJSDocs = yamljs_1.default.load("api.yaml");
module.exports = { swaggerServe: swagger_ui_express_1.default, swaggerSetup: swagger_ui_express_1.default.setup(swaggerJSDocs) };
//# sourceMappingURL=config.js.map