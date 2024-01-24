"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
//  when you want the data uploaded by the user to be stored in
// the local storage of the 
// const storage = multer.diskStorage({
//   destination: "./public",//yesko path dida jahile root directory bata diney
//    filename: (req, file, cb) => {
//      console.log(req.file);
//      cb(null, file.originalname);
//  },
// });
const storage = multer_1.default.memoryStorage();
const uploadMiddleware = (0, multer_1.default)({
    storage: storage,
});
exports.default = uploadMiddleware;
//# sourceMappingURL=fileUpload.js.map