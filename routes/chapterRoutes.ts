import { Router } from 'express';
import chapterController from '../controller/chapterController';
import subjectController from '../controller/subjectController';

const chapterRouter = Router();

chapterRouter.get('/subject/chapters',chapterController.getChapterList);

chapterRouter.get('/subjects/:guid/chapters',subjectController.getChapters);

export default chapterRouter;




