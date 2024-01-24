import { Router } from 'express';
import studentController from '../controller/studentController';
import BridgeService from '../services/BridgeService';
import bridgeController from '../controller/bridgeController';
import Dbfunction from '../sqlfunctions/functions';

const studentRouter = Router();

studentRouter.put('/students/:guid',studentController.updateStudent);

 
// creating student

studentRouter.post('/students',studentController.createStudent);

// route for getting list of students;

studentRouter.get('/students',studentController.getListOfStudents);

studentRouter.delete('/deleteStudent/:guid',studentController.deleteStudent);

//  route for getting student by id with their subject and percentage
studentRouter.get('/students/:guid',bridgeController.getStudentByIdFromDB);

// soft deleting the student 
studentRouter.delete('/students/:guid',studentController.deleteStudent);

// hard deleting the student;
studentRouter.delete('/hardDeleteStudent/:guid',studentController.hardDeleteStudent);

//  route for choosing the subject;

studentRouter.post('/students/:StudentId',bridgeController.marksObtained);

// studentRouter.post('/choose/:guid',bridgeController.assignSubjects);

// login route

studentRouter.post('/student/login',studentController.loginController);

//  route for getting all student with subjects
studentRouter.get('/getStudentWithSubjects',bridgeController.getStudentsWithSubjects);



// route for db function pagination; only student data || no subject
studentRouter.get('/studentPaginationDb',studentController.getDBfunctionPagination);

// route for db paginationJoin SQL function
studentRouter.get('/studentPaginationSQLDb',studentController.getDBfunctionJoinPagination);

studentRouter.get('/joinDbFunction',studentController.getJoinData);


//  route for studentSubject sql function;
studentRouter.get('/studentSubjectPagination',bridgeController.getStudentSubjectPagination);


//  route for generating pdf;

studentRouter.get('/generatePdf/:StudentId',studentController.generatePDFController)

export default studentRouter;




