import multer from "multer";

//  when you want the data uploaded by the user to be stored in
// the local storage of the 
// const storage = multer.diskStorage({
//   destination: "./public",//yesko path dida jahile root directory bata diney
//    filename: (req, file, cb) => {
//      console.log(req.file);
//      cb(null, file.originalname);
//  },
// });
const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage: storage,
});


export default uploadMiddleware;
