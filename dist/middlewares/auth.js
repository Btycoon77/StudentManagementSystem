"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Auth failed', success: false });
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).json({
                    message: "Auth failed"
                });
            }
            else {
                console.log("succesfully authenticated");
                // creating decoded in req.body for its further user;
                req.body.decoded = decode;
                //  so basically you are getting the guid of the user that has logged in;
                console.log(req.body.decoded);
            }
        });
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map