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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUsers = void 0;
const studentModel_1 = require("../models/studentModel");
//  database query to get all the users;
const fetchAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield studentModel_1.StudentModel.findAll();
});
exports.fetchAllUsers = fetchAllUsers;
//  databae query to create new users;
// export const createNewUser = async(data:)=>{
//     return await StudentModel.create(data);
// }
