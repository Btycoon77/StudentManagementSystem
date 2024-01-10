"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next, error) => {
    const errorNotFound = `Not found ${req.originalUrl}`;
    return res.status(404).json({ errorNotFound });
};
exports.default = notFound;
//# sourceMappingURL=notFound.js.map