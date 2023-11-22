import { Router } from 'express';
import studentController from '../controller/studentController';

const studentRouter = Router();

studentRouter.put('/updateStudent/:id',studentController.updateStudent);

studentRouter.get('/getAllStudents',studentController.getAllStudents);

studentRouter.post('/createStudent',studentController.createStudent);

studentRouter.delete('/deleteStudent/:id',studentController.deleteStudent);

export default studentRouter;




