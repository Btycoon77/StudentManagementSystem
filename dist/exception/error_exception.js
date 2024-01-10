"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//  error handler
exports.default = (error, req, res, next) => {
    res.status(409).json({
        error: error === null || error === void 0 ? void 0 : error.message,
        statusCode: 409,
        // message: error?.message
    });
};
//# sourceMappingURL=error_exception.js.map