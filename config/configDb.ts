import { connectDb } from "../db/connectDb";


export const db = () => {
  try {
    connectDb.authenticate();
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};


