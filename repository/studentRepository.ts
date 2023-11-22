import { StudentModel } from "../models/studentModel";

//  database query to get all the users;

export const fetchAllUsers = async()=>{
    return await StudentModel.findAll();
}

//  databae query to create new users;

// export const createNewUser = async(data:)=>{
//     return await StudentModel.create(data);
// }