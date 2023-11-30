import { Router } from 'express';
import studentController from '../controller/studentController';
import BridgeService from '../services/BridgeService';
import bridgeController from '../controller/bridgeController';
import Dbfunction from '../sqlfunctions/functions';

const studentRouter = Router();

studentRouter.put('/updateStudent/:guid',studentController.updateStudent);

studentRouter.get('/getAllStudents',studentController.getAllStudents);

studentRouter.post('/createStudent',studentController.createStudent);

//  for dbfunctions route 
studentRouter.post('/createStudentFromDb',Dbfunction.registerStudent);

studentRouter.delete('/deleteStudent/:guid',studentController.deleteStudent);

//  route for choosing the subject;

studentRouter.post('/chooseSubjects/:student_id',BridgeService.chooseSubjects);

//  route for choosing specific students;
studentRouter.get('/getStudentWithSubjects/:student_id',BridgeService.getOneStudentsWithSubjects);


studentRouter.get('/getStudentWithSubjects',bridgeController.getStudentsWithSubjects);

// route for student pagination;

studentRouter.get('/studentPagination',studentController.getPaginatedStudents);

// route for db function pagination;
studentRouter.get('/studentPaginationDb',studentController.getDBfunctionPagination);


//  route for studentSubjectPagination;
studentRouter.get('/studentSubjectPagination',bridgeController.getStudentSubjectPagination);

// studentRouter.get("/studentPagination'?pageSize=10&page=1&search='Ram'&orderBy='student_id'&orderDir='ASC'",studentController.getPaginatedStudents);

export default studentRouter;




