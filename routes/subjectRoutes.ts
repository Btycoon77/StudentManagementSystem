import { Router } from 'express';
import subjectController from '../controller/subjectController';
import authMiddleware from '../middlewares/auth';

const subjectRouter = Router();

subjectRouter.put('/subjects/:guid',subjectController.updateSubject);

// get subject by id
subjectRouter.get('/subjects/:guid',subjectController.getSubjectById);

// subject pagination
subjectRouter.get('/subjects',authMiddleware,subjectController.getListOfSubjects);

subjectRouter.post('/subjects',subjectController.createSubject);

// to insert chapters recursively;(using CTE)
subjectRouter.post('/subjects/chapters/bulk',subjectController.insertSubjectChaptersBulk);

//  to insert chapter in bulk(bulk insert)
subjectRouter.post('/subjects/chapters',subjectController.insertSubjectChaptersRecurisively);

// soft delete subject
subjectRouter.delete('/subjects/:guid',subjectController.deleteSubject);

// hard delete subject
subjectRouter.delete('/hardDeleteSubject/:guid',subjectController.hardDelete);

// getting all the chapter of the specific subject(guid)
subjectRouter.get('/subjects/:guid/chapters',subjectController.getChapters);


export default subjectRouter;




