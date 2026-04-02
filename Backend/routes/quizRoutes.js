import express from 'express';
import {
  generateQuiz,
  submitQuiz,
  getMyQuizzes,
  getQuizById,
  deleteQuiz,
} from '../controllers/quizController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post('/generate',  protect, generateQuiz);
router.post('/submit/:id', protect, submitQuiz);
router.get('/',           protect, getMyQuizzes);
router.get('/:id',        protect, getQuizById);
router.delete('/:id',     protect, deleteQuiz);

export default router;