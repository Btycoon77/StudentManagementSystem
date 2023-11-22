import { Router } from 'express';
import subjectController from '../controller/subjectController';

const subjectRouter = Router();

subjectRouter.put('/updateSubject/:id',subjectController.updateSubject);

subjectRouter.get('/getAllSubjects',subjectController.getAllSubjects);

subjectRouter.post('/createSubject',subjectController.createSubject);

subjectRouter.delete('/deleteSubject/:id',subjectController.deleteSubject);

export default subjectRouter;




