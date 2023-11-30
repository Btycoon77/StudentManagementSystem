import { Router } from 'express';
import subjectController from '../controller/subjectController';

const subjectRouter = Router();

subjectRouter.put('/updateSubject/:guid',subjectController.updateSubject);

subjectRouter.get('/getAllSubjects',subjectController.getAllSubjects);

subjectRouter.post('/createSubject',subjectController.createSubject);

subjectRouter.delete('/deleteSubject/:guid',subjectController.deleteSubject);

export default subjectRouter;




