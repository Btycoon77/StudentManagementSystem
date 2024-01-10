import { Router } from 'express';
import subjectController from '../controller/subjectController';

const subjectRouter = Router();

subjectRouter.put('/subjects/:guid',subjectController.updateSubject);

// get subject by id
subjectRouter.get('/subjects/:guid',subjectController.getSubjectById);

subjectRouter.get('/subjects',subjectController.getListOfSubjects);

subjectRouter.post('/subjects',subjectController.createSubject);

// to insert chapters recursively;
subjectRouter.post('/subjects/chapters/bulk',subjectController.insertSubjectChaptersBulk);

//  to insert chapter in bulk
subjectRouter.post('/subjects/chapters',subjectController.insertSubjectChaptersRecurisively);

// soft delete subject
subjectRouter.delete('/subjects/:guid',subjectController.deleteSubject);

// hard delete subject
subjectRouter.delete('/hardDeleteSubject/:guid',subjectController.hardDelete);


subjectRouter.get('/subjects/:guid/chapters',subjectController.getChapters);


export default subjectRouter;




