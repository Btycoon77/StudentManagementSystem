import { Router } from 'express';
import chapterController from '../controller/chapterController';

const chapterRouter = Router();

chapterRouter.get('/subject/chapters',chapterController.getChapterList);

export default chapterRouter;




