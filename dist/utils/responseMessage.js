"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessage = void 0;
const responseMessage = (res, statusCode, data, message, method) => {
    return res.status(statusCode || 200).json({
        message: (message === null || message === void 0 ? void 0 : message.length) ? message : "default message",
        method: method.toUpperCase(),
        data: Object.keys(data).length ? data : [],
        statusCode: statusCode || 200,
    });
};
exports.responseMessage = responseMessage;
